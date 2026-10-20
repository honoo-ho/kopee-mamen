import Tombol from "@/components/Tombol";

export const metadata = {
  title: "Koneksi Terputus - Toko Kopee Mamen",
  description: "Katalog memerlukan koneksi internet aktif.",
};

export default function HalamanOffline() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
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
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>

      <h1 className="mt-6 text-2xl font-extrabold text-teks sm:text-3xl">
        Koneksi Internet Terputus
      </h1>
      <p className="mt-3 max-w-md text-base text-teks-lembut">
        Kamu sedang tidak terhubung ke internet. Katalog produk dan pemesanan Toko Kopee Mamen memerlukan jaringan aktif agar selalu menampilkan ketersediaan dan harga terbaru.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Tombol href="/">Coba Muat Ulang</Tombol>
      </div>
    </div>
  );
}

