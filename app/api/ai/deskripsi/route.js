import { NextResponse } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";
import { buatDeskripsiProduk } from "@/lib/gemini";

/**
 * Route Handler untuk menghasilkan deskripsi produk dengan AI (Gemini API) di backend (US-14).
 * Memastikan pemanggil sudah terautentikasi sebagai admin.
 */
export async function POST(request) {
  try {
    // 1. Verifikasi autentikasi admin di server
    const supabase = await createSessionClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Akses ditolak: Kamu harus login sebagai admin terlebih dahulu." },
        { status: 401 }
      );
    }

    // 2. Baca payload JSON
    const body = await request.json().catch(() => ({}));
    const { nama, kategori } = body;

    const hasil = await buatDeskripsiProduk({ nama, kategori });

    if (hasil.error) {
      return NextResponse.json({ error: hasil.error }, { status: 400 });
    }

    return NextResponse.json(hasil);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan pada server saat memproses AI." },
      { status: 500 }
    );
  }
}

