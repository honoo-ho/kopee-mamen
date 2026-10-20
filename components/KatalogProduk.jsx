"use client";

import { useState, useMemo } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function KatalogProduk({ daftarProduk = [] }) {
  const [cari, setCari] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua Kategori");

  // Dapatkan daftar kategori unik dari data produk Supabase
  const daftarKategori = useMemo(() => {
    const unik = Array.from(
      new Set(daftarProduk.map((p) => p.kategori).filter(Boolean))
    );
    return ["Semua Kategori", ...unik];
  }, [daftarProduk]);

  // Saring produk berdasarkan nama (case-insensitive) dan kategori aktif
  const produkTerfilter = useMemo(() => {
    const kataKunci = cari.trim().toLowerCase();

    return daftarProduk.filter((produk) => {
      const cocokKategori =
        kategoriAktif === "Semua Kategori" || !kategoriAktif
          ? true
          : produk.kategori?.toLowerCase() === kategoriAktif.toLowerCase();

      const cocokNama =
        !kataKunci || produk.nama?.toLowerCase().includes(kataKunci);

      return cocokKategori && cocokNama;
    });
  }, [daftarProduk, cari, kategoriAktif]);

  return (
    <div className="flex flex-col gap-6">
      {/* Kontrol Pencarian dan Filter Kategori */}
      <div className="flex flex-col gap-4">
        {/* Kolom Pencarian */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama produk..."
            className="w-full rounded-xl border border-garis bg-latar px-4 py-2.5 pr-10 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            aria-label="Cari nama produk"
          />
          {cari && (
            <button
              type="button"
              onClick={() => setCari("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-teks-lembut hover:text-teks text-sm font-semibold"
              title="Hapus pencarian"
              aria-label="Hapus kata kunci pencarian"
            >
              ✕
            </button>
          )}
        </div>

        {/* Pilihan Filter Kategori */}
        <div className="flex flex-wrap items-center gap-2">
          {daftarKategori.map((kategori) => {
            const aktif = kategoriAktif === kategori;
            return (
              <button
                key={kategori}
                type="button"
                onClick={() => setKategoriAktif(kategori)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  aktif
                    ? "bg-utama text-white"
                    : "border border-garis bg-permukaan text-teks hover:border-utama hover:text-utama"
                }`}
              >
                {kategori}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tampilan Hasil Produk atau Pesan Kosong */}
      {produkTerfilter.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-garis bg-permukaan/50 p-8 text-center sm:p-12">
          <p className="text-base font-semibold text-teks">Produk tidak ditemukan</p>
          <p className="mt-1 text-sm text-teks-lembut max-w-md">
            Tidak ada produk yang cocok dengan pencarian &ldquo;{cari}&rdquo;
            {kategoriAktif !== "Semua Kategori" ? ` di kategori ${kategoriAktif}` : ""}.
          </p>
          {(cari || kategoriAktif !== "Semua Kategori") && (
            <button
              type="button"
              onClick={() => {
                setCari("");
                setKategoriAktif("Semua Kategori");
              }}
              className="mt-4 rounded-lg bg-utama px-4 py-2 text-sm font-semibold text-white hover:bg-utama-gelap"
            >
              Kembali ke semua produk
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkTerfilter.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}

