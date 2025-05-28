import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

// Store
import { useThemeStore } from "@store/themeStore";
import { useMusicStore } from "@store/musicStore";

// Components
import Navbar from "@components/common/Navbar";
import Footer from "@components/common/Footer";
import LoadingScreen from "@components/common/LoadingScreen";
import ParticleBackground from "@components/common/ParticleBackground";
import MusicPlayer from "@components/common/MusicPlayer";

// Pages
import HomePage from "@pages/HomePage";
import CountdownPage from "@pages/CountdownPage";
import TimelinePage from "@pages/TimelinePage";
import GamesPage from "@pages/GamesPage";
import PhotoBoothPage from "@pages/PhotoBoothPage";
import LoveLettersPage from "@pages/LoveLettersPage";
import CelebrationPage from "@pages/CelebrationPage";

// Hooks
import { useInitializeApp } from "@hooks/useInitializeApp";

// Styles
import "./styles/App.scss";

const App: React.FC = () => {
  const { theme } = useThemeStore();
  const { isPlaying } = useMusicStore();
  const { isLoading, isInitialized } = useInitializeApp();

  if (isLoading || !isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <div className={`app ${theme}`} data-theme={theme}>
      <Router>
        <div className="app-container">
          {/* Background Effects */}
          <ParticleBackground />

          {/* Navigation */}
          <Navbar />

          {/* Main Content */}
          <main className="main-content">
            {" "}
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/countdown" element={<CountdownPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/photo-booth" element={<PhotoBoothPage />} />
                <Route path="/love-letters" element={<LoveLettersPage />} />
                <Route path="/celebration" element={<CelebrationPage />} />
              </Routes>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <Footer />

          {/* Music Player */}
          <MusicPlayer />

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === "dark" ? "#333" : "#fff",
                color: theme === "dark" ? "#fff" : "#333",
              },
            }}
          />
        </div>
      </Router>
    </div>
  );
};

export default App;
