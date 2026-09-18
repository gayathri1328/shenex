import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { UploadPage } from './pages/UploadPage';
import { ProcessingPage } from './pages/ProcessingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ZoneAnalysisPage } from './pages/ZoneAnalysisPage';
import { MovementPage } from './pages/MovementPage';
import { InsightsPage } from './pages/InsightsPage';
import { HistoryPage } from './pages/HistoryPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthModal } from './pages/AuthModal';
import { authService, databaseService } from './services/supabaseClient';

export function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  // Strict Fresh State: activeAnalysis is null until a video is processed!
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [pendingVideo, setPendingVideo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Load existing session on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartProcessing = (fileOrScenario) => {
    // Clear any previous analysis state immediately before processing new video
    setActiveAnalysis(null);
    setPendingVideo(fileOrScenario);
    navigateTo('processing');
  };

  const handleProcessingComplete = async (analysisPayload) => {
    if (analysisPayload) {
      setActiveAnalysis(analysisPayload);
      // Persist to user history if logged in
      if (currentUser) {
        try {
          await databaseService.saveAnalysis(currentUser.id, analysisPayload);
        } catch (e) {
          console.error('Failed to persist analysis:', e);
        }
      }
    }
    navigateTo('dashboard');
  };

  const handleClearAnalysis = () => {
    setActiveAnalysis(null);
    navigateTo('dashboard');
  };

  const handleLoadSavedAnalysis = (savedAnalysis) => {
    setActiveAnalysis(savedAnalysis);
    navigateTo('dashboard');
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    navigateTo('landing');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Universal Top Navigation */}
      <Navigation 
        currentPage={currentPage} 
        onNavigate={navigateTo}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        hasActiveAnalysis={Boolean(activeAnalysis)}
      />

      {/* Main Routed Page Body */}
      <main style={{ flex: 1 }}>
        {currentPage === 'landing' && (
          <LandingPage 
            onNavigate={navigateTo} 
            onSelectPreset={handleStartProcessing} 
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

        {currentPage === 'history' && (
          <HistoryPage 
            currentUser={currentUser}
            onLoadAnalysis={handleLoadSavedAnalysis}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'auth' && (
          <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
            <button onClick={() => setAuthModalOpen(true)} className="btn btn-primary btn-lg">
              Open Sign In / Sign Up Modal
            </button>
          </div>
        )}

        {currentPage === '404' && (
          <NotFoundPage onNavigate={navigateTo} />
        )}
      </main>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setAuthModalOpen(false);
        }}
      />

      {/* Universal Bottom Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default App;
