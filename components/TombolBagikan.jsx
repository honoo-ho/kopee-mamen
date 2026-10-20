"use client";

import { useState } from "react";

export default function TombolBagikan({ produk }) {
  const [statusBagikan, setStatusBagikan] = useState(""); // "" | "dibagikan" | "tersalin" | "error"
  const [statusSalin, setStatusSalin] = useState(""); // "" | "tersalin" | "error"
  const [pesanError, setPesanError] = useState("");

  // Salin URL aktual ke clipboard dengan fallback untuk lingkungan tanpa navigator.clipboard
  async function salinUrlKeClipboard() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        return true;
      } catch (_) {
        // Lanjutkan ke fallback document.execCommand
      }
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const hasil = document.execCommand("copy");
      document.body.removeChild(textarea);
      return hasil;
    } catch (e) {
      return false;
    }
  }

  // Aksi tombol "Bagikan": panggil Web Share API jika didukung, fallback ke clipboard
  async function handleBagikan() {
    setPesanError("");
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: produk?.nama ? `${produk.nama} - Toko Kopee Mamen` : "Toko Kopee Mamen",
      text: `Lihat ${produk?.nama || "produk"} di Toko Kopee Mamen!`,
      url: url,
    };

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        setStatusBagikan("dibagikan");
        setTimeout(() => setStatusBagikan(""), 2500);
        return;
      } catch (err) {
        // Jangan tampilkan error jika pengguna membatalkan dialog share
        if (err.name === "AbortError") {
          return;
        }
      }
    }

    // Fallback otomatis ke salin clipboard jika Web Share tidak didukung atau gagal
    const berhasil = await salinUrlKeClipboard();
    if (berhasil) {
      setStatusBagikan("tersalin");
      setTimeout(() => setStatusBagikan(""), 2500);
    } else {
      setStatusBagikan("error");
      setPesanError("Gagal menyalin link.");
      setTimeout(() => {
        setStatusBagikan("");
        setPesanError("");
      }, 3000);
    }
  }

  // Aksi tombol "Salin link": langsung menyalin ke clipboard
  async function handleSalinLink() {
    setPesanError("");
    const berhasil = await salinUrlKeClipboard();
    if (berhasil) {
      setStatusSalin("tersalin");
      setTimeout(() => setStatusSalin(""), 2500);
    } else {
      setStatusSalin("error");
      setPesanError("Gagal menyalin link.");
      setTimeout(() => {
        setStatusSalin("");
        setPesanError("");
      }, 3000);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* Tombol Bagikan Produk (Web Share API dengan fallback Clipboard) */}
        <button
          type="button"
          onClick={handleBagikan}
          aria-label="Bagikan produk"
          title="Bagikan tautan produk"
          className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
            statusBagikan === "dibagikan" || statusBagikan === "tersalin"
              ? "border-utama bg-permukaan text-utama"
              : statusBagikan === "error"
              ? "border-bahaya bg-permukaan text-bahaya"
              : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
          }`}
        >
          {statusBagikan === "dibagikan" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-utama"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Berhasil dibagikan!</span>
            </>
          ) : statusBagikan === "tersalin" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-utama"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Link tersalin!</span>
            </>
          ) : (
            <>
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
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>Bagikan</span>
            </>
          )}
        </button>

        {/* Tombol Salin Link */}
        <button
          type="button"
          onClick={handleSalinLink}
          aria-label="Salin link produk ke clipboard"
          title="Salin tautan produk ke clipboard"
          className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
            statusSalin === "tersalin"
              ? "border-utama bg-permukaan text-utama"
              : statusSalin === "error"
              ? "border-bahaya bg-permukaan text-bahaya"
              : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
          }`}
        >
          {statusSalin === "tersalin" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-utama"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Link tersalin!</span>
            </>
          ) : (
            <>
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
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>Salin link</span>
            </>
          )}
        </button>
      </div>

      {/* Region pengumuman aksesibel untuk pembaca layar */}
      <div role="status" aria-live="polite" className="sr-only">
        {statusSalin === "tersalin" || statusBagikan === "tersalin"
          ? "Link produk berhasil disalin ke clipboard."
          : statusBagikan === "dibagikan"
          ? "Produk berhasil dibagikan."
          : pesanError}
      </div>

      {pesanError && <p className="text-xs text-bahaya">{pesanError}</p>}
    </div>
  );
}

