'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { api, formatRupiah } from '@/lib/api'
import { Rocket, Globe, FileText, MessageSquare, Users, LogOut, Trash2, Plus, ExternalLink, Pencil, Package, Layers, Star } from 'lucide-react'
import { Instagram } from 'lucide-react';

const PASS_KEY = 'webku_admin_pass'

function Login({ onLogin }) {
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await api('23_webku_8login', { method: 'POST', body: JSON.stringify({ password: pass }) })
      localStorage.setItem(PASS_KEY, r.token)
      onLogin(r.token)
      toast.success('Berhasil login')
    } catch (e) { toast.error(e.message) }
    finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardContent className="p-8">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-primary-foreground"><Rocket className="w-6 h-6" /></div>
            <span className="text-2xl font-bold gradient-text">Webku Admin</span>
          </div>
          <h1 className="text-xl font-semibold text-center mb-1">Login Super Admin</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">Masuk untuk kelola website</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Password</Label>
              <Input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Masukkan password" />
              <p className="text-xs text-muted-foreground mt-1">Default: <code>webku2025</code></p>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground">{loading ? 'Memproses...' : 'Login'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, hint }) {
  return (
    <Card className="rounded-3xl border shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className="text-3xl font-bold mt-1">{value}</div>
            {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Dashboard({ token }) {
  const [stats, setStats] = useState(null)
  useEffect(() => { api('23_webku_8stats', { headers: { 'x-admin-pass': token } }).then(setStats).catch(() => {}) }, [token])
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Demo" value={stats?.demos ?? '-'} icon={Globe} />
        <StatCard title="Total Artikel" value={stats?.articles ?? '-'} icon={FileText} />
        <StatCard title="Total Inquiry" value={stats?.inquiries ?? '-'} icon={MessageSquare} hint={`${stats?.newInquiries || 0} baru`} />
        <StatCard title="Pengunjung" value={stats?.visits ?? '-'} icon={Users} />
      </div>
      <Card>
        <CardHeader><CardTitle>Selamat Datang</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Kelola seluruh konten Webku dari panel ini. Tab di atas untuk mengelola inquiry, demo, dan artikel.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function Inquiries({ token }) {
  const [list, setList] = useState([])
  const load = () => api('23_webku_8inquiries', { headers: { 'x-admin-pass': token } }).then(setList).catch(() => {})
  useEffect(() => { load() }, [token])

  const updateStatus = async (id, status) => {
    await api(`23_webku_8inquiries/${id}`, { method: 'PATCH', headers: { 'x-admin-pass': token }, body: JSON.stringify({ status }) })
    toast.success('Status diperbarui')
    load()
  }
  const del = async (id) => {
    if (!confirm('Hapus inquiry ini?')) return
    await api(`23_webku_8inquiries/${id}`, { method: 'DELETE', headers: { 'x-admin-pass': token } })
    toast.success('Inquiry dihapus')
    load()
  }

  const statusColor = { baru: 'bg-blue-500', diproses: 'bg-yellow-500', selesai: 'bg-green-500' }
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Inquiry Pelanggan ({list.length})</h2>
      {list.length === 0 && <Card><CardContent className="p-8 text-center text-muted-foreground">Belum ada inquiry masuk.</CardContent></Card>}
      {list.map(i => (
        <Card key={i.id}>
          <CardContent className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{i.name}</h3>
                  <Badge className={`${statusColor[i.status] || 'bg-gray-500'} text-white capitalize`}>{i.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">WA: {i.whatsapp} {i.email && `· ${i.email}`}</div>
                <div className="text-sm mt-2"><strong>Layanan:</strong> {i.service || '-'}</div>
                {i.businessType && <div className="text-sm"><strong>Jenis usaha:</strong> {i.businessType} {i.domicile && `· ${i.domicile}`}</div>}
                {i.message && <div className="text-sm mt-2 p-3 bg-muted rounded">{i.message}</div>}
                <div className="text-xs text-muted-foreground mt-2">{new Date(i.createdAt).toLocaleString('id-ID')}</div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <a href={`https://wa.me/${i.whatsapp.replace(/^0/, '62')}`} target="_blank">
                  <Button size="sm" variant="outline" className="w-full"><ExternalLink className="w-3 h-3 mr-1" /> Chat WA</Button>
                </a>
                <Select value={i.status} onValueChange={(v) => updateStatus(i.id, v)}>
                  <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baru">Baru</SelectItem>
                    <SelectItem value="diproses">Diproses</SelectItem>
                    <SelectItem value="selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="destructive" onClick={() => del(i.id)}><Trash2 className="w-3 h-3 mr-1" /> Hapus</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function DemoManager({ token }) {
  const [list, setList] = useState([])
  const [cats, setCats] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', categorySlug: '', description: '', price: 1499000, thumbnail: '', demoUrl: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const load = () => api('demos').then(setList)
  useEffect(() => { load(); api('categories').then(setCats) }, [])

  const save = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    const cat = cats.find(c => c.slug === form.categorySlug)
    try {
      await api('23_webku_8demos', { method: 'POST', headers: { 'x-admin-pass': token }, body: JSON.stringify({ ...form, category: cat?.name, price: parseInt(form.price), features: ['Responsive', 'SEO Friendly', 'Mobile First'] }) })
      toast.success('Demo ditambahkan')
      setOpen(false); setForm({ name: '', categorySlug: '', description: '', price: 1499000, thumbnail: '', demoUrl: '' }); load()
    } catch (e) { toast.error(e.message) }
    finally { setIsSubmitting(false) }
  }
  
  const updateDemo = async (e) => {
    e.preventDefault()
    if (isSubmitting || !editing) return
    setIsSubmitting(true)
    const cat = cats.find(c => c.slug === form.categorySlug)
    const payload = {
      name: form.name,
      categorySlug: form.categorySlug,
      description: form.description,
      price: parseInt(form.price) || 0,
      thumbnail: form.thumbnail || '',
      demoUrl: form.demoUrl || '',
      category: cat?.name || ''
    }
    try {
      await api(`23_webku_8demos/${editing.id}`, {
        method: 'PATCH',
        headers: { 'x-admin-pass': token },
        body: JSON.stringify(payload)
      })
      toast.success('Demo berhasil diperbarui')
      setEditing(null)
      setForm({ name: '', categorySlug: '', description: '', price: 1499000, thumbnail: '', demoUrl: '' })
      setOpen(false)
      await load()
    } catch (e) { 
      toast.error(e.message || 'Gagal update demo')
    } finally { 
      setIsSubmitting(false) 
    }
  }
  
  const del = async (id) => {
    if (!confirm('Hapus demo ini?')) return
    await api(`23_webku_8demos/${id}`, { method: 'DELETE', headers: { 'x-admin-pass': token } })
    toast.success('Dihapus'); load()
  }

  const resetForm = () => {
    setEditing(null)
    setForm({ name: '', categorySlug: '', description: '', price: 1499000, thumbnail: '', demoUrl: '' })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Demo Website ({list.length})</h2>
        <Button onClick={() => { resetForm(); setOpen(!open) }}>
          <Plus className="w-4 h-4 mr-1" />
          Tambah Demo
        </Button>
      </div>
      {open && (
        <Card><CardContent className="p-5">
          <form onSubmit={editing ? updateDemo : save}>
            <div className="grid md:grid-cols-2 gap-3">
              <div><Label>Nama</Label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Kategori</Label>
                <Select value={form.categorySlug} onValueChange={v => setForm({ ...form, categorySlug: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                  <SelectContent>{cats.map(c => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div><Label>Harga</Label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
              <div><Label>Demo URL</Label><Input value={form.demoUrl} onChange={e => setForm({ ...form, demoUrl: e.target.value })} /></div>
            </div>
            <div><Label>Thumbnail URL</Label><Input required value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..." /></div>
            <div><Label>Deskripsi</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <Button type="submit" className="bg-primary text-primary-foreground" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : (editing ? 'Update Demo' : 'Simpan Demo')}
            </Button>
          </form>
        </CardContent></Card>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(d => (
          <Card key={d.id}>
            <div className="aspect-video bg-muted overflow-hidden"><img src={d.thumbnail} alt={d.name} className="w-full h-full object-cover" /></div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{d.name}</h3>
                  <div className="text-xs text-muted-foreground">{d.category}</div>
                  <div className="text-primary font-bold mt-1">{formatRupiah(d.price)}</div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditing(d)
                      setForm({
                        name: d.name || '',
                        categorySlug: d.categorySlug || '',
                        description: d.description || '',
                        price: d.price || 0,
                        thumbnail: d.thumbnail || '',
                        demoUrl: d.demoUrl || ''
                      })
                      setOpen(true)
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => del(d.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ArticleManager({ token }) {
  const [list, setList] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Website', thumbnail: '', excerpt: '', content: '' })
  const load = () => api('articles').then(setList)
  const [editing, setEditing] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const delArticle = async (id) => {
    if (!confirm('Hapus artikel ini?')) return
    await api(`23_webku_8articles/${id}`, { method: 'DELETE', headers: { 'x-admin-pass': token } })
    toast.success('Artikel dihapus')
    load()
  }
  useEffect(() => { load() }, [])
  
  const save = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await api('23_webku_8articles', { method: 'POST', headers: { 'x-admin-pass': token }, body: JSON.stringify(form) })
      toast.success('Artikel ditambahkan'); setOpen(false); setForm({ title: '', category: 'Website', thumbnail: '', excerpt: '', content: '' }); load()
    } catch (e) { toast.error(e.message) }
    finally { setIsSubmitting(false) }
  }
  
  const updateArticle = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await api(`23_webku_8articles/${editing.id}`, { method: 'PATCH', headers: { 'x-admin-pass': token }, body: JSON.stringify(form) })
      toast.success('Artikel diperbarui')
      setEditing(null)
      setForm({ title: '', category: 'Website', thumbnail: '', excerpt: '', content: '' })
      setOpen(false)
      load()
    } catch (e) { toast.error(e.message) }
    finally { setIsSubmitting(false) }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Artikel ({list.length})</h2>
        <Button onClick={() => { setEditing(null); setForm({ title: '', category: 'Website', thumbnail: '', excerpt: '', content: '' }); setOpen(!open) }}>
          <Plus className="w-4 h-4 mr-1" />
          Tambah Artikel
        </Button>
      </div>
      {open && <Card><CardContent className="p-5">
        <form onSubmit={editing ? updateArticle : save} className="space-y-3">
          <div><Label>Judul</Label><Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label>Kategori</Label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
            <div><Label>Thumbnail URL</Label><Input value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} /></div>
          </div>
          <div><Label>Ringkasan</Label><Input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} /></div>
          <div><Label>Konten</Label><Textarea rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
          <Button type="submit" className="bg-primary text-primary-foreground" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : (editing ? 'Update Artikel' : 'Simpan Artikel')}
          </Button>
        </form>
      </CardContent></Card>}
      <div className="grid md:grid-cols-2 gap-4">
        {list.map(a => (
          <Card key={a.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Badge variant="outline" className="text-xs mb-2">{a.category}</Badge>
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{a.excerpt}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(a); setForm({ title: a.title, category: a.category, thumbnail: a.thumbnail, excerpt: a.excerpt, content: a.content }); setOpen(true) }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => delArticle(a.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PackagesManager({ token }) {
  const [list, setList] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', price: 1499000, popular: false, features: [] })
  const [featuresInput, setFeaturesInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const load = () => api('packages').then(setList)
  useEffect(() => { load() }, [token])

  const save = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      if (editing) {
        await api(`23_webku_8packages/${editing.id}`, { method: 'PATCH', headers: { 'x-admin-pass': token }, body: JSON.stringify(form) })
        toast.success('Paket diperbarui')
      } else {
        await api('23_webku_8packages', { method: 'POST', headers: { 'x-admin-pass': token }, body: JSON.stringify(form) })
        toast.success('Paket ditambahkan')
      }
      setOpen(false); resetForm(); load()
    } catch (e) { toast.error(e.message) }
    finally { setIsSubmitting(false) }
  }

  const del = async (id) => {
    if (!confirm('Hapus paket ini?')) return
    await api(`23_webku_8packages/${id}`, { method: 'DELETE', headers: { 'x-admin-pass': token } })
    toast.success('Dihapus'); load()
  }

  const resetForm = () => {
    setEditing(null)
    setForm({ name: '', price: 1499000, popular: false, features: [] })
    setFeaturesInput('')
  }

  const handleEdit = (pkg) => {
    setEditing(pkg)
    setForm({ name: pkg.name, price: pkg.price, popular: pkg.popular, features: pkg.features })
    setFeaturesInput(pkg.features.join(', '))
    setOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Paket Harga ({list.length})</h2>
        <Button onClick={() => { resetForm(); setOpen(!open) }}><Plus className="w-4 h-4 mr-1" />Tambah Paket</Button>
      </div>
      {open && (
        <Card><CardContent className="p-5">
          <form onSubmit={save} className="space-y-3">
            <div><Label>Nama Paket</Label><Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div><Label>Harga (Rp)</Label><Input type="number" value={form.price} onChange={e => setForm({...form, price: parseInt(e.target.value)})} /></div>
            <div className="flex items-center gap-2"><Label>Populer?</Label><input type="checkbox" checked={form.popular} onChange={e => setForm({...form, popular: e.target.checked})} className="w-4 h-4" /></div>
            <div><Label>Fitur (pisahkan dengan koma)</Label><Input value={featuresInput} onChange={e => { setFeaturesInput(e.target.value); setForm({...form, features: e.target.value.split(',').map(f => f.trim()) }) }} placeholder="Responsif, SEO Friendly, Support 24/7" /></div>
            <Button type="submit" className="bg-primary" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : (editing ? 'Update' : 'Simpan')}</Button>
          </form>
        </CardContent></Card>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(p => (
          <Card key={p.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div><h3 className="font-semibold">{p.name}</h3><div className="text-primary font-bold">{formatRupiah(p.price)}</div>{p.popular && <Badge className="bg-yellow-500 mt-1">Populer</Badge>}</div>
                <div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button><Button size="icon" variant="ghost" onClick={() => del(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div>
              </div>
              <ul className="text-xs text-muted-foreground mt-2 list-disc pl-4">{p.features.slice(0,3).map((f,i) => <li key={i}>{f}</li>)}</ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ServicesManager({ token }) {
  const [list, setList] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', desc: '', price: 299000, icon: 'Package' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const load = () => api('services').then(setList)
  useEffect(() => { load() }, [token])

  const save = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      if (editing) {
        await api(`23_webku_8services/${editing.id}`, { method: 'PATCH', headers: { 'x-admin-pass': token }, body: JSON.stringify(form) })
        toast.success('Layanan diperbarui')
      } else {
        await api('23_webku_8services', { method: 'POST', headers: { 'x-admin-pass': token }, body: JSON.stringify(form) })
        toast.success('Layanan ditambahkan')
      }
      setOpen(false); setEditing(null); setForm({ name: '', desc: '', price: 299000, icon: 'Package' }); load()
    } catch (e) { toast.error(e.message) }
    finally { setIsSubmitting(false) }
  }
  
  const del = async (id) => {
    if (!confirm('Hapus layanan ini?')) return
    await api(`23_webku_8services/${id}`, { method: 'DELETE', headers: { 'x-admin-pass': token } })
    toast.success('Dihapus'); load()
  }
  
  const iconOptions = ['Palette', 'Image', 'FileImage', 'FileText', 'BookOpen', 'Briefcase', 'Instagram', 'Package', 'CreditCard', 'Mail', 'MapPin']
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between"><h2 className="text-2xl font-bold">Layanan Lainnya ({list.length})</h2><Button onClick={() => { setEditing(null); setForm({ name: '', desc: '', price: 299000, icon: 'Package' }); setOpen(!open) }}><Plus className="w-4 h-4 mr-1" />Tambah Layanan</Button></div>
      {open && <Card><CardContent><form onSubmit={save} className="space-y-3"><div><Label>Nama Layanan</Label><Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div><div><Label>Deskripsi</Label><Input value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} /></div><div><Label>Harga</Label><Input type="number" value={form.price} onChange={e => setForm({...form, price: parseInt(e.target.value)})} /></div><div><Label>Icon</Label><Select value={form.icon} onValueChange={v => setForm({...form, icon: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{iconOptions.map(ic => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}</SelectContent></Select></div><Button type="submit" className="bg-primary" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : (editing ? 'Update' : 'Simpan')}</Button></form></CardContent></Card>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(s => (
          <Card key={s.id}><CardContent className="p-4"><div className="flex justify-between"><div><h3 className="font-semibold">{s.name}</h3><p className="text-xs text-muted-foreground">{s.desc}</p><div className="text-primary font-bold mt-1">{formatRupiah(s.price)}</div></div><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => { setEditing(s); setForm({ name: s.name, desc: s.desc, price: s.price, icon: s.icon }); setOpen(true) }}><Pencil className="w-4 h-4" /></Button><Button size="icon" variant="ghost" onClick={() => del(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></div></CardContent></Card>
        ))}
      </div>
    </div>
  )
}

function TestimonialsManager({ token }) {
  const [list, setList] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', business: '', photo: '', content: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const load = () => api('testimonials').then(setList)
  useEffect(() => { load() }, [token])

  const save = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      if (editing) {
        await api(`23_webku_8testimonials/${editing.id}`, { method: 'PATCH', headers: { 'x-admin-pass': token }, body: JSON.stringify(form) })
        toast.success('Testimoni diperbarui')
      } else {
        await api('23_webku_8testimonials', { method: 'POST', headers: { 'x-admin-pass': token }, body: JSON.stringify(form) })
        toast.success('Testimoni ditambahkan')
      }
      setOpen(false); setEditing(null); setForm({ name: '', business: '', photo: '', content: '' }); load()
    } catch (e) { toast.error(e.message) }
    finally { setIsSubmitting(false) }
  }
  
  const del = async (id) => {
    if (!confirm('Hapus testimoni ini?')) return
    await api(`23_webku_8testimonials/${id}`, { method: 'DELETE', headers: { 'x-admin-pass': token } })
    toast.success('Dihapus'); load()
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between"><h2 className="text-2xl font-bold">Testimoni ({list.length})</h2><Button onClick={() => { setEditing(null); setForm({ name: '', business: '', photo: '', content: '' }); setOpen(!open) }}><Plus className="w-4 h-4 mr-1" />Tambah Testimoni</Button></div>
      {open && <Card><CardContent><form onSubmit={save} className="space-y-3"><div><Label>Nama</Label><Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div><div><Label>Bisnis</Label><Input value={form.business} onChange={e => setForm({...form, business: e.target.value})} /></div><div><Label>Foto URL</Label><Input value={form.photo} onChange={e => setForm({...form, photo: e.target.value})} placeholder="https://..." /></div><div><Label>Testimoni</Label><Textarea rows={3} value={form.content} onChange={e => setForm({...form, content: e.target.value})} /></div><Button type="submit" className="bg-primary" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : (editing ? 'Update' : 'Simpan')}</Button></form></CardContent></Card>}
      <div className="grid md:grid-cols-2 gap-4">
        {list.map(t => (
          <Card key={t.id}><CardContent className="p-4"><div className="flex justify-between"><div><p className="italic text-sm">"{t.content.substring(0,100)}..."</p><div className="font-semibold mt-2">{t.name}</div><div className="text-xs text-muted-foreground">{t.business}</div></div><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => { setEditing(t); setForm({ name: t.name, business: t.business, photo: t.photo, content: t.content }); setOpen(true) }}><Pencil className="w-4 h-4" /></Button><Button size="icon" variant="ghost" onClick={() => del(t.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div></div></CardContent></Card>
        ))}
      </div>
    </div>
  )
}

export default function AdminApp() {
  const [token, setToken] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const t = typeof window !== 'undefined' && localStorage.getItem(PASS_KEY)
    if (t) setToken(t)
  }, [])

  if (!token) {
    return <Login onLogin={setToken} />
  }

  const logout = () => {
    localStorage.removeItem(PASS_KEY)
    setToken(null)
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', component: Dashboard },
    { id: 'inquiries', label: 'Inquiry', component: Inquiries },
    { id: 'demos', label: 'Demo Website', component: DemoManager },
    { id: 'articles', label: 'Artikel', component: ArticleManager },
    { id: 'packages', label: 'Paket', component: PackagesManager },
    { id: 'services', label: 'Layanan', component: ServicesManager },
    { id: 'testimonials', label: 'Testimoni', component: TestimonialsManager },
  ]

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || Dashboard

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">Webku Admin</span>
          </div>
          <Button variant="ghost" onClick={logout} className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 border-b mb-6">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              data-active={activeTab === tab.id}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="py-4">
          <ActiveComponent token={token} />
        </div>
      </div>
    </div>
  )
}