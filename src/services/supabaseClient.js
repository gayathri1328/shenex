/**
 * SHENEX Supabase Authentication & Database Client
 * Implements username-based authentication, user profile management,
 * and persistent analysis history for PR-02.
 */

import { createClient } from '@supabase/supabase-js';

// Read Supabase credentials from environment or fall back to local persistence mode
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to convert clean username into internal authentication identifier
const formatUsernameEmail = (username) => {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  return `${clean}@shenex.local`;
};

// Local storage keys for resilient fallback
const LS_USERS_KEY = 'shenex_auth_users';
const LS_SESSION_KEY = 'shenex_auth_session';
const LS_ANALYSES_KEY = 'shenex_user_analyses';

export const authService = {
  /**
   * Get currently active session user
   */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(LS_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Register a new user with unique username and password
   */
  async signUp(username, password) {
    if (!username || username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const cleanUsername = username.trim();
    const internalEmail = formatUsernameEmail(cleanUsername);

    // 1. Live Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: internalEmail,
        password: password,
        options: {
          data: { username: cleanUsername },
        },
      });

      if (error) throw error;

      const userProfile = {
        id: data.user.id,
        username: cleanUsername,
        created_at: data.user.created_at || new Date().toISOString(),
      };

      // Create profile row
      await supabase.from('profiles').upsert([userProfile]);
      localStorage.setItem(LS_SESSION_KEY, JSON.stringify(userProfile));
      return userProfile;
    }

    // 2. Resilient Local Storage Auth Fallback
    const users = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
    const existing = users.find(u => u.username.toLowerCase() === cleanUsername.toLowerCase());
    if (existing) {
      throw new Error(`Username "${cleanUsername}" is already registered. Please login or choose another.`);
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      username: cleanUsername,
      passwordHash: btoa(password), // simple client hash for local state
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));

    const userProfile = {
      id: newUser.id,
      username: newUser.username,
      created_at: newUser.created_at,
    };

    localStorage.setItem(LS_SESSION_KEY, JSON.stringify(userProfile));
    return userProfile;
  },

  /**
   * Log in with username and password
   */
  async login(username, password) {
    if (!username || !password) {
      throw new Error('Please enter both username and password.');
    }

    const cleanUsername = username.trim();
    const internalEmail = formatUsernameEmail(cleanUsername);

    // 1. Live Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password: password,
      });

      if (error) throw error;

      const userProfile = {
        id: data.user.id,
        username: data.user.user_metadata?.username || cleanUsername,
        created_at: data.user.created_at,
      };

      localStorage.setItem(LS_SESSION_KEY, JSON.stringify(userProfile));
      return userProfile;
    }

    // 2. Resilient Local Storage Auth Fallback
    const users = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
    const user = users.find(
      u => u.username.toLowerCase() === cleanUsername.toLowerCase() && u.passwordHash === btoa(password)
    );

    if (!user) {
      throw new Error('Invalid username or password. Please check your credentials.');
    }

    const userProfile = {
      id: user.id,
      username: user.username,
      created_at: user.created_at,
    };

    localStorage.setItem(LS_SESSION_KEY, JSON.stringify(userProfile));
    return userProfile;
  },

  /**
   * Log out current user
   */
  async logout() {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Continue clearing local state
      }
    }
    localStorage.removeItem(LS_SESSION_KEY);
  },
};

export const databaseService = {
  /**
   * Fetch all saved analyses belonging strictly to current user
   */
  async getUserAnalyses(userId) {
    if (!userId) return [];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    }

    // Local Storage Fallback
    try {
      const all = JSON.parse(localStorage.getItem(LS_ANALYSES_KEY) || '[]');
      return all.filter(a => a.user_id === userId);
    } catch {
      return [];
    }
  },

  /**
   * Save a newly calculated real analysis run
   */
  async saveAnalysis(userId, analysisPayload) {
    const record = {
      id: analysisPayload.analysis_id || `AN_${Date.now()}`,
      analysis_id: analysisPayload.analysis_id || `AN_${Date.now()}`,
      user_id: userId,
      video_metadata: analysisPayload.video_metadata,
      total_unique_tracks: analysisPayload.total_unique_tracks || 0,
      peak_occupancy: analysisPayload.peak_occupancy || 0,
      average_occupancy: analysisPayload.average_occupancy || 0,
      occupancy_timeline: analysisPayload.occupancy_timeline || [],
      dwell_time: analysisPayload.dwell_time || {},
      zones: analysisPayload.zones || [],
      trajectories: analysisPayload.trajectories || [],
      heatmap: analysisPayload.heatmap || [],
      traffic_analysis: analysisPayload.traffic_analysis || [],
      processing_time_seconds: analysisPayload.processing_time_seconds || 0,
      model_information: analysisPayload.model_information || 'Ultralytics YOLOv8n + ByteTrack',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('analyses').insert([record]);
    }

    // Always keep a local copy for instant offline access
    try {
      const all = JSON.parse(localStorage.getItem(LS_ANALYSES_KEY) || '[]');
      all.unshift(record);
      localStorage.setItem(LS_ANALYSES_KEY, JSON.stringify(all));
    } catch (e) {
      console.error('Failed to save analysis locally:', e);
    }

    return record;
  },

  /**
   * Delete an analysis from user history
   */
  async deleteAnalysis(userId, analysisId) {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('analyses').delete().eq('id', analysisId).eq('user_id', userId);
    }

    try {
      const all = JSON.parse(localStorage.getItem(LS_ANALYSES_KEY) || '[]');
      const filtered = all.filter(a => !(a.analysis_id === analysisId && a.user_id === userId));
      localStorage.setItem(LS_ANALYSES_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete analysis locally:', e);
    }
  },
};
