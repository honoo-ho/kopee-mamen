"use client";

import { useEffect } from "react";

export default function DaftarPWA() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.location.protocol.startsWith("http")
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Service Worker berhasil didaftarkan
          registration.addEventListener("updatefound", () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener("statechange", () => {
                if (
                  installingWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // Pembaruan baru siap digunakan
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("Gagal mendaftarkan Service Worker PWA:", error);
        });
    }
  }, []);

  return null;
}

