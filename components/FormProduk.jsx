"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
// Dilengkapi pembuatan deskripsi otomatis dengan AI (US-14).
export default function FormProduk({ produk = {}, labelTombol }) {
  const [nama, setNama] = useState(produk.nama || "");
  const [kategori, setKategori] = useState(produk.kategori || "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [sedangMembuatAI, setSedangMembuatAI] = useState(false);
  const [pesanErrorAI, setPesanErrorAI] = useState("");
  const [pesanSuksesAI, setPesanSuksesAI] = useState("");

  async function handleBuatDeskripsiAI() {
    setPesanErrorAI("");
    setPesanSuksesAI("");

    const namaTrim = nama.trim();
    if (!namaTrim) {
      setPesanErrorAI("Silakan isi nama produk terlebih dahulu.");
      const inputNama = document.querySelector('input[name="nama"]');
      if (inputNama) inputNama.focus();
      return;
    }

    setSedangMembuatAI(true);
    try {
      const res = await buatDeskripsiAI({
        nama: namaTrim,
        kategori: kategori.trim(),
      });

      if (res.error) {
        setPesanErrorAI(res.error);
      } else if (res.deskripsi) {
        setDeskripsi(res.deskripsi);
        setPesanSuksesAI(
          "Deskripsi berhasil dibuat dengan AI! Kamu bisa mengeditnya sebelum menyimpan."
        );
      }
    } catch (err) {
      setPesanErrorAI(err.message || "Gagal menghubungi server untuk membuat deskripsi.");
    } finally {
      setSedangMembuatAI(false);
    }
  }

  return (
    <form className="flex max-w-xl flex-col gap-4">
      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />

      {/* Bagian Deskripsi dengan integrasi AI (US-14) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="deskripsi" className="text-sm font-semibold">
            Deskripsi
          </label>
          <button
            type="button"
            onClick={handleBuatDeskripsiAI}
            disabled={sedangMembuatAI}
            aria-label="Buat deskripsi dengan AI"
            className="inline-flex items-center gap-1.5 rounded-lg border border-garis bg-permukaan px-3 py-1.5 text-xs font-semibold text-utama hover:border-utama hover:bg-latar disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
          >
            {sedangMembuatAI ? (
              <>
                <svg
                  className="h-3.5 w-3.5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Sedang membuat deskripsi...</span>
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
                  className="h-3.5 w-3.5 text-utama"
                  aria-hidden="true"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  <path d="M5 3v4" />
                  <path d="M3 5h4" />
                  <path d="M19 17v4" />
                  <path d="M17 19h4" />
                </svg>
                <span>Buat dengan AI</span>
              </>
            )}
          </button>
        </div>

        {/* Pesan error pembuatan AI jika terjadi kendala */}
        {pesanErrorAI && (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-garis bg-permukaan p-2.5 text-xs text-bahaya">
            <span>{pesanErrorAI}</span>
            <button
              type="button"
              onClick={handleBuatDeskripsiAI}
              className="font-bold underline hover:no-underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Notifikasi ketika deskripsi berhasil di-generate */}
        {pesanSuksesAI && (
          <div className="rounded-lg border border-garis bg-permukaan p-2.5 text-xs text-utama">
            {pesanSuksesAI}
          </div>
        )}

        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => {
            setDeskripsi(e.target.value);
            if (pesanSuksesAI) setPesanSuksesAI("");
          }}
          placeholder="Tulis deskripsi atau gunakan tombol 'Buat dengan AI' di atas..."
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <Tombol type="submit">{labelTombol}</Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
