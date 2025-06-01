// Service Worker for Anniversary Website PWA
// Version 1.0.0

const CACHE_NAME = 'anniversary-love-v1.0.0';
const STATIC_CACHE = 'anniversary-static-v1.0.0';
const DYNAMIC_CACHE = 'anniversary-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/anniversary.html',
  '/love-story.html',
  '/photo-gallery.html',
  '/memories-timeline.html',
  '/countdown.html',
  '/fireworks.html',
  '/settings.html',
  '/style.css',
  '/src/styles/enhanced-romantic.css',
  '/src/styles/dark-theme.css',
  '/src/styles/ui-controls.css',
  '/src/styles/variables.css',
  '/src/styles/performance-optimized.css',
  '/src/styles/music-popup-alignment.css',
  '/src/styles/compact-music-popup.css',
  '/src/styles/single-row-layout.css',
  '/manifest.json',
  // Add core JavaScript files
  '/src/core/MusicSystemInitializer.js',
  '/src/utils/ui-polish-initializer.js',
  '/src/utils/music-player-cleanup.js',
  '/src/utils/long-page-music-positioning.js',
  '/src/utils/popup-animation-controller.js',
  '/src/utils/single-row-layout-helper.js',
  '/src/integrator.js',
  // Add essential images
  '/assets/images/hero-bg.jpg',
  // Add fonts and external resources
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://unpkg.com/particles.js@2.0.0/particles.min.js',
  'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// Files to cache dynamically
const DYNAMIC_FILES = [
  '/assets/images/',
  '/assets/music/',
  '/src/',
  '/_data/'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('SW: Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('SW: Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('SW: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('SW: Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('SW: Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('SW: Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached files or fetch from network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (except CDN resources)
  if (url.origin !== location.origin && !isCDNResource(url)) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('SW: Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request)
          .then(networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response
            const responseToCache = networkResponse.clone();
            
            // Determine which cache to use
            const cacheToUse = shouldCacheDynamically(request.url) ? DYNAMIC_CACHE : STATIC_CACHE;
            
            // Add to cache
            caches.open(cacheToUse)
              .then(cache => {
                console.log('SW: Caching new resource:', request.url);
                cache.put(request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch(error => {
            console.error('SW: Fetch failed:', error);
            
            // Return offline fallback for HTML pages
            if (request.destination === 'document') {
              return caches.match('/offline.html') || createOfflinePage();
            }
            
            // Return placeholder for images
            if (request.destination === 'image') {
              return createPlaceholderImage();
            }
            
            throw error;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'love-note-sync') {
    event.waitUntil(syncLoveNotes());
  }
  
  if (event.tag === 'photo-upload-sync') {
    event.waitUntil(syncPhotoUploads());
  }
});

// Push notifications for anniversary reminders
self.addEventListener('push', event => {
  console.log('SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New anniversary reminder! 💕',
    icon: '/assets/images/icons/icon-192x192.png',
    badge: '/assets/images/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View Anniversary',
        icon: '/assets/images/icons/action-view.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/images/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Anniversary Reminder 💕', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('SW: Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/anniversary.html')
    );
  }
});

// Helper functions
function isCDNResource(url) {
  const cdnDomains = [
    'cdn.jsdelivr.net',
    'unpkg.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ];
  
  return cdnDomains.some(domain => url.hostname.includes(domain));
}

function shouldCacheDynamically(url) {
  return DYNAMIC_FILES.some(pattern => url.includes(pattern));
}

function createOfflinePage() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="en" data-theme="dark">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - Our Love Story</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
                color: white;
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
            .offline-container {
                max-width: 400px;
                padding: 2rem;
            }
            .heart {
                font-size: 4rem;
                margin-bottom: 1rem;
                animation: heartbeat 1.5s ease-in-out infinite;
            }
            @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            h1 { color: #ec4899; margin-bottom: 1rem; }
            p { margin-bottom: 1.5rem; opacity: 0.8; }
            button {
                background: #ec4899;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                cursor: pointer;
                font-size: 1rem;
                transition: background 0.3s;
            }
            button:hover { background: #be185d; }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="heart">💕</div>
            <h1>You're Offline</h1>
            <p>Our love story is always in your heart, even when you're offline. Check your connection and try again.</p>
            <button onclick="window.location.reload()">Try Again</button>
        </div>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html' }
  });
}

function createPlaceholderImage() {
  // Create a simple SVG placeholder
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ec4899" opacity="0.1"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#ec4899" font-size="24">💕</text>
      <text x="50%" y="65%" text-anchor="middle" dy=".3em" fill="#ec4899" font-size="12">Image offline</text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' }
  });
}

async function syncLoveNotes() {
  try {
    // Get pending love notes from IndexedDB
    const pendingNotes = await getPendingLoveNotes();
    
    for (const note of pendingNotes) {
      // Attempt to sync with server/GitHub API
      await syncNoteToServer(note);
      await removePendingNote(note.id);
    }
    
    console.log('SW: Love notes synced successfully');
  } catch (error) {
    console.error('SW: Error syncing love notes:', error);
  }
}

async function syncPhotoUploads() {
  try {
    // Get pending photo uploads from IndexedDB
    const pendingUploads = await getPendingPhotoUploads();
    
    for (const upload of pendingUploads) {
      // Attempt to upload photos
      await uploadPhotoToServer(upload);
      await removePendingUpload(upload.id);
    }
    
    console.log('SW: Photo uploads synced successfully');
  } catch (error) {
    console.error('SW: Error syncing photo uploads:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingLoveNotes() { return []; }
async function syncNoteToServer(note) { return true; }
async function removePendingNote(id) { return true; }
async function getPendingPhotoUploads() { return []; }
async function uploadPhotoToServer(upload) { return true; }
async function removePendingUpload(id) { return true; }

console.log('SW: Service worker script loaded');
