/**
 * Memanggil Google Gemini API dari sisi server untuk menghasilkan deskripsi
 * produk UMKM kopee-mamen secara otomatis berdasarkan nama dan kategori.
 *
 * @param {Object} params
 * @param {string} params.nama - Nama produk (wajib)
 * @param {string} [params.kategori] - Kategori produk (opsional)
 * @returns {Promise<{ success?: boolean, deskripsi?: string, error?: string }>}
 */
export async function buatDeskripsiProduk({ nama, kategori }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    return {
      error:
        "GEMINI_API_KEY belum dikonfigurasi di file .env.local. Tambahkan GEMINI_API_KEY untuk mengaktifkan fitur ini.",
    };
  }

  const namaBersih = nama ? String(nama).trim() : "";
  const kategoriBersih = kategori ? String(kategori).trim() : "";

  if (!namaBersih) {
    return { error: "Nama produk wajib diisi sebelum membuat deskripsi." };
  }

  if (namaBersih.length > 100) {
    return { error: "Nama produk terlalu panjang (maksimal 100 karakter)." };
  }

  const prompt = `Kamu adalah copywriter untuk katalog produk UMKM kopee-mamen (kedai kopi dan minuman kekinian).
Tugas: Buat deskripsi produk yang menarik, natural, dan ringkas (1-2 paragraf singkat, sekitar 2-4 kalimat) dalam bahasa Indonesia untuk produk berikut:
- Nama produk: ${namaBersih}
${kategoriBersih ? `- Kategori: ${kategoriBersih}` : ""}

Aturan penting:
1. Gunakan bahasa Indonesia yang ramah, santun, dan menggugah selera pelanggan.
2. Jelaskan cita rasa, aroma, atau kesegaran produk secara wajar dan relevan sesuai nama dan kategorinya.
3. JANGAN mengarang harga, diskon, promo, sertifikasi, garansi, bahan yang tidak pasti, atau klaim medis/kesehatan.
4. JANGAN gunakan tanda petik pembungkus, bullet points, judul, atau placeholder (seperti [Nama Produk]).
5. Berikan langsung teks deskripsi tanpa salam pembuka atau kata pengantar.`;

  // Daftar model yang didukung (fallback berurutan jika salah satu versi belum tersedia)
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `HTTP ${res.status}`;
        // Jika model tidak ditemukan (404), coba model berikutnya
        if (res.status === 404) {
          lastError = errMsg;
          continue;
        }
        return { error: `Gagal memanggil Gemini API: ${errMsg}` };
      }

      const data = await res.json();
      const hasil = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (hasil && typeof hasil === "string") {
        const deskripsiRapi = hasil.trim().replace(/^["']|["']$/g, "");
        return { success: true, deskripsi: deskripsiRapi };
      }

      lastError = "Respons AI tidak memuat teks deskripsi.";
    } catch (err) {
      lastError = err.message || "Terjadi kesalahan jaringan saat memanggil Gemini API.";
    }
  }

  return { error: lastError || "Gagal menghasilkan deskripsi dengan AI." };
}

