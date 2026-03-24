const staticCacheName = 'lottery-app-static-v15'; // อัปเดตเวอร์ชันเป็น v15
const dynamicCacheName = 'lottery-app-dynamic-v15';

// รายการไฟล์ที่ต้องการให้โหลดเก็บไว้ทันที (Pre-cache)
// คัดมาเฉพาะไฟล์หลักที่มีอยู่จริงแน่นอน เพื่อป้องกัน Error ตอนติดตั้ง
const assets = [
  './',
  './index.html',
  './manifest-main.json', // ชื่อไฟล์ต้องตรงกับที่มีจริง
  './1.html',
  './2.html',
  './4.html',
  './5.html',
  './8.html',
  './9.html',
  './11.html',
  './12.html',
  './192.png',
  './512.png',
  
  // ไฟล์จากภายนอก (External Libraries)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600&display=swap'
];

// 1. Install Event: ติดตั้งและเก็บไฟล์หลักลง Cache
self.addEventListener('install', evt => {
  // สั่งให้ Service Worker รอจนกว่าจะเก็บไฟล์เสร็จ
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('Caching shell assets...');
      return cache.addAll(assets);
    })
  );
});

// 2. Activate Event: ลบ Cache เวอร์ชันเก่าทิ้ง
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

// 3. Fetch Event: ดึงข้อมูล (ถ้ามีใน Cache ใช้เลย / ถ้าไม่มีให้โหลดจากเน็ตแล้วเก็บลง Dynamic Cache)
self.addEventListener('fetch', evt => {
  // ข้ามการแคช Chrome Extensions
  if (evt.request.url.startsWith('chrome-extension')) return;

  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      // 1. ถ้ามีใน Cache ให้ส่งกลับไปเลย
      return cacheRes || fetch(evt.request).then(fetchRes => {
        // 2. ถ้าไม่มี ให้โหลดจาก Network
        return caches.open(dynamicCacheName).then(cache => {
          // 3. โหลดเสร็จแล้ว เก็บสำรองลง Dynamic Cache ไว้ใช้ครั้งหน้า
          // (ไฟล์ css/js ที่เราลบออกจาก assets ด้านบน จะถูกเก็บตรงนี้แหละครับ)
          cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => {
      // 4. Fallback: ถ้าไม่มีเน็ตและหาไฟล์ไม่เจอ (เช่น เป็นหน้า HTML) ให้กลับไปหน้า index
      if (evt.request.url.indexOf('.html') > -1) {
        return caches.match('./index.html');
      }
    })
  );
});