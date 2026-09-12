'use client'
import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { api, waLink } from '@/lib/api'
import { Send } from 'lucide-react'

export function InquiryForm({ whatsapp, prefilled, onSent, services = [], packages = [] }) {
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