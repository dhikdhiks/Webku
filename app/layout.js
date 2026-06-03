import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'Webku — Website Profesional untuk UMKM dan Bisnis Modern',
  description: 'Jasa pembuatan website profesional untuk UMKM, klinik, sekolah, klub olahraga, toko online, dan bisnis lokal. Modern, cepat, SEO friendly mulai Rp499.000.',
  keywords: 'jasa pembuatan website, website UMKM, website murah, website klinik, website sekolah, website toko online, web developer Indonesia',
  openGraph: {
    title: 'Webku — Website Profesional untuk UMKM dan Bisnis Modern',
    description: 'Jasa pembuatan website profesional mulai Rp499.000. Modern, cepat, SEO friendly.',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webku — Website Profesional untuk UMKM',
    description: 'Jasa pembuatan website profesional mulai Rp499.000.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}