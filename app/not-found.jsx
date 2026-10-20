import Link from "next/link";
import Tombol from "@/components/Tombol";

export const metadata = {
  title: "Halaman Tidak Ditemukan - Toko Kopee Mamen",
  description: "Halaman atau produk yang kamu cari tidak ditemukan.",
};

export default function TidakDitemukan() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center sm:py-24">
      {/* Ikon 404 */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-garis bg-permukaan text-teks-lembut">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-teks-lembut"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      </div>

      <p className="mt-4 text-xs font-bold tracking-widest text-utama uppercase">
        Error 404
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-teks sm:text-3xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-3 max-w-md text-sm text-teks-lembut">
        Produk atau halaman yang kamu cari tidak ada, sudah dihapus, atau tautan yang kamu tuju salah.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Tombol href="/">Kembali ke katalog</Tombol>
      </div>
    </div>
  );
}
