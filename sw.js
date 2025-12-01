// Service Worker for PWA offline support
// 版本号更新会强制刷新所有缓存
const CACHE_NAME = 'poker-trainer-v6.0.0';
const urlsToCache = [
  'index.html',
  'poker_trainer.html',
  'exploit_trainer.html',
  'advanced_trainer.html',
  'assessment_full.html',
  'straddle_exploit_master.html',
  'straddle_exploit_trainer.html',
  'wsop_tournament_hub.html',
  'wsop_icm_trainer.html',
  'wsop_bubble_master.html',
  'wsop_push_fold.html',
  'manifest.json'
];

// 安装Service Worker - 跳过等待立即激活
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache v6.0.0');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活Service Worker - 立即接管所有页面
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 删除所有旧版本缓存
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 立即接管所有客户端
      return self.clients.claim();
    })
  );
});

// 拦截请求 - 网络优先策略
self.addEventListener('fetch', event => {
  event.respondWith(
    // 先尝试网络请求
    fetch(event.request)
      .then(response => {
        // 网络请求成功，更新缓存
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败，使用缓存
        return caches.match(event.request);
      })
  );
});
