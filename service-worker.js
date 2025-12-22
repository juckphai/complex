const staticCacheName = 'lottery-app-static-v1'; // เปลี่ยนเวอร์ชันเมื่อมีการแก้ไขโค้ด
const dynamicCacheName = 'lottery-app-dynamic-v1';

// รายการไฟล์ที่ต้องการให้โหลดเก็บไว้ทันที (Pre-cache)
const assets = [
  './',
  './index.html',
  './1.html',
  './2.html',
  './style1.css', 
  './style2.css', 
  './script1.js',
  './script2.js',
  './logo.png',
  './192.png',
   './manifest.json',
  './manifest-all-lao.json',
  // ไฟล์จากภายนอก (CDN) ที่จำเป็นต้องใช้
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600&display=swap'
];

// 1. Install Event: เก็บไฟล์พื้นฐานลง Cache ทันทีที่ติดตั้ง
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('Caching shell assets...');
      return cache.addAll(assets);
    })
  );
});

// 2. Activate Event: ลบ Cache เวอร์ชั่นเก่าทิ้งเมื่อมีการอัปเดต
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

// 3. Fetch Event: จัดการการดึงข้อมูล
self.addEventListener('fetch', evt => {
  // ตรวจสอบว่าเป็น request ที่เกี่ยวข้องกับ chrome-extension หรือไม่ (ถ้ามีให้ข้าม)
  if (evt.request.url.startsWith('chrome-extension')) return;

  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      // 3.1 ถ้ามีใน Cache ให้ส่งกลับทันที (เร็วที่สุด + Offline ได้)
      return cacheRes || fetch(evt.request).then(fetchRes => {
        // 3.2 ถ้าไม่มีใน Cache ให้โหลดจากเน็ต
        return caches.open(dynamicCacheName).then(cache => {
          // เก็บไฟล์ที่โหลดมาใหม่ลง Dynamic Cache ไว้ใช้ครั้งหน้า
          // ต้องใช้ clone() เพราะ response stream อ่านได้ครั้งเดียว
          cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => {
      // 3.3 ถ้า Offline และหาไฟล์ไม่เจอ (กรณีหน้าเว็บที่ยังไม่เคยเข้า)
      // สามารถเลือกให้กลับไปหน้า index.html ได้
      if (evt.request.url.indexOf('.html') > -1) {
        return caches.match('./index.html');
      }
      // หรือถ้าเป็นรูปภาพ อาจจะส่งรูป placeholder กลับไปแทน (ถ้ามี)
    })
  );
});