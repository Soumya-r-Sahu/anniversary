/**
 * Anniversary Website v4.0.0 - Service Worker
 * Provides offline functionality and caching for the anniversary website
 */

const CACHE_NAME = 'anniversary-website-v4-0-0';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/src/pages/html/anniversary.html',
  '/src/pages/html/countdown.html',
  '/src/pages/html/love-story.html',
  '/src/pages/html/photo-gallery.html',
  '/src/pages/html/music-playlist.html',
  '/src/pages/html/memory-book.html',
  '/src/pages/html/love-letters.html',
  '/src/pages/html/special-dates.html',
  '/src/pages/html/future-plans.html',
  '/src/pages/html/challenges.html',
  '/src/pages/html/wish-list.html',
  '/src/pages/html/fireworks.html',
  '/src/pages/html/settings.html',
  '/src/styles/shared.css',
  '/src/styles/variables.css',
  '/src/styles/theme-integration.css',
  '/src/scripts/shared.js',
  '/public/manifest.json'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS.map(url => {
          // Handle relative URLs properly
          return new Request(url, { mode: 'no-cors' });
        }));
      })
      .catch((error) => {
        console.error('❌ Service Worker: Failed to cache resources:', error);
      })
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activate event');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Claim all clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Only handle HTTP/HTTPS requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('📦 Service Worker: Serving from cache:', event.request.url);
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        console.log('🌐 Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Check if response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response for caching
            const responseToCache = response.clone();
            
            // Cache the response for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('❌ Service Worker: Network fetch failed:', error);
            
            // Return offline page or fallback
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // For other resources, return a basic error response
            return new Response('Offline content not available', {
              status: 404,
              statusText: 'Offline content not available'
            });
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync:', event.tag);
  
  if (event.tag === 'anniversary-data-sync') {
    event.waitUntil(
      // Sync any offline data when back online
      syncOfflineData()
    );
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('🔔 Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New anniversary update!',
    icon: '/public/icon-192x192.png',
    badge: '/public/badge-72x72.png',
    tag: 'anniversary-notification',
    renotify: true,
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/public/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/public/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Anniversary Website', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function to sync offline data
async function syncOfflineData() {
  try {
    console.log('📡 Service Worker: Syncing offline data...');
    
    // Get any offline data from IndexedDB or localStorage
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await processOfflineAction(action);
        await removeOfflineAction(action.id);
      } catch (error) {
        console.error('❌ Service Worker: Failed to sync action:', error);
      }
    }
    
    console.log('✅ Service Worker: Offline data sync complete');
  } catch (error) {
    console.error('❌ Service Worker: Sync failed:', error);
  }
}

// Placeholder functions for offline data management
async function getOfflineActions() {
  // Implementation would retrieve offline actions from storage
  return [];
}

async function processOfflineAction(action) {
  // Implementation would process the offline action
  console.log('Processing offline action:', action);
}

async function removeOfflineAction(actionId) {
  // Implementation would remove the processed action
  console.log('Removing offline action:', actionId);
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker: Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker: Unhandled rejection:', event.reason);
});

console.log('🎉 Anniversary Website Service Worker v4.0.0 loaded successfully!');
