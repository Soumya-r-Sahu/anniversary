import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Anniversary Website v3.0.0 - Development Mode')
  console.log('💕 Made with love for Jerry')
}

// Error handling for the root element
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found. Please check your HTML template.')
}

// Create React root with enhanced error handling
const root = ReactDOM.createRoot(rootElement)

// Render the app with error boundary
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Register service worker for PWA functionality
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

// Performance observer for monitoring
if (process.env.NODE_ENV === 'development' && 'PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime)
      }
      if (entry.entryType === 'first-input') {
        const firstInputEntry = entry as PerformanceEventTiming
        console.log('FID:', firstInputEntry.processingStart - firstInputEntry.startTime)
      }
    }
  })

  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] })
}
