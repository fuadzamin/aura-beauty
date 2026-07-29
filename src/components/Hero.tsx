import { MapPin, Sparkles, ChevronRight } from 'lucide-react';

interface HeroProps {
  onBookClick: () => void;
}

export default function Hero({ onBookClick }: HeroProps) {
  return (
    <section id="home" className="relative pt-20 pb-24 md:pt-32 md:pb-32 overflow-hidden">
      {/* Background Image / Placeholder for AI video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cream/90 via-cream/70 to-cream/30 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Aesthetic Clinic"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm border border-gold/30 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-medium tracking-wide text-charcoal">Premium Aesthetic & Dermatological Center</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight mb-6">
            Pancarkan Aura Cantik Alami, Raih Kulit Impian Anda.
          </h1>
          
          <p className="text-charcoal/80 text-base md:text-lg mb-10 max-w-xl text-balance">
            Perawatan estetika medis modern berbasis teknologi FDA-approved yang disesuaikan khusus untuk kesehatan kulit Anda.
          </p>

          {/* Quick Action Box */}
          <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-lg border border-gold/20 shadow-xl max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <label className="block text-[11px] font-semibold tracking-wider text-charcoal/60 uppercase mb-1.5">Pilih Cabang</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/50" />
                  <select className="w-full pl-9 pr-8 py-2.5 bg-white border border-nude rounded-sm text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold appearance-none">
                    <option value="">Pilih Lokasi</option>
                    <option value="jaksel">Jakarta Selatan</option>
                    <option value="bsd">BSD Tangerang</option>
                  </select>
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-[11px] font-semibold tracking-wider text-charcoal/60 uppercase mb-1.5">Pilih Layanan</label>
                <div className="relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/50" />
                  <select className="w-full pl-9 pr-8 py-2.5 bg-white border border-nude rounded-sm text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold appearance-none">
                    <option value="">Semua Perawatan</option>
                    <option value="pico">Glow Pico Laser</option>
                    <option value="facial">Crystal Clear Facial</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onBookClick}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gold text-white text-sm font-medium tracking-wide hover:bg-gold-light transition-colors rounded-sm shadow-md"
            >
              Cek Jadwal Tersedia
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
