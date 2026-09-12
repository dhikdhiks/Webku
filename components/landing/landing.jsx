'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { api, waLink } from '@/lib/api'
import { InquiryForm } from './inquiry-form'
import { MessageCircle, MenuIcon, X, Sparkles } from 'lucide-react'

const WA_DEFAULT = '6281227225178'

const LOGO_URL = 'https://res.cloudinary.com/dpaowxbve/image/upload/w_320,f_png/v1789192122/Webkulogo_mzvidq.gif'

const PX_WEBDEV = 'https://images.pexels.com/photos/7988114/pexels-photo-7988114.jpeg?auto=compress&cs=tinysrgb&w=2400'
const PX_TEAM = 'https://images.pexels.com/photos/8117465/pexels-photo-8117465.jpeg?auto=compress&cs=tinysrgb&w=2400'
const PX_LAPTOP = 'https://images.pexels.com/photos/15717263/pexels-photo-15717263.jpeg?auto=compress&cs=tinysrgb&w=2400'
const US_LAPTOP = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=2400'

const COLLAGE_SIZES = '(min-width: 1280px) 340px, (min-width: 1024px) 240px, calc(50vw - 24px)'

const Advantages = dynamic(() => import('./sections').then(m => m.Advantages), { ssr: true, loading: () => null })
const Steps = dynamic(() => import('./sections').then(m => m.Steps), { ssr: true, loading: () => null })
const ArticleSlider = dynamic(() => import('./sections').then(m => m.ArticleSlider), { ssr: true, loading: () => null })
const Packages = dynamic(() => import('./sections').then(m => m.Packages), { ssr: true, loading: () => null })
const Services = dynamic(() => import('./sections').then(m => m.Services), { ssr: true, loading: () => null })
const Testimonials = dynamic(() => import('./sections').then(m => m.Testimonials), { ssr: true, loading: () => null })
const FAQ = dynamic(() => import('./sections').then(m => m.FAQ), { ssr: true, loading: () => null })
const Contact = dynamic(() => import('./sections').then(m => m.Contact), { ssr: true, loading: () => null })

function Navbar({ onCTAClick }) {
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
              src={LOGO_URL}
              alt="Logo Jati Damai"
              width="160"
              height="80"
              fetchPriority="low"
              decoding="async"
              className="h-full w-auto object-contain"
            />
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          {links.map(l => <a key={l.href} href={l.href} className="hover:text-primary-strong transition">{l.label}</a>)}
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

function Hero({ onCTAClick }) {
  return (
    <section id="beranda" className="relative overflow-hidden">
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />
      <div className="container mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-primary/10 text-primary-strong rounded-full px-6 py-2.5 mb-6 text-base">
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
          </div>
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-tr from-primary/30 via-primary/10 to-transparent rounded-full blur-3xl opacity-70" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative rounded-2xl shadow-2xl aspect-[3/4] overflow-hidden">
                  <Image
                    src={PX_WEBDEV}
                    alt="web dev"
                    fill
                    sizes={COLLAGE_SIZES}
                    priority
                    quality={85}
                    className="object-cover"
                  />
                </div>
                <div className="relative rounded-2xl shadow-2xl aspect-square overflow-hidden">
                  <Image
                    src={PX_LAPTOP}
                    alt="laptop"
                    fill
                    sizes={COLLAGE_SIZES}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="relative rounded-2xl shadow-2xl aspect-square overflow-hidden">
                  <Image
                    src={US_LAPTOP}
                    alt="laptop"
                    fill
                    sizes={COLLAGE_SIZES}
                    className="object-cover"
                  />
                </div>
                <div className="relative rounded-2xl shadow-2xl aspect-[3/4] overflow-hidden">
                  <Image
                    src={PX_TEAM}
                    alt="team"
                    fill
                    sizes={COLLAGE_SIZES}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
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
              src={LOGO_URL}
              alt="Logo Jati Damai"
              width="160"
              height="80"
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
              <li><a href="#paket" className="hover:text-primary-strong">Pembuatan Website</a></li>
              <li><a href="#layanan" className="hover:text-primary-strong">Desain Logo</a></li>
              <li><a href="#layanan" className="hover:text-primary-strong">Toko Online</a></li>
              <li><a href="#layanan" className="hover:text-primary-strong">SEO & Marketing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Perusahaan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#tentang" className="hover:text-primary-strong">Tentang Kami</a></li>
              <li><a href="#blog" className="hover:text-primary-strong">Blog</a></li>
              <li><a href="#faq" className="hover:text-primary-strong">FAQ</a></li>
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

export default function LandingPage({ initialData }) {
  const [packages, setPackages] = useState(initialData?.packages || [])
  const [services, setServices] = useState(initialData?.services || [])
  const [testimonials, setTestimonials] = useState(initialData?.testimonials || [])
  const [faqs, setFaqs] = useState(initialData?.faqs || [])
  const [articles, setArticles] = useState(initialData?.articles || [])
  const [whatsapp, setWhatsapp] = useState(initialData?.settings?.whatsapp || WA_DEFAULT)
  const [orderOpen, setOrderOpen] = useState(false)
  const [articleDetail, setArticleDetail] = useState(null)
  const [prefilled, setPrefilled] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [pkg, svc, tst, fq, art, st] = await Promise.all([
          api('packages'),
          api('services'),
          api('testimonials'),
          api('faqs'),
          api('articles'),
          api('settings'),
        ])
        if (!alive) return
        setPackages(Array.isArray(pkg) ? pkg : [])
        setServices(Array.isArray(svc) ? svc : [])
        setTestimonials(Array.isArray(tst) ? tst : [])
        setFaqs(Array.isArray(fq) ? fq : [])
        setArticles(Array.isArray(art) ? art : [])
        if (st?.settings?.whatsapp) setWhatsapp(st.settings.whatsapp)
      } catch (e) {
        if (!alive) return
        console.error(e)
      }
    })()
    api('track', { method: 'POST' }).catch(() => {})
    return () => { alive = false }
  }, [])

  const openOrder = (item) => { setPrefilled(item); setOrderOpen(true) }
  const onCTA = () => { setPrefilled(null); setOrderOpen(true) }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCTAClick={onCTA} />
      <main>
        <Hero onCTAClick={onCTA} />
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

      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Pemesanan</DialogTitle>
            <DialogDescription>Isi data Anda, kami akan menghubungi via WhatsApp.</DialogDescription>
          </DialogHeader>
          <InquiryForm whatsapp={whatsapp} prefilled={prefilled} onSent={() => setOrderOpen(false)} services={services} packages={packages} />
        </DialogContent>
      </Dialog>

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