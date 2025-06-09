import React, { Suspense, lazy } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ErrorBoundary from './components/ui/ErrorBoundary'
import LoadingSpinner from './components/ui/LoadingSpinner'
import ParticleSystem from './components/effects/ParticleSystem'
import MusicPlayer from './components/media/MusicPlayer'
import ThemeProvider from './contexts/ThemeContext'
import NotificationProvider from './contexts/NotificationContext'

// Lazy load pages for better performance - Updated for v4.0.0 structure
const HomePage = lazy(() => import('./pages/react/HomePage'))
const CountdownPage = lazy(() => import('./pages/react/CountdownPage'))
const AnniversaryPage = lazy(() => import('./pages/react/AnniversaryPage'))
const LoveStoryPage = lazy(() => import('./pages/react/LoveStoryPage'))
const PhotoGalleryPage = lazy(() => import('./pages/react/PhotoGalleryPage'))
const MusicPlaylistPage = lazy(() => import('./pages/react/MusicPlaylistPage'))
const MemoryBookPage = lazy(() => import('./pages/react/MemoryBookPage'))
const SpecialDatesPage = lazy(() => import('./pages/react/SpecialDatesPage'))
const FuturePlansPage = lazy(() => import('./pages/react/FuturePlansPage'))
const LoveLettersPage = lazy(() => import('./pages/react/LoveLettersPage'))
const ChallengesPage = lazy(() => import('./pages/react/ChallengesPage'))
const WishListPage = lazy(() => import('./pages/react/WishListPage'))
const FireworksPage = lazy(() => import('./pages/react/FireworksPage'))
const SettingsPage = lazy(() => import('./pages/react/SettingsPage'))

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-pink-50 via-red-50 to-rose-100 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
              {/* Background Effects */}
              <ParticleSystem />

              {/* Global Music Player */}
              <MusicPlayer />

              {/* Main Content */}
              <main className="relative z-10">
                <AnimatePresence mode="wait">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <HomePage />
                        </motion.div>
                      } />
                      <Route path="/countdown" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <CountdownPage />
                        </motion.div>
                      } />
                      <Route path="/anniversary" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <AnniversaryPage />
                        </motion.div>
                      } />
                      <Route path="/love-story" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <LoveStoryPage />
                        </motion.div>
                      } />
                      <Route path="/photo-gallery" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <PhotoGalleryPage />
                        </motion.div>
                      } />
                      <Route path="/music-playlist" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <MusicPlaylistPage />
                        </motion.div>
                      } />
                      <Route path="/memory-book" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <MemoryBookPage />
                        </motion.div>
                      } />
                      <Route path="/special-dates" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <SpecialDatesPage />
                        </motion.div>
                      } />
                      <Route path="/future-plans" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <FuturePlansPage />
                        </motion.div>
                      } />
                      <Route path="/love-letters" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <LoveLettersPage />
                        </motion.div>
                      } />
                      <Route path="/challenges" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <ChallengesPage />
                        </motion.div>
                      } />
                      <Route path="/wish-list" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <WishListPage />
                        </motion.div>
                      } />
                      <Route path="/fireworks" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <FireworksPage />
                        </motion.div>
                      } />
                      <Route path="/settings" element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <SettingsPage />
                        </motion.div>
                      } />
                    </Routes>
                  </Suspense>
                </AnimatePresence>
              </main>
            </div>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
