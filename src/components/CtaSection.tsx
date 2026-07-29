import { Calendar, MessageSquare, Sparkles, ShieldCheck, Clock } from 'lucide-react';

interface CtaSectionProps {
  onBookClick: () => void;
}

export default function CtaSection({ onBookClick }: CtaSectionProps) {
  return (
    <section className="relative py-24 bg-emerald text-cream overflow-hidden">
      {/* Background Decorative Pattern & Gradient Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gold blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gold blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-light/80 border border-gold/30 rounded-sm p-8 md:p-16 shadow-2xl backdrop-blur-md relative overflow-hidden">
          
          {/* Top Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald/90 border border-gold/40 rounded-full">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-xs font-semibold tracking-widest text-gold uppercase">
                Aura VIP Experience
              </span>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="font-serif text-3xl md:text-5xl text-cream leading-tight mb-6">
              Siap Memancarkan Kilau Sejati & Kesehatan Kulit Anda?
            </h2>
            <p className="text-cream/80 text-base md:text-lg leading-relaxed text-balance">
              Lakukan reservasi online secara praktis tanpa down payment, atau hubungi Beauty Advisor kami untuk konsultasi awal gratis.
            </p>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10 py-6 border-y border-gold/20">
            <div className="flex items-center justify-center gap-3 text-center sm:text-left">
              <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
              <span className="text-xs md:text-sm font-medium text-cream/90">
                Dokter Spesialis Sp.D.V.E
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-center sm:text-left">
              <Clock className="w-5 h-5 text-gold shrink-0" />
              <span className="text-xs md:text-sm font-medium text-cream/90">
                Jadwal Real-Time + Buffer Sterilisasi
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-center sm:text-left">
              <Calendar className="w-5 h-5 text-gold shrink-0" />
              <span className="text-xs md:text-sm font-medium text-cream/90">
                Reservasi Tanpa DP (Bayar di Klinik)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={onBookClick}
              className="w-full sm:w-auto px-8 py-4 bg-gold text-white font-medium text-sm tracking-wide rounded-sm hover:bg-gold-light transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              <Calendar className="w-4 h-4" />
              <span>Booking Sekarang</span>
            </button>

            <a
              href="https://wa.me/6281234567890?text=Halo%20Aura%20Beauty%20Clinic,%20saya%20ingin%20konsultasi%20mengenai%20perawatan%20kulit."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-cream/10 border border-cream/30 text-cream font-medium text-sm tracking-wide rounded-sm hover:bg-cream hover:text-charcoal transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-gold" />
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
