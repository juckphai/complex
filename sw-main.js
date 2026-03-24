// อัปเดตเวอร์ชัน Cache ทุกครั้งที่มีการแก้โค้ด เพื่อให้ระบบเคลียร์ของเก่า
const STATIC_CACHE = 'lottery-app-static-v118'; 
const DYNAMIC_CACHE = 'lottery-app-dynamic-v118';

// 1. รายการไฟล์หลักที่ต้องโหลดเก็บไว้ทันที (Pre-cache)
// นำไฟล์ HTML ทั้งหมด (รวม 3.html และ 13.html) และไลบรารีที่จำเป็นมารวมกัน
const coreAssets = [
  './',
  './index.html',
  './1.html',
  './2.html',
  './3.html',
  './4.html',
  './5.html',
  './7.html',
  './8.html',
  './9.html',
  './11.html',
  './12.html',
  './13.html',
  './logo.png',
  './192.png',
  './512.png',
  './manifest-main.json', 
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600&display=swap'
];

// 2. Install Event: ติดตั้งและเก็บไฟล์หลักลง Static Cache
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('[Service Worker] Caching core assets...');
      return cache.addAll(coreAssets);
    })
  );
  // สั่งให้ Service Worker ตัวใหม่ทำงานทันทีโดยไม่ต้องรอให้ผู้ใช้ปิดแท็บ
  self.skipWaiting(); 
});

// 3. Activate Event: จัดการลบ Cache เวอร์ชันเก่าทิ้ง
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
        .map(key => {
          console.log('[Service Worker] Deleting old cache:', key);
          return caches.delete(key);
        })
      );
    })
  );
  // ให้ Service Worker เข้าควบคุมหน้าเว็บทันที
  self.clients.claim();
});

// 4. Fetch Event: จัดการการโหลดข้อมูล (Cache-First Strategy)
self.addEventListener('fetch', evt => {
  // ข้ามการแคช request ที่มาจาก Chrome Extensions เพื่อป้องกัน Error
  if (evt.request.url.startsWith('chrome-extension')) return;
  
  // ข้ามการแคช API หรือไฟล์ที่ไม่ใช่ GET request
  if (evt.request.method !== 'GET') return;

  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      // 4.1 ถ้าเจอไฟล์ใน Cache ให้ดึงมาใช้เลย (เร็วที่สุด)
      if (cacheRes) {
        return cacheRes;
      }
      
      // 4.2 ถ้าไม่เจอใน Cache ให้วิ่งไปโหลดจาก Network
      return fetch(evt.request).then(fetchRes => {
        return caches.open(DYNAMIC_CACHE).then(cache => {
          // เก็บไฟล์ใหม่ๆ (เช่น CSS, JS ย่อย) ลง Dynamic Cache ไว้ใช้ครั้งหน้า
          cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => {
      // 4.3 Fallback: กรณีผู้ใช้ออฟไลน์ (ไม่มีเน็ต) และไม่เคยโหลดไฟล์นั้นมาก่อน
      
      // ถ้าสิ่งที่พยายามโหลดคือหน้าเว็บ (HTML) ให้กลับไปหน้าแรก
      if (evt.request.destination === 'document' || evt.request.url.includes('.html')) {
        return caches.match('./index.html');
      }
      
      // ถ้าสิ่งที่พยายามโหลดคือรูปภาพ ให้แสดงโลโก้แทน (แก้ปัญหาภาพแตกตอนออฟไลน์)
      if (evt.request.destination === 'image') {
        return caches.match('./logo.png');
      }
    })
  );
});