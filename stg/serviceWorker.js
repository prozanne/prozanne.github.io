var dataCacheName = 'toastData-v1';
var cacheName = 'toast-v1';
var filesToCache = [
    './',
    './index.html',
    './popup.html',
    './js/main.js',
    './css/bootstrap-theme.css',
    './css/bootstrap.css',
    './css/popup-style.css',
    './css/style.css',
    './assets/about_cordova.png',
    './assets/about_github.png',
    './assets/about_multiple.png',
    './assets/icon.png',
    './assets/main_logo.png',
    './assets/platform_android.png',
    './assets/platform_browser.png',
    './assets/platform_orsay.png',
    './assets/platform_tizen.png',
    './assets/platform_webos.png',
    './assets/title.png',
    './assets/title_sub.png',
    './assets/icon-128x128.png',
    './assets/icon-144x144.png',
    './assets/icon-152x152.png',
    './assets/icon-192x192.png',
    './assets/icon-256x256.png',
    './assets/icon-512x512.png'
];

self.addEventListener('install', function(e) {
    // cache를 초기화하고 오프라인 사용을 위한 파일 추가가능
    console.log('[Service Worker] install');
    // e: extendableEvent
    // waitUntil 안의 코드가 실행되기 전까지 serviceWorker가 설치되지 않음.
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(e) {
    // activate 더이상 필요하지 않은 파일을 제거하고 앱이 끝난 후 정리하는 데 사용
    console.log('[Service Worker] activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName && key !== dataCacheName) {
                console.log('[ServiceWorker] Removing old cache', key);
                return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    // fetch 앱으로부터 http 요청이 출발할 때 마다 발생. 요청을 가로채 커스텀 응답으로 응답 가능.
    console.log('[Service Worker] fetch');
    e.respondWith(
        caches.match(e.request).then(function(response) {
          return response || fetch(e.request);
        })
    );
});