'use client'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { formatRupiah, waLink } from '@/lib/api'
import { serviceIcons, InstagramIcon } from './icons'
import { InquiryForm } from './inquiry-form'
import {
  Smartphone, Zap, Search, ShieldCheck, Headset, Globe,
  ChevronLeft, ChevronRight, Star, CheckCircle2, Quote,
  MessageCircle, Mail, MapPin, Package as PackageIcon,
} from 'lucide-react'

export function Advantages() {
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

export function Steps() {
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

export function ArticleSlider({ articles = [], onReadMore }) {
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
                          <Button variant="link" className="mt-3 p-0 h-auto text-primary-strong justify-start" onClick={() => handleToggleExpand(a)}>
                            Baca selengkapnya →
                          </Button>
                        </>
                      ) : (
                        <div className="mt-3 flex-grow">
                          <div className="text-sm text-muted-foreground whitespace-pre-line">
                            {a.content}
                          </div>
                          <Button variant="link" className="mt-3 p-0 h-auto text-primary-strong justify-start" onClick={() => handleToggleExpand(a)}>
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

export function Packages({ packages = [], onPesan }) {
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

export function Services({ services = [], onPesan }) {
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
                  <div className="text-primary-strong font-bold text-sm mt-2">{formatRupiah(s.price)}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Testimonials({ list = [] }) {
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

export function FAQ({ list = [] }) {
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
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary-strong flex items-center justify-center text-sm font-bold group-hover:bg-primary group-hover:text-primary-foreground transition">
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

export function Contact({ whatsapp, services = [], packages = [] }) {
  return (
    <section id="kontak" className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <Badge variant="outline" className="mb-4">Kontak</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Siap Bangun Website Bisnis Anda?</h2>
            <p className="mt-4 text-muted-foreground text-lg">Konsultasi gratis tanpa biaya. Tim kami akan menghubungi Anda dalam 1 jam kerja.</p>
            <div className="mt-8 space-y-4">
              <a href={waLink(whatsapp, 'Halo Webku, saya ingin konsultasi pembuatan website.')} target="_blank" className="flex items-center gap-3 hover:text-primary-strong transition">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><MessageCircle className="w-5 h-5" /></div>
                <div><div className="text-xs text-muted-foreground">WhatsApp</div><div className="font-semibold">+{whatsapp}</div></div>
              </a>
              <a href="https://instagram.com/webku_" target="_blank" className="flex items-center gap-3 hover:text-primary-strong transition">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div><div className="text-xs text-muted-foreground">Instagram</div><div className="font-semibold">@webku_</div></div>
              </a>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Mail className="w-5 h-5" /></div>
                <div><div className="text-xs text-muted-foreground">Email</div><div className="font-semibold">webkuuuid@gmail.com</div></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><MapPin className="w-5 h-5" /></div>
                <div><div className="text-xs text-muted-foreground">Lokasi</div><div className="font-semibold">Yogyakarta, Indonesia</div></div>
              </div>
            </div>
          </div>
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