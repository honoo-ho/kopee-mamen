"use client";

import { useEffect, useState } from "react";

export default function TombolInstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [bisaInstall, setBisaInstall] = useState(false);
  const [sudahTerinstall, setSudahTerinstall] = useState(false);
  const [tampilkanPanduan, setTampilkanPanduan] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Periksa apakah aplikasi sudah berjalan dalam mode standalone (sudah diinstall)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setSudahTerinstall(true);
      return;
    }

    // 2. Deteksi perangkat iOS (Safari tidak mendukung beforeinstallprompt)
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) && !window.MSStream;
    setIsIOS(isIosDevice);

    // 3. Tangani event beforeinstallprompt pada Chromium / Android / Edge
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setBisaInstall(true);
    };

    const handleAppInstalled = () => {
      setSudahTerinstall(true);
      setBisaInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstallClick() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setBisaInstall(false);
      }
      setDeferredPrompt(null);
    } else {
      // Jika browser tidak menyediakan prompt otomatis (misal Safari iOS), tampilkan panduan
      setTampilkanPanduan(true);
    }
  }

  // Jika sudah terpasang di perangkat, sembunyikan tombol
  if (sudahTerinstall) {
    return null;
  }

  // Jika belum ada event instalasi dan bukan iOS, jangan tampilkan tombol yang tidak berfungsi
  if (!bisaInstall && !isIOS) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        aria-label="Pasang aplikasi Toko Kopee Mamen ke layar utama"
        title="Pasang aplikasi di layar utama"
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-garis bg-permukaan px-2.5 text-xs font-semibold text-utama hover:border-utama hover:bg-latar transition-colors sm:px-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span className="hidden sm:inline">Pasang Aplikasi</span>
      </button>

      {/* Modal panduan instalasi untuk browser yang memerlukan tindakan manual (misal iOS Safari) */}
      {tampilkanPanduan && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl border border-garis bg-latar p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-teks">Pasang Aplikasi</h3>
            <div className="mt-3 text-sm text-teks-lembut leading-relaxed">
              {isIOS ? (
                <>
                  <p>Untuk memasang katalog di iPhone atau iPad:</p>
                  <ol className="mt-2 list-decimal list-inside space-y-1">
                    <li>
                      Tekan tombol <strong>Bagikan (Share)</strong> pada Safari.
                    </li>
                    <li>
                      Pilih <strong>&quot;Tambah ke Layar Utama&quot; (Add to Home Screen)</strong>.
                    </li>
                  </ol>
                </>
              ) : (
                <>
                  <p>Untuk memasang aplikasi ini:</p>
                  <p className="mt-1">
                    Buka menu browser Anda (titik tiga di kanan atas) dan pilih{" "}
                    <strong>&quot;Pasang Aplikasi&quot;</strong> atau{" "}
                    <strong>&quot;Instal Toko Kopee Mamen&quot;</strong>.
                  </p>
                </>
              )}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setTampilkanPanduan(false)}
                className="rounded-lg bg-utama px-4 py-2 text-xs font-semibold text-white hover:bg-utama-gelap"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

