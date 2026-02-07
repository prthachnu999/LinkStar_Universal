// ชื่อเวอร์ชัน Cache (ถ้าแก้โค้ดบ่อยๆ ให้เปลี่ยนเลข v25 เป็นเลขอื่น เพื่อให้เครื่องรู้ว่ามีอัปเดต)
const CACHE_NAME = 'file-master-v25-titanium';

// รายชื่อไฟล์ที่ต้องการให้โหลดเก็บไว้ในเครื่อง
const ASSETS = [
    './LinkStart_Universal.html',
    './manifest.json',
    './คิริโตะ.jpg', 
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.0/Sortable.min.js',
    'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600&family=Rajdhani:wght@500;700&display=swap'
];

// 1. ติดตั้ง Service Worker และโหลดไฟล์เก็บเข้า Cache
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installed');
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// 2. ควบคุมการดึงข้อมูล (ถ้ามีใน Cache ให้ใช้เลย ถ้าไม่มีค่อยโหลดจากเน็ต)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request).catch(() => {
                // ถ้าเน็ตหลุดและหาไฟล์ไม่เจอจริงๆ
                console.log('Offline: Cannot load ' + e.request.url);
            });
        })
    );
});

// 3. ลบ Cache เก่าเมื่อมีการอัปเดตเวอร์ชัน
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});