const CACHE_NAME = "kopee-mamen-pwa-v1";

const STATIC_PRECACHE = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// 1. Install event: Pre-cache aset statis utama dan halaman offline
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// 2. Activate event: Hapus cache lama saat versi service worker diperbarui
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 3. Fetch event: Penanganan permintaan dengan aturan keamanan ketat
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Hanya tangani permintaan GET
  if (req.method !== "GET") {
    return;
  }

  // ATURAN KEAMANAN WAJIB:
  // - Jangan pernah meng-cache halaman admin (/admin dan sub-rute)
  if (url.pathname.startsWith("/admin")) {
    return;
  }

  // - Jangan pernah meng-cache endpoint API backend (/api/*)
  if (url.pathname.startsWith("/api")) {
    return;
  }

  // - Jangan pernah meng-cache panggilan langsung ke Supabase
  if (url.hostname.includes("supabase.co")) {
    return;
  }

  // A. Aset statis (Ikon, manifest, dan Next.js static chunks): Cache-first
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname === "/manifest.json" ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(req).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // B. Navigasi Halaman HTML: Network-first agar selalu mendapatkan data katalog terkini
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(async () => {
          // Ketika offline, coba ambil halaman dari cache
          const cachedPage = await caches.match(req);
          if (cachedPage) {
            return cachedPage;
          }
          // Jika belum ada di cache, arahkan ke fallback halaman offline resmi
          const offlinePage = await caches.match("/offline");
          if (offlinePage) {
            return offlinePage;
          }
          return new Response(
            "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Offline</title></head><body><h1>Koneksi Terputus</h1><p>Silakan periksa koneksi internet Anda.</p></body></html>",
            { headers: { "Content-Type": "text/html; charset=utf-8" } }
          );
        })
    );
    return;
  }
});

