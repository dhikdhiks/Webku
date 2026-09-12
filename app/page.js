'use client'
import { useEffect, useMemo, useState, useRef } from 'react'
import './globals.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { toast } from 'sonner'
import { api, formatRupiah, waLink } from '@/lib/api'
import {
  Rocket, MessageCircle, Sparkles, Globe, Smartphone, Search, ShieldCheck, Zap, Headset,
  CheckCircle2, ArrowRight, Star, Phone, Mail, MapPin, Send, Quote, BookOpen,
  Palette, Image as ImageIcon, FileImage, FileText, Briefcase, Package as PackageIcon,
  CreditCard, Menu as MenuIcon, X, ChevronLeft, ChevronRight,
} from 'lucide-react'

const WA_DEFAULT = '6281227225178'

const PX_WEBDEV = 'https://images.pexels.com/photos/7988114/pexels-photo-7988114.jpeg'
const PX_TEAM = 'https://images.pexels.com/photos/8117465/pexels-photo-8117465.jpeg'
const PX_LAPTOP = 'https://images.pexels.com/photos/15717263/pexels-photo-15717263.jpeg'
const US_LAPTOP = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'

const COLLAGE_SIZES = '(min-width: 1280px) 340px, (min-width: 1024px) 240px, calc(50vw - 24px)'

const pexelsSrc = (base, widths) =>
  widths.map(w => `${base}?auto=compress&cs=tinysrgb&w=${w} ${w}w`).join(', ')

const unsplashSrc = (base, widths) =>
  widths.map(w => `${base}?auto=format&fit=crop&q=60&w=${w} ${w}w`).join(', ')

const serviceIcons = {
  Palette, Image: ImageIcon, FileImage, FileText, BookOpen, Briefcase, Package: PackageIcon,
  CreditCard, Mail, MapPin,
}
const InstagramIcon = ({ className, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

function Navbar({ onCTAClick, whatsapp }) {
  const [open, setOpen] = useState(false)
  const links = [
    { href: '#beranda', label: 'Beranda' },
    { href: '#paket', label: 'Paket' },
    { href: '#layanan', label: 'Layanan' },
    { href: '#blog', label: 'Blog' },
    { href: '#tentang', label: 'Tentang' },
    { href: '#faq', label: 'FAQ' },
  ]
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <a href="#beranda" className="flex items-center">
          <div className="h-20 w-auto flex items-center justify-start overflow-hidden">
            <img 
              src="https://res.cloudinary.com/dpaowxbve/image/upload/v1781960156/Logoaaazz_6_ynhb0m.gif" 
              alt="Logo Jati Damai" 
              width="1000"
              height="500"
              fetchPriority="low"
              decoding="async"
              className="h-full w-auto object-contain"
            />
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          {links.map(l => <a key={l.href} href={l.href} className="hover:text-foreground transition">{l.label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <Button onClick={onCTAClick} className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/30">
            <MessageCircle className="w-4 h-4 mr-2" /> Konsultasi Gratis
          </Button>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-expanded={open}
            aria-controls="mobile-menu" aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}>
            {open ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {links.map(l => <a key={l.href} onClick={() => setOpen(false)} href={l.href} className="text-sm font-medium py-2">{l.label}</a>)}
            <Button onClick={() => { onCTAClick(); setOpen(false) }} className="bg-primary text-primary-foreground rounded-full">
              <MessageCircle className="w-4 h-4 mr-2" /> Konsultasi Gratis
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

function Hero({ stats, onCTAClick, whatsapp }) {
  return (
    <section id="beranda" className="relative overflow-hidden">
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />
      <div className="container mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-6 py-2.5 mb-6 text-base">
              <Sparkles className="w-4 h-4 mr-2" /> Trusted by 1000+ UMKM Indonesia
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              Website <span className="gradient-text">Profesional</span> untuk UMKM dan Bisnis Modern
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Bangun kehadiran online bisnis Anda dengan website yang cepat, mobile friendly, dan SEO ready.
              Mulai dari <strong className="text-foreground">Rp499.000</strong> sudah termasuk domain & hosting 1 tahun.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={onCTAClick} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-base h-12 px-7 shadow-xl shadow-primary/30">
                <MessageCircle className="w-5 h-5 mr-2" /> Chat WhatsApp Sekarang
              </Button>
            </div>
            {/* <div className="mt-10 grid grid-cols-4 gap-4 max-w-lg">
              {[
                { v: stats?.projects || 1247, l: 'Proyek' },
                { v: stats?.happyClients || 980, l: 'Klien' },
                { v: stats?.yearsExperience || 5, l: 'Tahun' },
                { v: stats?.categoriesServed || 21, l: 'Kategori' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{s.v}+</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div> */}
          </div>
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-tr from-primary/30 via-primary/10 to-transparent rounded-full blur-3xl opacity-70" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src={`${PX_WEBDEV}?auto=compress&cs=tinysrgb&w=600`}
                  srcSet={pexelsSrc(PX_WEBDEV, [300, 450, 600, 800])}
                  sizes={COLLAGE_SIZES}
                  width="600"
                  height="400"
                  fetchPriority="high"
                  decoding="async"
                  alt="web dev"
                  className="rounded-2xl shadow-2xl aspect-[3/4] object-cover"
                />
                <img
                  src={`${PX_LAPTOP}?auto=compress&cs=tinysrgb&w=600`}
                  srcSet={pexelsSrc(PX_LAPTOP, [300, 450, 600, 800])}
                  sizes={COLLAGE_SIZES}
                  width="600"
                  height="452"
                  loading="lazy"
                  decoding="async"
                  alt="laptop"
                  className="rounded-2xl shadow-2xl aspect-square object-cover"
                />
              </div>
              <div className="space-y-4 pt-12">
                <img
                  src={`${US_LAPTOP}?auto=format&fit=crop&q=60&w=600`}
                  srcSet={unsplashSrc(US_LAPTOP, [300, 450, 600, 800])}
                  sizes={COLLAGE_SIZES}
                  width="600"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  alt="laptop"
                  className="rounded-2xl shadow-2xl aspect-square object-cover"
                />
                <img
                  src={`${PX_TEAM}?auto=compress&cs=tinysrgb&w=600`}
                  srcSet={pexelsSrc(PX_TEAM, [300, 450, 600, 800])}
                  sizes={COLLAGE_SIZES}
                  width="600"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  alt="team"
                  className="rounded-2xl shadow-2xl aspect-[3/4] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Advantages() {
  const items = [
    { icon: Smartphone, title: 'Mobile First', desc: 'Tampil sempurna di semua perangkat: HP, tablet, dan desktop.' },
    { icon: Zap, title: 'Loading Super Cepat', desc: 'Performa optimal dengan Lighthouse Score 90+.' },
    { icon: Search, title: 'SEO Friendly', desc: 'Mudah ditemukan di Google dengan optimasi on-page lengkap.' },
    { icon: ShieldCheck, title: 'Aman & SSL', desc: 'Sertifikat SSL gratis, proteksi data pengunjung Anda.' },
    { icon: Headset, title: 'Support Ramah', desc: 'Tim support yang siap bantu via WhatsApp 7 hari seminggu.' },
    { icon: Globe, title: 'Domain & Hosting', desc: 'Sudah termasuk domain dan hosting 1 tahun gratis.' },
  ]
  return (
    <section id="tentang" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4">Keunggulan Webku</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Kenapa Memilih Webku?</h2>
          <p className="mt-4 text-muted-foreground">Kami fokus membangun website yang benar-benar membantu bisnis Anda tumbuh.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <Card key={i} className="border-border/60 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all group">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <it.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg">{it.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{it.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Steps() {
  const steps = [
    { n: '01', t: 'Konsultasi Gratis', d: 'Hubungi via WhatsApp, kami bantu pilihkan paket yang tepat.' },
    { n: '02', t: 'Pilih Template & Bayar', d: 'Pilih dari ratusan template atau request custom design.' },
    { n: '03', t: 'Proses Pembuatan', d: 'Tim kami buat website Anda 2-14 hari sesuai paket.' },
    { n: '04', t: 'Website Live!', d: 'Website siap online + training penggunaan + support.' },
  ]
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4">Cara Kerja</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">4 Langkah Mudah Punya Website</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              <div className="text-5xl font-bold gradient-text">{s.n}</div>
              <h3 className="font-semibold text-lg mt-3">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Komponen Slider Artikel
function ArticleSlider({ articles = [], onReadMore }) {
  const scrollRef = useRef(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  const scroll = (direction) => {
    if (!scrollRef.current) return
    const { scrollLeft, clientWidth } = scrollRef.current
    const offset = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8
    scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' })
  }

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeft(scrollLeft > 10)
    setShowRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [articles])

  const handleToggleExpand = (article) => {
    if (expandedId === article.id) {
      setExpandedId(null)
    } else {
      setExpandedId(article.id)
    }
  }

  if (!articles || articles.length === 0) return null

  return (
    <section id="blog" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4">Blog & Artikel</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Tips & Inspirasi Bisnis</h2>
          <p className="mt-4 text-muted-foreground">Temukan artikel menarik seputar digital marketing dan pengembangan usaha.</p>
        </div>
        <div className="relative group">
          {showLeft && (
            <button onClick={() => scroll('left')} aria-label="Artikel sebelumnya" className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {showRight && (
            <button onClick={() => scroll('right')} aria-label="Artikel berikutnya" className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide" onScroll={checkScroll}>
            {articles.map((a) => {
              const isExpanded = expandedId === a.id
              return (
                <div key={a.id} className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] snap-start">
                  <Card className="overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all border-border/60 h-full flex flex-col">
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img src={a.thumbnail} alt={a.title} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                    </div>
                    <CardContent className="p-5 flex flex-col flex-grow">
                      <Badge variant="outline" className="text-xs w-fit">{a.category}</Badge>
                      <h3 className="font-semibold text-base mt-3 line-clamp-2">{a.title}</h3>
                      {!isExpanded ? (
                        <>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-3 flex-grow">{a.excerpt}</p>
                          <Button variant="link" className="mt-3 p-0 h-auto text-primary justify-start" onClick={() => handleToggleExpand(a)}>
                            Baca selengkapnya →
                          </Button>
                        </>
                      ) : (
                        <div className="mt-3 flex-grow">
                          <div className="text-sm text-muted-foreground whitespace-pre-line">
                            {a.content}
                          </div>
                          <Button variant="link" className="mt-3 p-0 h-auto text-primary justify-start" onClick={() => handleToggleExpand(a)}>
                            Tutup ↑
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function Packages({ packages = [], onPesan }) {
  return (
    <section id="paket" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4">Paket Harga</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Harga Transparan, Tanpa Biaya Tersembunyi</h2>
          <p className="mt-4 text-muted-foreground">Semua paket sudah termasuk domain & hosting 1 tahun.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((p, i) => (
            <Card key={p.id || i} className={`relative overflow-visible ${p.popular ? 'border-primary shadow-2xl shadow-primary/20 scale-[1.02]' : 'border-border/60'}`}>
              {p.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full px-3 py-1.5">
                  <Star className="w-3 h-3 mr-1 fill-current" /> Paling Populer
                </Badge>
              )}
              <CardContent className="p-7">
                <h3 className="font-bold text-xl">{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{formatRupiah(p.price)}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {(p.features || []).map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button onClick={() => onPesan({ name: `Paket ${p.name}`, price: p.price })} className={`w-full mt-6 rounded-full ${p.popular ? 'bg-primary text-primary-foreground' : ''}`} variant={p.popular ? 'default' : 'outline'}>
                  Pesan Paket Ini
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Services({ services = [], onPesan }) {
  return (
    <section id="layanan" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4">Layanan Lainnya</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Layanan Desain Pendukung</h2>
          <p className="mt-4 text-muted-foreground">Lengkapi branding bisnis Anda dengan layanan desain profesional.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map(s => {
            const Icon = serviceIcons[s.icon] || PackageIcon
            return (
              <Card key={s.id} className="hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer" onClick={() => onPesan({ name: s.name, price: s.price })}>
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.desc}</p>
                  <div className="text-primary font-bold text-sm mt-2">{formatRupiah(s.price)}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Testimonials({ list = [] }) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4">Testimoni</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Apa Kata Klien Webku?</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map(t => (
            <Card key={t.id} className="border-border/60">
              <CardContent className="p-6">
                <Quote className="w-7 h-7 text-primary/40 mb-3" />
                <p className="text-sm leading-relaxed">{t.content}</p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border/50">
                  <img src={t.photo} alt={t.name} loading="lazy" decoding="async" className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.business}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ({ list = [] }) {
  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Pertanyaan yang Sering Diajukan</h2>
          <p className="mt-4 text-muted-foreground">Temukan jawaban atas pertanyaan umum seputar website dan layanan kami.</p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {list.map((f, i) => (
            <AccordionItem key={f.id} value={`item-${i}`} className="border border-border/60 rounded-xl px-4 bg-card hover:shadow-md transition-all">
              <AccordionTrigger className="text-left py-4 hover:no-underline group">
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold group-hover:bg-primary group-hover:text-primary-foreground transition">
                    {i+1}
                  </span>
                  <span className="font-semibold">{f.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 pl-9">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

function InquiryForm({ whatsapp, prefilled, onSent, services = [], packages = [] }) {
  const [form, setForm] = useState({ 
    name: '', whatsapp: '', email: '', service: prefilled?.name || '', 
    businessType: '', domicile: '', message: '' 
  });
  const [additionalServices, setAdditionalServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(f => ({ ...f, service: prefilled?.name || f.service }));
  }, [prefilled]);

  const serviceOptions = useMemo(() => {
    const pkgNames = (packages || []).map(p => p.name);
    // demos sudah dihapus total
    return [...new Set([...pkgNames])];
  }, [packages]);

  const toggleAdditionalService = (serviceName) => {
    setAdditionalServices(prev =>
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.whatsapp) {
      toast.error('Nama dan WhatsApp wajib diisi');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        additionalServices,
      };
      await api('inquiries', { method: 'POST', body: JSON.stringify(payload) });
      const msg = `Halo Webku, saya tertarik dengan layanan ${form.service || 'pembuatan website'}.\n\nNama: ${form.name}\nJenis Usaha: ${form.businessType}\nDomisili: ${form.domicile}\n\nLayanan Pendukung: ${additionalServices.join(', ') || '-'}\n\n${form.message}\n\nMohon informasi lebih lanjut.`;
      window.open(waLink(whatsapp, msg), '_blank');
      toast.success('Inquiry terkirim! Kami juga membuka WhatsApp untuk Anda.');
      setForm({ name: '', whatsapp: '', email: '', service: '', businessType: '', domicile: '', message: '' });
      setAdditionalServices([]);
      onSent?.();
    } catch (err) {
      toast.error(err.message || 'Gagal mengirim');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div><Label>Nama Lengkap *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Budi Santoso" /></div>
        <div><Label>WhatsApp *</Label><Input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="081234567890" /></div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@contoh.com" /></div>
        <div>
          <Label>Layanan yang Diminati</Label>
          <Input 
            list="service-list"
            value={form.service} 
            onChange={e => setForm({ ...form, service: e.target.value })} 
            placeholder="Website UMKM, Toko Online, dll" 
          />
          <datalist id="service-list">
            {serviceOptions.map(opt => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><Label>Jenis Usaha</Label><Input value={form.businessType} onChange={e => setForm({ ...form, businessType: e.target.value })} placeholder="Toko Fashion" /></div>
        <div><Label>Domisili</Label><Input value={form.domicile} onChange={e => setForm({ ...form, domicile: e.target.value })} placeholder="Yogyakarta" /></div>
      </div>

      {services && services.length > 0 && (
        <div>
          <Label>Layanan Pendukung (opsional)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {services.map(s => (
              <label key={s.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={additionalServices.includes(s.name)}
                  onChange={() => toggleAdditionalService(s.name)}
                  className="rounded border-primary"
                />
                {s.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div><Label>Pesan</Label><Textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Ceritakan kebutuhan website Anda..." /></div>
      <Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground rounded-full h-12 text-base">
        {submitting ? 'Mengirim...' : (<><Send className="w-4 h-4 mr-2" /> Kirim & Lanjut ke WhatsApp</>)}
      </Button>
    </form>
  );
}

function Contact({ whatsapp, services = [], packages = [] }) {
  return (
    <section id="kontak" className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <Badge variant="outline" className="mb-4">Kontak</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Siap Bangun Website Bisnis Anda?</h2>
            <p className="mt-4 text-muted-foreground text-lg">Konsultasi gratis tanpa biaya. Tim kami akan menghubungi Anda dalam 1 jam kerja.</p>
            <div className="mt-8 space-y-4">
              {/* WhatsApp */}
              <a href={waLink(whatsapp, 'Halo Webku, saya ingin konsultasi pembuatan website.')} target="_blank" className="flex items-center gap-3 hover:text-primary transition">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><MessageCircle className="w-5 h-5" /></div>
                <div><div className="text-xs text-muted-foreground">WhatsApp</div><div className="font-semibold">+{whatsapp}</div></div>
              </a>
              {/* Instagram - pakai komponen SVG sendiri */}
              <a href="https://instagram.com/webku_" target="_blank" className="flex items-center gap-3 hover:text-primary transition">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div><div className="text-xs text-muted-foreground">Instagram</div><div className="font-semibold">@webku_</div></div>
              </a>
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Mail className="w-5 h-5" /></div>
                <div><div className="text-xs text-muted-foreground">Email</div><div className="font-semibold">webkuuuid@gmail.com</div></div>
              </div>
              {/* Lokasi */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><MapPin className="w-5 h-5" /></div>
                <div><div className="text-xs text-muted-foreground">Lokasi</div><div className="font-semibold">Yogyakarta, Indonesia</div></div>
              </div>
            </div>
          </div>
          {/* ... form di sebelah kanan tetap sama ... */}
          <Card className="border-primary/20 shadow-2xl shadow-primary/10">
            <CardContent className="p-6 md:p-8">
              <h3 className="font-bold text-xl mb-1">Konsultasi Gratis</h3>
              <p className="text-sm text-muted-foreground mb-6">Isi form di bawah, kami akan menghubungi via WhatsApp.</p>
              <InquiryForm whatsapp={whatsapp} services={services} packages={packages} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
          <div className="h-20 w-auto flex items-center justify-start overflow-hidden">
            <img 
              src="https://res.cloudinary.com/dpaowxbve/image/upload/v1781960156/Logoaaazz_6_ynhb0m.gif" 
              alt="Logo Jati Damai" 
              width="1000"
              height="500"
              fetchPriority="low"
              decoding="async"
              className="h-full w-auto object-contain"
            />
          </div>
            <p className="text-sm text-muted-foreground">Website Profesional untuk UMKM dan Bisnis Modern.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Layanan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#paket" className="hover:text-foreground">Pembuatan Website</a></li>
              <li><a href="#layanan" className="hover:text-foreground">Desain Logo</a></li>
              <li><a href="#layanan" className="hover:text-foreground">Toko Online</a></li>
              <li><a href="#layanan" className="hover:text-foreground">SEO & Marketing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Perusahaan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#tentang" className="hover:text-foreground">Tentang Kami</a></li>
              <li><a href="#blog" className="hover:text-foreground">Blog</a></li>
              <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Kontak</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>webkuuuid@gmail.com</li>
              <li>Yogyakarta, Indonesia</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Webku. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

function WhatsAppFloating({ whatsapp }) {
  return (
    <a href={waLink(whatsapp, 'Halo Webku, saya ingin konsultasi.')} target="_blank"
      aria-label="Hubungi Webku melalui WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-2xl shadow-green-500/40 hover:scale-110 transition">
      <MessageCircle className="w-7 h-7" />
      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50 animate-ping" />
    </a>
  )
}

export default function App() {
  const [packages, setPackages] = useState([])
  const [services, setServices] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [faqs, setFaqs] = useState([])
  const [articles, setArticles] = useState([])
  const [whatsapp, setWhatsapp] = useState(WA_DEFAULT)
  const [stats, setStats] = useState(null)
  const [orderOpen, setOrderOpen] = useState(false)
  const [articleDetail, setArticleDetail] = useState(null)
  const [prefilled, setPrefilled] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const [pkg, svc, tst, fq, art, st] = await Promise.all([
          api('packages'),
          api('services'),
          api('testimonials'),
          api('faqs'),
          api('articles'),
          api('settings'),
        ])
        // Pastikan data yang diterima adalah array, jika tidak gunakan []
        setPackages(Array.isArray(pkg) ? pkg : [])
        setServices(Array.isArray(svc) ? svc : [])
        setTestimonials(Array.isArray(tst) ? tst : [])
        setFaqs(Array.isArray(fq) ? fq : [])
        setArticles(Array.isArray(art) ? art : [])
        if (st?.settings?.whatsapp) setWhatsapp(st.settings.whatsapp)
        if (st?.stats) setStats(st.stats)
        api('track', { method: 'POST' }).catch(() => {})
      } catch (e) { 
        console.error(e)
        // Jika error, tetap set state kosong agar tidak crash
        setPackages([])
        setServices([])
        setTestimonials([])
        setFaqs([])
        setArticles([])
      }
    })()
  }, [])

  const openOrder = (item) => { setPrefilled(item); setOrderOpen(true) }
  const onCTA = () => { setPrefilled(null); setOrderOpen(true) }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCTAClick={onCTA} whatsapp={whatsapp} />
      <main>
        <Hero stats={stats} onCTAClick={onCTA} whatsapp={whatsapp} />
        <Advantages />
        <Steps />
        {articles.length > 0 && <ArticleSlider articles={articles} onReadMore={setArticleDetail} />}
        {packages.length > 0 && <Packages packages={packages} onPesan={openOrder} />}
        {services.length > 0 && <Services services={services} onPesan={openOrder} />}
        {testimonials.length > 0 && <Testimonials list={testimonials} />}
        {faqs.length > 0 && <FAQ list={faqs} />}
        <Contact whatsapp={whatsapp} services={services} packages={packages} />
      </main>
      <Footer />
      <WhatsAppFloating whatsapp={whatsapp} />

      {/* Dialog untuk form pemesanan */}
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Pemesanan</DialogTitle>
            <DialogDescription>Isi data Anda, kami akan menghubungi via WhatsApp.</DialogDescription>
          </DialogHeader>
          <InquiryForm whatsapp={whatsapp} prefilled={prefilled} onSent={() => setOrderOpen(false)} services={services} packages={packages} />
        </DialogContent>
      </Dialog>

      {/* Dialog untuk detail artikel */}
      <Dialog open={!!articleDetail} onOpenChange={(o) => !o && setArticleDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 sm:p-6">
          {articleDetail && (
            <>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl sm:rounded-xl">
                <img 
                  src={articleDetail.thumbnail} 
                  alt={articleDetail.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur text-foreground border-none">
                    {articleDetail.category}
                  </Badge>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 line-clamp-2">
                    {articleDetail.title}
                  </h2>
                </div>
              </div>
              <div className="px-5 pb-6 pt-2 sm:px-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 border-b pb-3">
                  <span>📅 {new Date(articleDetail.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>👤 Admin Webku</span>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 mb-5 italic text-sm border-l-4 border-primary">
                  {articleDetail.excerpt}
                </div>
                <div 
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: articleDetail.content.replace(/\n/g, '<br/>') }}
                />
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setArticleDetail(null)}
                    className="flex-1"
                  >
                    Tutup
                  </Button>
                  <Button 
                    onClick={() => {
                      setArticleDetail(null);
                      openOrder({ name: `Artikel: ${articleDetail.title}` });
                    }} 
                    className="flex-1 bg-primary text-primary-foreground"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Konsultasi Sekarang
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}