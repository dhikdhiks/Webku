const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid'); // jika error, ganti uuidv4() dengan Math.random().toString() di bawah

// GANTI URL DI BAWAH INI DENGAN URL ATLAS KAMU YANG PASSWORDNYA SUDAH BERSIH
const MONGO_URL = "mongodb+srv://laraveldiks_db_user:suradem23@cluster0.seqtc8a.mongodb.net/webku?retryWrites=true&w=majority";

const packagesData = [
  { name: 'Landing Page', price: 499000, popular: false, features: ['1 halaman responsif', 'Form kontak', 'WhatsApp integration', 'SEO basic', 'Domain & Hosting 1 tahun', 'Pengerjaan 2-3 hari'] },
  { name: 'Company Profile', price: 999000, popular: false, features: ['5 halaman', 'Profil & layanan', 'Galeri', 'Form kontak', 'SEO friendly', 'Domain & Hosting 1 tahun'] },
  { name: 'Website UMKM', price: 1499000, popular: true, features: ['7 halaman', 'Katalog produk', 'WhatsApp order', 'Google Maps', 'SEO + Analytics', 'Domain & Hosting 1 tahun'] },
  { name: 'Klinik Gigi', price: 1999000, popular: false, features: ['Booking jadwal', 'Profil dokter', 'Layanan & harga', 'Testimoni pasien', 'Blog edukasi', 'Domain & Hosting'] },
  { name: 'Klinik Hewan', price: 1999000, popular: false, features: ['Booking konsultasi', 'Layanan grooming', 'Tim dokter hewan', 'Tips perawatan', 'Galeri', 'Domain & Hosting'] },
  { name: 'Klub Bola/Futsal', price: 1999000, popular: false, features: ['Profil klub & pemain', 'Jadwal pertandingan', 'Hasil & klasemen', 'Galeri foto', 'News & blog', 'Domain & Hosting'] },
  { name: 'Sekolah', price: 2499000, popular: false, features: ['PPDB Online', 'E-learning sederhana', 'Pengumuman', 'Profil guru', 'Galeri kegiatan', 'Domain & Hosting'] },
  { name: 'Toko Online', price: 2999000, popular: true, features: ['Katalog unlimited', 'Keranjang & checkout', 'Multi-payment', 'Tracking pesanan', 'Dashboard admin', 'Domain & Hosting'] },
  { name: 'Website Custom', price: 3999000, popular: false, features: ['Sesuai kebutuhan', 'Fitur custom', 'Konsultasi dedicated', 'Revisi unlimited', 'Support 6 bulan', 'Domain & Hosting'] },
];

async function run() {
  console.log("Mencoba menghubungkan ke MongoDB Atlas...");
  const client = new MongoClient(MONGO_URL);
  
  try {
    await client.connect();
    console.log("✅ Berhasil terhubung ke Atlas!");
    
    const db = client.db('webku');
    const collection = db.collection('packages');
    
    console.log("Memulai proses seeding data...");
    for (const p of packagesData) {
      const exists = await collection.findOne({ name: p.name });
      if (!exists) {
        // Menggunakan Math.random jika project belum menginstall package uuid di scope node biasa
        const id = typeof uuidv4 === 'function' ? uuidv4() : 'pkg_' + Math.random().toString(36).substr(2, 9);
        await collection.insertOne({ id, ...p, createdAt: new Date() });
        console.log(`> Berhasil memasukkan paket: ${p.name}`);
      } else {
        console.log(`> Paket sudah ada: ${p.name}`);
      }
    }
    console.log("🎉 SEEDING SELESAI! Semua data sukses dikirim.");
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat seed:", error);
  } finally {
    await client.close();
  }
}

run();