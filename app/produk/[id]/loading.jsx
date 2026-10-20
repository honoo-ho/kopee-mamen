export default function DetailProdukLoading() {
  return (
    <article
      role="status"
      aria-live="polite"
      aria-label="Memuat detail produk"
      className="grid gap-8 py-8 md:grid-cols-2 md:py-12"
    >
      {/* Skeleton Foto Produk */}
      <div className="aspect-square w-full rounded-2xl border border-garis bg-permukaan animate-pulse" />

      {/* Skeleton Informasi Produk */}
      <div className="flex flex-col gap-4">
        {/* Kembali ke katalog */}
        <div className="h-4 w-28 rounded bg-permukaan animate-pulse" />

        {/* Kategori */}
        <div className="h-4 w-20 rounded bg-permukaan animate-pulse" />

        {/* Nama produk */}
        <div className="h-9 w-3/4 rounded-lg bg-permukaan animate-pulse" />

        {/* Label harga */}
        <div className="h-8 w-32 rounded-md bg-permukaan animate-pulse" />

        {/* Deskripsi */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="h-4 w-full rounded bg-permukaan animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-permukaan animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-permukaan animate-pulse" />
        </div>

        {/* Tombol aksi */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
          <div className="h-12 w-44 rounded-lg bg-permukaan animate-pulse" />
          <div className="h-12 w-28 rounded-lg bg-permukaan animate-pulse" />
        </div>
      </div>
      <span className="sr-only">Sedang memuat data produk, mohon tunggu...</span>
    </article>
  );
}

