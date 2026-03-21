// Naya Service Worker — Web Push Notifications
// Version: 1.0.0

const CACHE_NAME = 'naya-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

// Handle push notifications
self.addEventListener('push', e => {
  let data = { title: 'Naya', body: 'You have a new notification', icon: '/naya-logo.png', url: '/' }

  if (e.data) {
    try { data = { ...data, ...JSON.parse(e.data.text()) } }
    catch {}
  }

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    data.icon || '/naya-logo.png',
      badge:   '/naya-logo.png',
      tag:     data.tag || 'naya',
      data:    { url: data.url || '/' },
      actions: [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
      vibrate:  [200, 100, 200],
      requireInteraction: false,
    })
  )
})

// Handle notification click
self.addEventListener('notificationclick', e => {
  e.notification.close()
  if (e.action === 'dismiss') return

  const url = e.notification.data?.url || '/'
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      // Focus existing window if open
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      // Open new window
      if (self.clients.openWindow) return self.clients.openWindow(url)
    })
  )
})

// Background sync (for offline enquiries)
self.addEventListener('sync', e => {
  if (e.tag === 'sync-enquiries') {
    console.log('[SW] Background sync triggered')
  }
})
