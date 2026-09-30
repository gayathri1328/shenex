import React, { useState, useEffect, Component } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { SignInPage } from './pages/SignInPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { ProcessingPage } from './pages/ProcessingPage';
import { ZoneAnalysisPage } from './pages/ZoneAnalysisPage';
import { MovementPage } from './pages/MovementPage';
import { InsightsPage } from './pages/InsightsPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { authService } from './services/supabaseClient';
import { RotateCcw, AlertTriangle } from 'lucide-react';

/**
 * Resilient Error Boundary to ensure SHENEX NEVER displays a black or blank page
 */
class PageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SHENEX Component Error Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            maxWidth: '520px',
            margin: '0 auto',
            background: 'var(--cream-card)',
            border: '1.5px solid var(--lavender-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#FFF0EB',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <AlertTriangle size={28} color="var(--peach-accent)" />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--plum-deep)', marginBottom: '0.6rem' }}>
              Something went wrong while loading this analysis.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
              The application encountered a display exception, but your real analytics data is safe.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onReset) this.props.onReset();
              }}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <RotateCcw size={16} />
              <span>Back to Overview</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  // 1. Authentication State: Restored from Supabase / localStorage on mount & refresh
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [currentPage, setCurrentPage] = useState('landing');
  
  // 2. Real Computer Vision Analysis State (shared across Overview, Zones, Movement, Insights)
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [pendingVideo, setPendingVideo] = useState(null);

  // Restore authenticated session safely
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage('landing');
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setActiveAnalysis(null);
    setCurrentPage('landing');
  };

  const handleStartProcessing = (fileOrScenario) => {
    // Clear previous analysis state immediately before processing new video
    setActiveAnalysis(null);
    setPendingVideo(fileOrScenario);
    navigateTo('processing');
  };

  const handleProcessingComplete = (analysisPayload) => {
    if (analysisPayload) {
      setActiveAnalysis(analysisPayload);
    }
    navigateTo('dashboard');
  };

  const handleClearAnalysis = () => {
    setActiveAnalysis(null);
    navigateTo('dashboard');
  };

  // MANDATORY REQUIREMENT:
  // When there is NO authenticated Supabase user, SHOW ONLY THE SIGN-IN PAGE.
  // Never show landing page, dashboard, history, or analysis before login.
  if (!currentUser) {
    return (
      <SignInPage onAuthSuccess={handleAuthSuccess} />
    );
  }

  // AUTHENTICATED USER FLOW
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Top Navigation */}
      <Navigation 
        currentPage={currentPage} 
        onNavigate={navigateTo}
        currentUser={currentUser}
        onLogout={handleLogout}
        hasActiveAnalysis={Boolean(activeAnalysis)}
      />

      {/* Main Routed Page Body Protected with ErrorBoundary */}
      <main style={{ flex: 1 }}>
        <PageErrorBoundary onReset={() => navigateTo('dashboard')}>
          {currentPage === 'landing' && (
            <LandingPage 
              onNavigate={navigateTo} 
              onSelectPreset={handleStartProcessing} 
            />
          )}

          {currentPage === 'dashboard' && (
            <DashboardPage 
              activeAnalysis={activeAnalysis}
              onClearAnalysis={handleClearAnalysis}
              onNavigate={navigateTo}
            />
          )}

          {currentPage === 'zones' && (
            <ZoneAnalysisPage 
              currentPreset={activeAnalysis}
              onNavigate={navigateTo}
            />
          )}

          {currentPage === 'movement' && (
            <MovementPage 
              currentPreset={activeAnalysis}
              onNavigate={navigateTo}
            />
          )}

          {currentPage === 'insights' && (
            <InsightsPage 
              currentPreset={activeAnalysis}
              onNavigate={navigateTo}
            />
          )}

          {currentPage === 'upload' && (
            <UploadPage 
              onStartProcessing={handleStartProcessing} 
            />
          )}

          {currentPage === 'processing' && (
            <ProcessingPage 
              targetVideoOrPreset={pendingVideo}
              onProcessingComplete={handleProcessingComplete}
              onCancel={() => navigateTo('upload')}
            />
          )}

          {currentPage === 'features' && (
            <FeaturesPage onNavigate={navigateTo} />
          )}

          {currentPage === 'how-it-works' && (
            <HowItWorksPage onNavigate={navigateTo} />
          )}

          {currentPage === 'privacy' && (
            <PrivacyPage onNavigate={navigateTo} />
          )}

          {currentPage === '404' && (
            <NotFoundPage onNavigate={navigateTo} />
          )}
        </PageErrorBoundary>
      </main>

      {/* Universal Bottom Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default App;
