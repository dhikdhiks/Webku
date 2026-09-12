import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME && process.env.DB_NAME !== 'your_database_name' ? process.env.DB_NAME : 'webku';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'webku2025';

let cachedClient = null;
let cachedDb = null;

async function getDb() {
  if (!MONGO_URL) {
    console.error("CRITICAL: MONGO_URL tidak terbaca di Vercel!");
    throw new Error("Database configuration missing. Please check Vercel Environment Variables.");
  }

  if (cachedDb) return cachedDb;

  if (!cachedClient) {
    try {
      cachedClient = new MongoClient(MONGO_URL, {
        maxPoolSize: 10,
        socketTimeoutMS: 30000,
        connectTimeoutMS: 10000,
      });
      await cachedClient.connect();
      console.log("MongoDB connected successfully");
    } catch (dbError) {
      console.error("Gagal koneksi ke MongoClient:", dbError);
      throw dbError;
    }
  }
  cachedDb = cachedClient.db(DB_NAME);
  return cachedDb;
}

// --- Seed data on first call ---
async function ensureSeed(db) {
  const seeded = await db.collection('settings').findOne({ key: 'seeded' })
  if (seeded) return

  const categories = [
    { id: uuidv4(), slug: 'umkm', name: 'UMKM', icon: 'Store' },
    { id: uuidv4(), slug: 'company-profile', name: 'Company Profile', icon: 'Building2' },
    { id: uuidv4(), slug: 'klinik-gigi', name: 'Klinik Gigi', icon: 'Stethoscope' },
    { id: uuidv4(), slug: 'klinik-hewan', name: 'Klinik Hewan', icon: 'PawPrint' },
    { id: uuidv4(), slug: 'klub-bola', name: 'Klub Bola', icon: 'Trophy' },
    { id: uuidv4(), slug: 'klub-futsal', name: 'Klub Futsal', icon: 'Trophy' },
    { id: uuidv4(), slug: 'sekolah', name: 'Sekolah', icon: 'GraduationCap' },
    { id: uuidv4(), slug: 'pondok-pesantren', name: 'Pondok Pesantren', icon: 'BookOpen' },
    { id: uuidv4(), slug: 'properti', name: 'Properti', icon: 'Home' },
    { id: uuidv4(), slug: 'rental-mobil', name: 'Rental Mobil', icon: 'Car' },
    { id: uuidv4(), slug: 'bengkel', name: 'Bengkel', icon: 'Wrench' },
    { id: uuidv4(), slug: 'restoran', name: 'Restoran', icon: 'UtensilsCrossed' },
    { id: uuidv4(), slug: 'cafe', name: 'Cafe', icon: 'Coffee' },
    { id: uuidv4(), slug: 'toko-online', name: 'Toko Online', icon: 'ShoppingBag' },
    { id: uuidv4(), slug: 'travel', name: 'Travel', icon: 'Plane' },
    { id: uuidv4(), slug: 'notaris', name: 'Notaris', icon: 'Scale' },
    { id: uuidv4(), slug: 'pengacara', name: 'Pengacara', icon: 'Gavel' },
    { id: uuidv4(), slug: 'kontraktor', name: 'Kontraktor', icon: 'HardHat' },
    { id: uuidv4(), slug: 'hotel', name: 'Hotel', icon: 'BedDouble' },
    { id: uuidv4(), slug: 'homestay', name: 'Homestay', icon: 'Tent' },
    { id: uuidv4(), slug: 'custom', name: 'Custom Website', icon: 'Sparkles' },
  ]
  await db.collection('website_categories').insertMany(categories)

  const thumbs = [
    'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=940&q=80',
    'https://i.ibb.co.com/m5LDtp70/laptop.avif',
    'https://images.pexels.com/photos/15717263/pexels-photo-15717263.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=940&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=940&q=80',
  ]

  const demos = [
    { name: 'Resto Nusantara', categorySlug: 'restoran', desc: 'Website restoran modern dengan menu interaktif dan reservasi online.', price: 1499000, thumb: thumbs[4], demoUrl: 'https://demo.webku.id/restoran' },
    { name: 'Kopi Senja Cafe', categorySlug: 'cafe', desc: 'Website cafe estetik dengan galeri foto dan informasi cabang.', price: 1499000, thumb: thumbs[5], demoUrl: 'https://demo.webku.id/cafe' },
    { name: 'Klinik Senyum Sehat', categorySlug: 'klinik-gigi', desc: 'Website klinik gigi profesional dengan booking jadwal dan layanan.', price: 1999000, thumb: thumbs[1], demoUrl: 'https://demo.webku.id/klinik-gigi' },
    { name: 'PetCare Veterinary', categorySlug: 'klinik-hewan', desc: 'Website klinik hewan dengan layanan grooming dan konsultasi.', price: 1999000, thumb: thumbs[2], demoUrl: 'https://demo.webku.id/klinik-hewan' },
    { name: 'Persija Junior FC', categorySlug: 'klub-bola', desc: 'Website klub sepak bola dengan jadwal pertandingan dan profil pemain.', price: 1999000, thumb: thumbs[0], demoUrl: 'https://demo.webku.id/klub-bola' },
    { name: 'Futsal Champions', categorySlug: 'klub-futsal', desc: 'Website klub futsal dengan booking lapangan dan turnamen.', price: 1999000, thumb: thumbs[3], demoUrl: 'https://demo.webku.id/futsal' },
    { name: 'SD Negeri Maju Jaya', categorySlug: 'sekolah', desc: 'Website sekolah dengan PPDB online, e-learning, dan pengumuman.', price: 2499000, thumb: thumbs[1], demoUrl: 'https://demo.webku.id/sekolah' },
    { name: 'Pondok Al-Hikmah', categorySlug: 'pondok-pesantren', desc: 'Website pondok pesantren dengan profil, kegiatan, dan pendaftaran santri.', price: 2499000, thumb: thumbs[2], demoUrl: 'https://demo.webku.id/pesantren' },
    { name: 'Griya Properti', categorySlug: 'properti', desc: 'Website properti dengan listing rumah, simulasi KPR, dan filter pencarian.', price: 2999000, thumb: thumbs[0], demoUrl: 'https://demo.webku.id/properti' },
    { name: 'Rental Mobil Jaya', categorySlug: 'rental-mobil', desc: 'Website rental mobil dengan booking online dan katalog kendaraan.', price: 1999000, thumb: thumbs[3], demoUrl: 'https://demo.webku.id/rental' },
    { name: 'Bengkel Otomotif Pro', categorySlug: 'bengkel', desc: 'Website bengkel dengan layanan service dan booking servis online.', price: 1499000, thumb: thumbs[5], demoUrl: 'https://demo.webku.id/bengkel' },
    { name: 'Toko Batik Modern', categorySlug: 'toko-online', desc: 'Toko online lengkap dengan keranjang, pembayaran, dan tracking.', price: 2999000, thumb: thumbs[4], demoUrl: 'https://demo.webku.id/toko' },
    { name: 'Travel Wisata Indonesia', categorySlug: 'travel', desc: 'Website travel dengan paket wisata, booking, dan testimoni.', price: 2499000, thumb: thumbs[2], demoUrl: 'https://demo.webku.id/travel' },
    { name: 'Notaris Cendekia', categorySlug: 'notaris', desc: 'Website kantor notaris profesional dengan layanan dan konsultasi.', price: 1999000, thumb: thumbs[1], demoUrl: 'https://demo.webku.id/notaris' },
    { name: 'Lawfirm Keadilan', categorySlug: 'pengacara', desc: 'Website kantor pengacara dengan profil, layanan hukum, dan artikel.', price: 1999000, thumb: thumbs[0], demoUrl: 'https://demo.webku.id/pengacara' },
    { name: 'Bangun Kontraktor', categorySlug: 'kontraktor', desc: 'Website jasa kontraktor dengan portfolio proyek dan layanan.', price: 1999000, thumb: thumbs[3], demoUrl: 'https://demo.webku.id/kontraktor' },
    { name: 'Hotel Bintang Lima', categorySlug: 'hotel', desc: 'Website hotel dengan booking kamar dan fasilitas lengkap.', price: 3999000, thumb: thumbs[5], demoUrl: 'https://demo.webku.id/hotel' },
    { name: 'Villa Homestay Bali', categorySlug: 'homestay', desc: 'Website homestay dengan galeri, booking, dan info lokasi.', price: 1999000, thumb: thumbs[4], demoUrl: 'https://demo.webku.id/homestay' },
    { name: 'UMKM Kerajinan Khas', categorySlug: 'umkm', desc: 'Website UMKM modern dengan produk, profil, dan kontak.', price: 1499000, thumb: thumbs[2], demoUrl: 'https://demo.webku.id/umkm' },
    { name: 'PT Sukses Mandiri', categorySlug: 'company-profile', desc: 'Company profile profesional dengan layanan dan portfolio.', price: 999000, thumb: thumbs[0], demoUrl: 'https://demo.webku.id/company' },
  ]

  const demoDocs = demos.map((d) => ({
    id: uuidv4(),
    name: d.name,
    slug: d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    thumbnail: d.thumb,
    screenshots: [d.thumb],
    categorySlug: d.categorySlug,
    category: categories.find(c => c.slug === d.categorySlug)?.name || 'Custom',
    description: d.desc,
    features: ['Responsive Mobile First', 'SEO Friendly', 'Loading Super Cepat', 'Admin Panel', 'Integrasi WhatsApp', 'SSL Security'],
    price: d.price,
    status: 'active',
    demoUrl: d.demoUrl,
    createdAt: new Date(),
    keywords: [                              // <-- TAMBAHKAN
       d.name.toLowerCase(),
       d.categorySlug,
       ...d.desc.split(' ').filter(w => w.length > 3),
       ...['Responsive Mobile First', 'SEO Friendly', 'Loading Super Cepat', 'Admin Panel', 'Integrasi WhatsApp', 'SSL Security'].map(f => f.toLowerCase())
    ]
 }));
  await db.collection('website_demos').insertMany(demoDocs)

  const services = [
    { id: uuidv4(), name: 'Desain Logo', desc: 'Logo profesional untuk identitas bisnis Anda.', price: 299000, icon: 'Palette' },
    { id: uuidv4(), name: 'Banner Promosi', desc: 'Banner promosi menarik untuk media sosial dan website.', price: 99000, icon: 'Image' },
    { id: uuidv4(), name: 'Poster', desc: 'Desain poster event dan promosi yang eye-catching.', price: 99000, icon: 'FileImage' },
    { id: uuidv4(), name: 'Brosur', desc: 'Brosur cetak dan digital profesional.', price: 199000, icon: 'FileText' },
    { id: uuidv4(), name: 'Katalog PDF', desc: 'Katalog produk dalam format PDF interaktif.', price: 399000, icon: 'BookOpen' },
    { id: uuidv4(), name: 'Company Profile PDF', desc: 'Company profile PDF profesional.', price: 499000, icon: 'Briefcase' },
    { id: uuidv4(), name: 'Desain Feed Instagram', desc: 'Paket feed Instagram estetik dan profesional.', price: 299000, icon: 'Instagram' },
    { id: uuidv4(), name: 'Desain Kemasan Produk', desc: 'Desain packaging produk yang menjual.', price: 599000, icon: 'Package' },
    { id: uuidv4(), name: 'Kartu Nama', desc: 'Desain kartu nama profesional siap cetak.', price: 99000, icon: 'CreditCard' },
    { id: uuidv4(), name: 'Undangan Digital', desc: 'Undangan digital pernikahan/event modern.', price: 299000, icon: 'Mail' },
    { id: uuidv4(), name: 'Optimasi Google Business', desc: 'Optimasi GMB agar bisnis muncul di pencarian Google.', price: 499000, icon: 'MapPin' },
  ]
  await db.collection('services').insertMany(services)

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
  ]
  for (const p of packagesData) {
    const exists = await db.collection('packages').findOne({ name: p.name })
    if (!exists) {
      await db.collection('packages').insertOne({ id: uuidv4(), ...p, createdAt: new Date() })
    }
  }

  const testimonials = [
    { id: uuidv4(), name: 'Ibu Rina', business: 'Pemilik Toko Batik Modern', photo: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200&q=80', content: 'Setelah pakai website dari Webku, omzet toko saya naik 3x lipat! Pesanan datang dari luar kota dan luar negeri.' },
    { id: uuidv4(), name: 'Pak Budi', business: 'Pemilik Bengkel Otomotif Pro', photo: 'https://images.pexels.com/photos/8422729/pexels-photo-8422729.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300', content: 'Pelayanan Webku sangat cepat dan ramah. Website saya jadi dalam 5 hari, dan langsung ramai pengunjung.' },
    { id: uuidv4(), name: 'Dr. Sari', business: 'Klinik Senyum Sehat', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80', content: 'Pasien klinik semakin banyak karena mudah booking lewat website. Sangat membantu praktek kami.' },
    { id: uuidv4(), name: 'Pak Hendra', business: 'Travel Wisata Indonesia', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', content: 'Website travel kami terlihat sangat profesional. Banyak klien korporat yang mempercayakan trip mereka.' },
    { id: uuidv4(), name: 'Ibu Linda', business: 'Cafe Kopi Senja', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', content: 'Webku paham banget kebutuhan UMKM. Harga terjangkau, hasil premium. Recommended banget!' },
    { id: uuidv4(), name: 'Pak Eko', business: 'Kepala Sekolah SD Maju Jaya', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', content: 'PPDB online sangat membantu. Orangtua siswa bisa daftar dari rumah. Terima kasih Webku!' },
  ]
  await db.collection('testimonials').insertMany(testimonials)

  const faqs = [
    { id: uuidv4(), question: 'Apa itu website?', answer: 'Website adalah kumpulan halaman online yang dapat diakses melalui internet menggunakan alamat tertentu (domain). Website berfungsi sebagai "toko" atau "kantor" online bisnis Anda yang aktif 24 jam.' },
    { id: uuidv4(), question: 'Apa itu domain?', answer: 'Domain adalah alamat unik website Anda di internet, contohnya webku.id atau tokosaya.com. Domain memudahkan pengunjung mengingat alamat website Anda.' },
    { id: uuidv4(), question: 'Apa itu hosting?', answer: 'Hosting adalah tempat penyimpanan semua file website Anda di server agar bisa diakses 24 jam. Ibarat sewa lahan untuk membangun toko.' },
    { id: uuidv4(), question: 'Kenapa bisnis perlu website?', answer: 'Website membuat bisnis Anda terlihat lebih profesional, mudah ditemukan di Google, dapat diakses 24 jam, dan menjangkau pelanggan dari mana saja. Bisnis dengan website terbukti lebih dipercaya konsumen.' },
    { id: uuidv4(), question: 'Apa bedanya website dan media sosial?', answer: 'Website adalah aset milik Anda sendiri sepenuhnya, terindex Google, dan tidak terikat aturan platform. Media sosial bersifat sewa - bisa kena banned, algoritma berubah, dan kontrol terbatas. Idealnya keduanya digunakan bersamaan.' },
    { id: uuidv4(), question: 'Berapa lama pembuatan website?', answer: 'Tergantung paket: Landing Page 2-3 hari, Company Profile 4-7 hari, Website UMKM 5-10 hari, Toko Online 10-14 hari, Custom Website menyesuaikan kebutuhan.' },
    { id: uuidv4(), question: 'Apakah sudah termasuk domain dan hosting?', answer: 'Ya, semua paket sudah termasuk domain .com/.id dan hosting selama 1 tahun GRATIS. Perpanjangan tahun kedua mulai Rp200rb/tahun.' },
    { id: uuidv4(), question: 'Bagaimana cara order?', answer: 'Cukup klik tombol WhatsApp di website kami, isi form yang tersedia, atau hubungi langsung tim kami. Pembayaran fleksibel via transfer bank.' },
  ]
  await db.collection('faq').insertMany(faqs)

  const articles = [
    { id: uuidv4(), title: 'Apa itu Domain dan Mengapa Penting untuk Bisnis Anda', slug: 'apa-itu-domain', category: 'Domain', thumbnail: thumbs[0], excerpt: 'Pelajari apa itu domain, jenis-jenisnya, dan kenapa pemilihan domain mempengaruhi branding bisnis Anda.', content: 'Domain adalah alamat unik website Anda di internet. Tanpa domain, pengunjung tidak bisa menemukan website. Domain yang baik singkat, mudah diingat, dan mencerminkan bisnis Anda.\n\nJenis domain populer: .com (komersial internasional), .id (Indonesia, kredibel), .co.id (perusahaan resmi), .net, .org, dll.\n\nTips memilih domain: gunakan nama brand, hindari tanda hubung berlebihan, pilih ekstensi sesuai target pasar, dan cek ketersediaan dengan teliti.', createdAt: new Date() },
    { id: uuidv4(), title: 'Apa itu Hosting? Panduan Lengkap untuk Pemula', slug: 'apa-itu-hosting', category: 'Hosting', thumbnail: thumbs[1], excerpt: 'Hosting adalah fondasi website. Pahami jenis hosting dan cara memilih yang tepat.', content: 'Hosting adalah layanan penyimpanan file website di server yang terhubung internet 24 jam. Pilihan hosting berpengaruh pada kecepatan, keamanan, dan uptime website Anda.\n\nJenis hosting: Shared Hosting (murah, untuk pemula), VPS (lebih powerful), Cloud Hosting (scalable), dan Dedicated Server (premium).\n\nUntuk UMKM, shared hosting sudah cukup. Pilih provider terpercaya dengan uptime > 99.9% dan support 24/7.', createdAt: new Date() },
    { id: uuidv4(), title: 'Mengapa UMKM Wajib Punya Website di Era Digital', slug: 'mengapa-umkm-butuh-website', category: 'UMKM', thumbnail: thumbs[2], excerpt: '7 alasan kuat mengapa UMKM harus segera memiliki website untuk berkembang.', content: 'Era digital menuntut UMKM beradaptasi. Berikut 7 alasan UMKM wajib punya website:\n\n1. Kredibilitas - bisnis dengan website lebih dipercaya konsumen modern.\n2. Aksesibilitas 24/7 - pelanggan bisa lihat produk kapan saja.\n3. Jangkauan luas - tidak terbatas geografis.\n4. Marketing tools - bisa dipadukan dengan Google Ads, SEO, dan email marketing.\n5. Branding profesional - tampilan konsisten dan rapi.\n6. Database pelanggan - bisa kumpulkan kontak dan personalisasi penawaran.\n7. Kompetitif - jangan biarkan kompetitor menyalip Anda.', createdAt: new Date() },
    { id: uuidv4(), title: 'Manfaat Website untuk Pertumbuhan Bisnis', slug: 'manfaat-website-bisnis', category: 'Website', thumbnail: thumbs[3], excerpt: 'Lihat data nyata bagaimana website meningkatkan revenue bisnis hingga 3x lipat.', content: 'Website adalah investasi terbaik untuk bisnis modern. Manfaatnya: meningkatkan konversi penjualan, membangun trust, memudahkan layanan pelanggan, dan menjadi aset digital jangka panjang.\n\nStudi menunjukkan bisnis dengan website profesional mengalami peningkatan revenue rata-rata 2-3x dalam 6 bulan pertama.', createdAt: new Date() },
    { id: uuidv4(), title: 'Perbedaan Website dan Media Sosial: Mana yang Lebih Penting?', slug: 'perbedaan-website-dan-medsos', category: 'Marketing', thumbnail: thumbs[4], excerpt: 'Jangan salah pilih! Pahami perbedaan dan kelebihan masing-masing.', content: 'Website dan media sosial punya fungsi berbeda. Website adalah aset milik Anda sepenuhnya, terindex Google, dan tidak terikat aturan platform.\n\nMedia sosial bagus untuk engagement dan brand awareness, tapi bersifat sewa - bisa kena banned, algoritma berubah, dan kontrol terbatas.\n\nKesimpulan: pakai keduanya. Website sebagai "rumah" utama, medsos sebagai pintu masuk traffic.', createdAt: new Date() },
    { id: uuidv4(), title: 'Tips SEO untuk Website UMKM Pemula', slug: 'tips-seo-umkm', category: 'SEO', thumbnail: thumbs[5], excerpt: 'Optimasi website agar nomor 1 di Google tanpa biaya iklan.', content: 'SEO (Search Engine Optimization) adalah cara agar website Anda muncul di halaman 1 Google. Tips dasar SEO untuk UMKM:\n\n1. Riset kata kunci sesuai bisnis lokal.\n2. Optimasi title & meta description tiap halaman.\n3. Konten artikel berkualitas dan rutin.\n4. Optimasi Google Business Profile.\n5. Backlink dari website terpercaya.\n6. Mobile-friendly dan loading cepat.', createdAt: new Date() },
  ]
  await db.collection('articles').insertMany(articles)

  // Buat indeks untuk optimasi query
await db.collection('website_demos').createIndex({ categorySlug: 1, createdAt: -1 })
await db.collection('articles').createIndex({ createdAt: -1 })
await db.collection('faq').createIndex({ order: 1, createdAt: 1 })
await db.collection('inquiries').createIndex({ createdAt: -1 })

  await db.collection('settings').insertOne({
    key: 'seeded', value: true, createdAt: new Date(),
    whatsapp: '6281227225178',
    siteName: 'Webku',
    tagline: 'Website Profesional untuk UMKM dan Bisnis Modern',
    email: 'halo@webku.id',
    address: 'Jakarta, Indonesia',
  })
  await db.collection('settings').insertOne({
    key: 'stats',
    projects: 1247,
    happyClients: 980,
    yearsExperience: 5,
    categoriesServed: 21,
  })
}

function j(data, status = 200) {
  return NextResponse.json(data, { status })
}

async function handler(request, { params }) {
  const db = await getDb()
  await ensureSeed(db)

  const path = (params?.path || []).join('/')
  const method = request.method
  const url = new URL(request.url)

  try {
    // ===== PUBLIC API =====
    if (path === 'settings' && method === 'GET') {
      const s = await db.collection('settings').findOne({ key: 'seeded' })
      const stats = await db.collection('settings').findOne({ key: 'stats' })
      return j({ settings: s, stats })
    }
    if (path === 'categories' && method === 'GET') {
      const items = await db.collection('website_categories').find({}).toArray()
      return j(items.map(({ _id, ...r }) => r))
    }
    if (path === 'demos' && method === 'GET') {
      const cat = url.searchParams.get('category')
      const q = cat && cat !== 'all' ? { categorySlug: cat } : {}
      const items = await db.collection('website_demos').find(q).sort({ createdAt: -1 }).toArray()
      return j(items.map(({ _id, ...r }) => r))
    }
    if (path.startsWith('demos/') && method === 'GET') {
      const slug = path.split('/')[1]
      const item = await db.collection('website_demos').findOne({ slug })
      if (!item) return j({ error: 'Not found' }, 404)
      const { _id, ...r } = item
      return j(r)
    }
    if (path === 'services' && method === 'GET') {
      const items = await db.collection('services').find({}).toArray()
      return j(items.map(({ _id, ...r }) => r))
    }
    if (path === 'packages' && method === 'GET') {
      const items = await db.collection('packages').find({}).toArray()
      return j(items.map(({ _id, ...r }) => r))
    }
    if (path === 'testimonials' && method === 'GET') {
      const items = await db.collection('testimonials').find({}).toArray()
      return j(items.map(({ _id, ...r }) => r))
    }
    if (path === 'faqs' && method === 'GET') {
      const items = await db.collection('faq').find({}).toArray()
      return j(items.map(({ _id, ...r }) => r))
    }
    if (path === 'articles' && method === 'GET') {
      const items = await db.collection('articles').find({}).sort({ createdAt: -1 }).toArray()
      return j(items.map(({ _id, ...r }) => r))
    }
    if (path.startsWith('articles/') && method === 'GET') {
      const slug = path.split('/')[1]
      const item = await db.collection('articles').findOne({ slug })
      if (!item) return j({ error: 'Not found' }, 404)
      const { _id, ...r } = item
      return j(r)
    }
    if (path === 'inquiries' && method === 'POST') {

      const body = await request.json()
const inq = {
  id: uuidv4(),
  name: body.name || '',
  whatsapp: body.whatsapp || '',
  email: body.email || '',
  service: body.service || '',
  message: body.message || '',
  businessType: body.businessType || '',
  domicile: body.domicile || '',
  additionalServices: body.additionalServices || [],   // <-- BARIS INI DITAMBAHKAN
  status: 'baru',
  createdAt: new Date(),
}

      if (!inq.name || !inq.whatsapp) return j({ error: 'Nama dan WhatsApp wajib diisi' }, 400)
      await db.collection('inquiries').insertOne(inq)
      await db.collection('visitor_stats').insertOne({ id: uuidv4(), type: 'inquiry', at: new Date() })
      return j({ ok: true, id: inq.id })
    }
    if (path === 'track' && method === 'POST') {
      await db.collection('visitor_stats').insertOne({ id: uuidv4(), type: 'visit', at: new Date() })
      return j({ ok: true })
    }

    // ===== ADMIN API =====
    const authHeader = request.headers.get('x-admin-pass') || ''
    const isAdmin = authHeader === ADMIN_PASSWORD

    if (path === '23_webku_8login' && method === 'POST') {
      const body = await request.json()
      if (body.password === ADMIN_PASSWORD) return j({ ok: true, token: ADMIN_PASSWORD })
      return j({ error: 'Password salah' }, 401)
    }

    if (path.startsWith('23_webku_8')) {
      if (!isAdmin) return j({ error: 'Unauthorized' }, 401)

      // Stats
      if (path === '23_webku_8stats' && method === 'GET') {
        const [demos, articles, inquiries, services, visits] = await Promise.all([
          db.collection('website_demos').countDocuments(),
          db.collection('articles').countDocuments(),
          db.collection('inquiries').countDocuments(),
          db.collection('services').countDocuments(),
          db.collection('visitor_stats').countDocuments(),
        ])
        const newInq = await db.collection('inquiries').countDocuments({ status: 'baru' })
        return j({ demos, articles, inquiries, services, visits, newInquiries: newInq })
      }

      // Inquiries
      if (path === '23_webku_8inquiries' && method === 'GET') {
        const items = await db.collection('inquiries').find({}).sort({ createdAt: -1 }).toArray()
        return j(items.map(({ _id, ...r }) => r))
      }
      if (path.startsWith('23_webku_8inquiries/') && method === 'PATCH') {
        const id = path.split('/')[1]
        const body = await request.json()
        await db.collection('inquiries').updateOne({ id }, { $set: { status: body.status } })
        return j({ ok: true })
      }
      if (path.startsWith('23_webku_8inquiries/') && method === 'DELETE') {
        const id = path.split('/')[1]
        await db.collection('inquiries').deleteOne({ id })
        return j({ ok: true })
      }

      // ==================== DEMOS (HANYA SATU PATCH) ====================
      if (path === '23_webku_8demos' && method === 'POST') {
        const body = await request.json()
        const doc = {
          id: uuidv4(),
          name: body.name,
          slug: (body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          thumbnail: body.thumbnail || '',
          screenshots: body.screenshots || [],
          categorySlug: body.categorySlug,
          category: body.category,
          description: body.description || '',
          features: body.features || [],
          price: parseInt(body.price) || 0,
          status: body.status || 'active',
          demoUrl: body.demoUrl || '',
          createdAt: new Date(),
        }
        await db.collection('website_demos').insertOne(doc)
        return j({ ok: true, id: doc.id })
      }
if (path.startsWith('23_webku_8demos/') && method === 'PATCH') {
  const id = path.split('/')[1]
  const body = await request.json()
  const existing = await db.collection('website_demos').findOne({ id })
  if (!existing) {
    console.error(`Demo not found with id: ${id}`)
    return j({ error: `Demo not found with id: ${id}` }, 404)
  }
  const updateData = {
    name: body.name,
    slug: (body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    thumbnail: body.thumbnail || '',
    categorySlug: body.categorySlug,
    category: body.category,
    description: body.description || '',
    price: parseInt(body.price) || 0,
    demoUrl: body.demoUrl || '',
    updatedAt: new Date(),
  }
  if (body.features) updateData.features = body.features   // <-- TAMBAHKAN BARIS INI
  await db.collection('website_demos').updateOne({ id }, { $set: updateData })
  return j({ ok: true })
}
      if (path.startsWith('23_webku_8demos/') && method === 'DELETE') {
        const id = path.split('/')[1]
        await db.collection('website_demos').deleteOne({ id })
        return j({ ok: true })
      }

      // ==================== ARTICLES ====================
      if (path === '23_webku_8articles' && method === 'POST') {
        const body = await request.json()
        const doc = {
          id: uuidv4(),
          title: body.title,
          slug: (body.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          category: body.category || 'Website',
          thumbnail: body.thumbnail || '',
          excerpt: body.excerpt || '',
          content: body.content || '',
          createdAt: new Date(),
        }
        await db.collection('articles').insertOne(doc)
        return j({ ok: true, id: doc.id })
      }
      if (path.startsWith('23_webku_8articles/') && method === 'PATCH') {
        const id = path.split('/')[1]
        const body = await request.json()
        const existing = await db.collection('articles').findOne({ id })
        if (!existing) return j({ error: 'Article not found' }, 404)
        await db.collection('articles').updateOne({ id }, { $set: { ...body, updatedAt: new Date() } })
        return j({ ok: true })
      }
      if (path.startsWith('23_webku_8articles/') && method === 'DELETE') {
        const id = path.split('/')[1]
        await db.collection('articles').deleteOne({ id })
        return j({ ok: true })
      }

      // ==================== PACKAGES ====================
      if (path === '23_webku_8packages' && method === 'POST') {
        const body = await request.json()
        const doc = {
          id: uuidv4(),
          name: body.name,
          price: parseInt(body.price) || 0,
          popular: body.popular || false,
          features: body.features || [],
          createdAt: new Date(),
        }
        await db.collection('packages').insertOne(doc)
        return j({ ok: true, id: doc.id })
      }
      if (path.startsWith('23_webku_8packages/') && method === 'PATCH') {
        const id = path.split('/')[1]
        const body = await request.json()
        const existing = await db.collection('packages').findOne({ id })
        if (!existing) return j({ error: 'Package not found' }, 404)
        await db.collection('packages').updateOne({ id }, { $set: { ...body, updatedAt: new Date() } })
        return j({ ok: true })
      }
      if (path.startsWith('23_webku_8packages/') && method === 'DELETE') {
        const id = path.split('/')[1]
        await db.collection('packages').deleteOne({ id })
        return j({ ok: true })
      }

      // ==================== SERVICES ====================
      if (path === '23_webku_8services' && method === 'POST') {
        const body = await request.json()
        const doc = {
          id: uuidv4(),
          name: body.name,
          desc: body.desc,
          price: parseInt(body.price) || 0,
          icon: body.icon || 'Package',
          createdAt: new Date(),
        }
        await db.collection('services').insertOne(doc)
        return j({ ok: true, id: doc.id })
      }
      if (path.startsWith('23_webku_8services/') && method === 'PATCH') {
        const id = path.split('/')[1]
        const body = await request.json()
        const existing = await db.collection('services').findOne({ id })
        if (!existing) return j({ error: 'Service not found' }, 404)
        await db.collection('services').updateOne({ id }, { $set: { ...body, updatedAt: new Date() } })
        return j({ ok: true })
      }
      if (path.startsWith('23_webku_8services/') && method === 'DELETE') {
        const id = path.split('/')[1]
        await db.collection('services').deleteOne({ id })
        return j({ ok: true })
      }

      // ==================== FAQ ====================
if (path === '23_webku_8faqs' && method === 'POST') {
  const body = await request.json()
  const doc = {
    id: uuidv4(),
    question: body.question,
    answer: body.answer,
    order: body.order || 0,
    createdAt: new Date(),
  }
  await db.collection('faq').insertOne(doc)
  return j({ ok: true, id: doc.id })
}
if (path.startsWith('23_webku_8faqs/') && method === 'PATCH') {
  const id = path.split('/')[1]
  const body = await request.json()
  const existing = await db.collection('faq').findOne({ id })
  if (!existing) return j({ error: 'FAQ not found' }, 404)
  await db.collection('faq').updateOne({ id }, { $set: { ...body, updatedAt: new Date() } })
  return j({ ok: true })
}
if (path.startsWith('23_webku_8faqs/') && method === 'DELETE') {
  const id = path.split('/')[1]
  await db.collection('faq').deleteOne({ id })
  return j({ ok: true })
}

      // ==================== TESTIMONIALS (DENGAN PATCH) ====================
      if (path === '23_webku_8testimonials' && method === 'POST') {
        const body = await request.json()
        const doc = {
          id: uuidv4(),
          name: body.name,
          business: body.business,
          photo: body.photo,
          content: body.content,
          createdAt: new Date(),
        }
        await db.collection('testimonials').insertOne(doc)
        return j({ ok: true, id: doc.id })
      }
      if (path.startsWith('23_webku_8testimonials/') && method === 'PATCH') {
        const id = path.split('/')[1]
        const body = await request.json()
        const existing = await db.collection('testimonials').findOne({ id })
        if (!existing) return j({ error: 'Testimonial not found' }, 404)
        await db.collection('testimonials').updateOne({ id }, { $set: { ...body, updatedAt: new Date() } })
        return j({ ok: true })
      }
      if (path.startsWith('23_webku_8testimonials/') && method === 'DELETE') {
        const id = path.split('/')[1]
        await db.collection('testimonials').deleteOne({ id })
        return j({ ok: true })
      }
    }

    return j({ error: 'Not found', path, method }, 404)
  } catch (e) {
    console.error('API error', e)
    return j({ error: e.message }, 500)
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler