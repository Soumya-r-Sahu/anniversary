/**
 * Anniversary Website Service Worker
 * Provides offline functionality, caching strategies, and performance optimization
 */

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Service Worker version and cache names
const CACHE_VERSION = '2.0.0';
const STATIC_CACHE = `anniversary-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `anniversary-dynamic-v${CACHE_VERSION}`;
const IMAGES_CACHE = `anniversary-images-v${CACHE_VERSION}`;
const MEDIA_CACHE = `anniversary-media-v${CACHE_VERSION}`;

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old caches
cleanupOutdatedCaches();

// Cache strategies for different content types

// 1. Static Assets (CSS, JS, Fonts) - Cache First
registerRoute(
  ({ request }) => 
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font',
  new CacheFirst({
    cacheName: STATIC_CACHE,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      }),
    ],
  })
);

// 2. HTML Pages - Network First with fallback
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: DYNAMIC_CACHE,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
      }),
    ],
  })
);

// 3. Images - Cache First with WebP optimization
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: IMAGES_CACHE,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
  })
);

// 4. Media Files (Audio, Video) - Cache First
registerRoute(
  ({ request }) => 
    request.destination === 'audio' ||
    request.destination === 'video',
  new CacheFirst({
    cacheName: MEDIA_CACHE,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
      }),
    ],
  })
);

// 5. API Calls - Stale While Revalidate
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24, // 24 hours
      }),
    ],
  })
);

// 6. External Resources (Google Fonts, CDNs) - Cache First
registerRoute(
  ({ url }) => 
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com' ||
    url.origin === 'https://cdn.jsdelivr.net',
  new CacheFirst({
    cacheName: 'external-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      }),
    ],
  })
);

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Handle any pending offline actions
    const pendingActions = await getStoredActions();
    
    for (const action of pendingActions) {
      try {
        await processAction(action);
        await removeStoredAction(action.id);
      } catch (error) {
        console.error('Failed to process action:', action, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Offline fallback
self.addEventListener('fetch', (event) => {
  // Skip for non-navigation requests
  if (!event.request.mode === 'navigate') return;
  
  event.respondWith(
    fetch(event.request).catch(() => {
      // Return cached version or offline page
      return caches.match('/offline.html') || 
             caches.match('/index.html') ||
             new Response('Offline - Please check your connection', {
               status: 503,
               statusText: 'Service Unavailable'
             });
    })
  );
});

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/pwa-192x192.png',
      badge: '/icons/badge-72x72.png',
      image: data.image || '/images/notification-banner.jpg',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/',
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'view',
          title: 'View 💕',
          icon: '/icons/view-24x24.png'
        },
        {
          action: 'dismiss',
          title: 'Later',
          icon: '/icons/dismiss-24x24.png'
        }
      ],
      tag: data.tag || 'anniversary-notification',
      renotify: true,
      requireInteraction: false
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Push notification error:', error);
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const url = event.notification.data?.url || '/';
  
  if (action === 'dismiss') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if the app is already open
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if app is not open
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_VERSION });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'CACHE_URLS':
      cacheUrls(payload.urls).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

// Cache management functions
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  const anniversaryCaches = cacheNames.filter(name => 
    name.startsWith('anniversary-')
  );
  
  return Promise.all(
    anniversaryCaches.map(name => caches.delete(name))
  );
}

async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  return cache.addAll(urls);
}

// Storage functions for offline actions
async function getStoredActions() {
  try {
    const cache = await caches.open('offline-actions');
    const response = await cache.match('/offline-actions.json');
    
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error getting stored actions:', error);
  }
  
  return [];
}

async function removeStoredAction(actionId) {
  try {
    const actions = await getStoredActions();
    const filteredActions = actions.filter(action => action.id !== actionId);
    
    const cache = await caches.open('offline-actions');
    await cache.put('/offline-actions.json', 
      new Response(JSON.stringify(filteredActions))
    );
  } catch (error) {
    console.error('Error removing stored action:', error);
  }
}

async function processAction(action) {
  switch (action.type) {
    case 'SHARE_MEMORY':
      return fetch('/api/share-memory', {
        method: 'POST',
        body: JSON.stringify(action.data),
        headers: { 'Content-Type': 'application/json' }
      });
      
    case 'SAVE_STORY_EDIT':
      return fetch('/api/save-story', {
        method: 'PUT',
        body: JSON.stringify(action.data),
        headers: { 'Content-Type': 'application/json' }
      });
      
    default:
      console.log('Unknown action type:', action.type);
  }
}

// Performance monitoring
let performanceEntries = [];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  // Track installation performance
  const installStart = performance.now();
  
  event.waitUntil(
    Promise.resolve().then(() => {
      const installTime = performance.now() - installStart;
      console.log(`Service Worker installed in ${installTime.toFixed(2)}ms`);
      
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      cleanupOutdatedCaches(),
      
      // Claim all clients
      self.clients.claim(),
      
      // Send activation message to clients
      notifyClients('SW_ACTIVATED')
    ]).then(() => {
      console.log('Service Worker activated successfully');
    })
  );
});

async function notifyClients(message) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type: message, timestamp: Date.now() });
  });
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});

console.log('Anniversary Website Service Worker loaded 💕');
