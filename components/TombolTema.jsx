"use client";

import { useEffect, useState } from "react";

export default function TombolTema() {
  const [tema, setTema] = useState("light");
  const [sudahMuat, setSudahMuat] = useState(false);

  useEffect(() => {
    // Cek class dark yang sudah diset oleh inline script di <head>
    const isDark = document.documentElement.classList.contains("dark");
    setTema(isDark ? "dark" : "light");
    setSudahMuat(true);

    // Pantau perubahan preferensi sistem jika pengguna belum memilih secara manual
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (e) => {
      try {
        if (!localStorage.getItem("tema")) {
          const dark = e.matches;
          setTema(dark ? "dark" : "light");
          if (dark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      } catch (_) {}
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    // Sinkronisasi antar-tab browser via storage event
    const handleStorage = (e) => {
      if (e.key === "tema") {
        const val = e.newValue;
        if (val === "dark") {
          setTema("dark");
          document.documentElement.classList.add("dark");
        } else if (val === "light") {
          setTema("light");
          document.documentElement.classList.remove("dark");
        } else {
          const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          setTema(dark ? "dark" : "light");
          if (dark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  function toggleTema() {
    const target = tema === "dark" ? "light" : "dark";
    setTema(target);
    if (target === "dark") {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("tema", "dark");
      } catch (_) {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("tema", "light");
      } catch (_) {}
    }
  }

  // Render placeholder netral sebelum mount untuk mencegah hydration mismatch
  if (!sudahMuat) {
    return (
      <button
        type="button"
        disabled
        aria-label="Pengalih tema"
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-garis bg-latar px-2.5 text-xs font-semibold text-teks-lembut opacity-80 sm:px-3"
      >
        <span className="h-4 w-4" />
        <span className="hidden sm:inline">Tema</span>
      </button>
    );
  }

  const isDark = tema === "dark";

  return (
    <button
      type="button"
      onClick={toggleTema}
      aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      title={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-garis bg-latar px-2.5 text-xs font-semibold text-teks hover:border-utama hover:text-utama transition-colors sm:px-3"
    >
      {isDark ? (
        <>
          {/* Ikon Matahari saat mode gelap aktif (klik untuk pindah ke terang) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-amber-400"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
          <span className="hidden sm:inline">Mode terang</span>
        </>
      ) : (
        <>
          {/* Ikon Bulan saat mode terang aktif (klik untuk pindah ke gelap) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-teks-lembut"
            aria-hidden="true"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
          <span className="hidden sm:inline">Mode gelap</span>
        </>
      )}
    </button>
  );
}

