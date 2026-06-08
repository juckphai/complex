const staticCacheName = 'juckphai-static-v110';
const dynamicCacheName = 'juckphai-dynamic-v110';

// รายการไฟล์ทั้งหมดที่ต้องการให้ใช้งาน Offline ได้
const assets = [
  './',
  './index.html',
  './1.html',
  './2.html',
  './4.html',
  './5.html',
  './8.html',
  './9.html',
  './11.html',
  './12.html',
  './style1.css',
  './style2.css',
  './style4.css',
  './style5.css',
  './style8.css',
  './style9.css',
  './style11.css',
  './style12.css',
  './script1.js',
  './script2.js',
  './script3.js',
  './script4.js',
  './script5.js',
  './script8.js',
  './script9.js',
  './script11.js',
  './script12.js',
  './script13.js',
  './logo.png',
  './manifest-main.json'
];

// Install Event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Activate Event (ลบ Cache เก่า)
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch Event (กลยุทธ์: ตรวจใน Cache ก่อน ถ้าไม่มีค่อยไปโหลดจากเน็ต)
self.addEventListener('fetch', evt => {
  if (evt.request.url.startsWith('chrome-extension')) return;

  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => {
      if (evt.request.url.indexOf('.html') > -1) {
        return caches.match('./index.html');
      }
    })
  );
});