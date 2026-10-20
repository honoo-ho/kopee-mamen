import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import TombolBagikan from "@/components/TombolBagikan";
import { formatRupiah } from "@/lib/format";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  const supabase = createServerClient();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // Jika terjadi kesalahan server/database, jangan keliru menganggapnya sebagai 404
  if (error) {
    return (
      <div className="py-12">
        <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
          Kembali ke katalog
        </Link>
        <div className="mt-4 rounded-xl border border-garis bg-permukaan p-6 text-bahaya">
          <h2 className="text-lg font-bold">Terjadi kesalahan</h2>
          <p className="mt-1 text-sm text-teks-lembut">
            Gagal memuat data produk dari database: {error.message}
          </p>
        </div>
      </div>
    );
  }

  // Jika data produk tidak ditemukan di database, panggil notFound()
  if (!produk) {
    notFound();
  }

  return (
    <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
      <img
        src={produk.foto_url}
        alt={produk.nama}
        className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
      />
      <div className="flex flex-col gap-4">
        <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
          Kembali ke katalog
        </Link>
        <p className="text-sm text-teks-lembut">{produk.kategori}</p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
        <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
          {formatRupiah(produk.harga)}
        </p>
        <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <TombolWhatsApp produk={produk} />
          <TombolBagikan produk={produk} />
        </div>
      </div>
    </article>
  );
}
