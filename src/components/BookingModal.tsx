import { useState } from 'react';
import { X, Calendar as CalendarIcon, MapPin, Sparkles, Clock, User } from 'lucide-react';
import { TREATMENTS } from '../data';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [branch, setBranch] = useState('');
  const [treatment, setTreatment] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  if (!isOpen) return null;

  const timeSlots = ['10:00', '11:15', '13:30', '14:45', '16:00'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm">
      <div className="bg-cream w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="relative p-6 border-b border-gold/20 flex items-center justify-between bg-white">
          <h2 className="font-serif text-2xl text-charcoal">Reservasi Online</h2>
          <button 
            onClick={onClose}
            className="p-2 text-charcoal/50 hover:text-charcoal transition-colors rounded-full hover:bg-nude"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          
          {/* Step 1: Branch */}
          <div className={`mb-8 ${step > 1 ? 'opacity-50' : ''}`}>
            <h3 className="text-sm font-semibold tracking-wider text-gold uppercase mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Step 1: Pilih Cabang
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Jakarta Selatan (Senopati)', 'BSD Tangerang'].map(loc => (
                <button
                  key={loc}
                  onClick={() => { setBranch(loc); setStep(Math.max(step, 2)); }}
                  className={`p-4 text-left border rounded-sm transition-all ${
                    branch === loc 
                      ? 'border-gold bg-gold/5 ring-1 ring-gold' 
                      : 'border-nude hover:border-gold bg-white'
                  }`}
                >
                  <span className="block font-medium text-charcoal">{loc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Treatment & Date */}
          <div className={`mb-8 ${step < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-sm font-semibold tracking-wider text-gold uppercase mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Step 2: Pilih Perawatan & Tanggal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select 
                value={treatment}
                onChange={(e) => { setTreatment(e.target.value); if(date) setStep(Math.max(step, 3)); }}
                className="w-full p-3 border border-nude bg-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold rounded-sm appearance-none"
              >
                <option value="">Pilih Treatment...</option>
                {TREATMENTS.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/50" />
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => { setDate(e.target.value); if(treatment) setStep(Math.max(step, 3)); }}
                  className="w-full pl-10 p-3 border border-nude bg-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold rounded-sm"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Time Slot */}
          <div className={`mb-8 ${step < 3 ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-sm font-semibold tracking-wider text-gold uppercase mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Step 3: Pilih Jam
            </h3>
            <p className="text-xs text-charcoal/60 mb-3">*Sistem otomatis menambahkan buffer 15 menit untuk sterilisasi ruangan.</p>
            <div className="flex flex-wrap gap-3">
              {timeSlots.map((t, i) => {
                const isFull = i === 3; // Simulating a booked slot
                return (
                  <button
                    key={t}
                    disabled={isFull}
                    onClick={() => { setTime(t); setStep(4); }}
                    className={`px-4 py-2 text-sm border rounded-sm transition-all ${
                      isFull 
                        ? 'bg-nude/50 border-nude/50 text-charcoal/30 cursor-not-allowed' 
                        : time === t
                          ? 'bg-gold text-white border-gold'
                          : 'bg-white border-nude hover:border-gold text-charcoal'
                    }`}
                  >
                    {t} {isFull && '(Full)'}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 4: Client Info */}
          <div className={`${step < 4 ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-sm font-semibold tracking-wider text-gold uppercase mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Step 4: Data Klien
            </h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Nama Lengkap" 
                className="w-full p-3 border border-nude bg-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold rounded-sm"
              />
              <input 
                type="tel" 
                placeholder="No. WhatsApp (Untuk terima E-Ticket)" 
                className="w-full p-3 border border-nude bg-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold rounded-sm"
              />
              <textarea 
                placeholder="Catatan Khusus (Opsional)" 
                rows={2}
                className="w-full p-3 border border-nude bg-white text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold rounded-sm resize-none"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-charcoal/70 bg-nude/50 px-3 py-2 rounded-sm border border-nude flex-1">
            <span className="font-semibold text-gold">Informasi:</span> Pembayaran dilakukan langsung di Klinik (Tanpa DP).
          </div>
          <button 
            disabled={step < 4}
            className="w-full sm:w-auto px-8 py-3 bg-gold text-white font-medium text-sm tracking-wide rounded-sm hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            KONFIRMASI RESERVASI SEKARANG
          </button>
        </div>

      </div>
    </div>
  );
}
