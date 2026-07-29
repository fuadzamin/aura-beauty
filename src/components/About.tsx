import { Award, ShieldCheck, Heart } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-nude/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/5] overflow-hidden rounded-sm bg-nude">
              <img 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000" 
                alt="Aura Beauty Clinic Interior" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-emerald p-6 flex flex-col justify-center items-center text-center hidden md:flex rounded-sm">
              <span className="font-serif text-4xl text-gold mb-2">10+</span>
              <span className="text-xs text-cream uppercase tracking-wider font-semibold">Tahun<br/>Pengalaman<br/>Estetika</span>
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full lg:w-1/2">
            <span className="text-xs font-bold tracking-widest text-gold uppercase mb-2 block">THE STORY OF AURA</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal leading-tight mb-6">
              Harmoni Sempurna Antara Sains Medis &amp; Kecantikan Alami
            </h2>
            
            <div className="space-y-6 text-charcoal/80 text-base md:text-lg leading-relaxed mb-10 text-balance">
              <p>
                Didirikan dengan visi untuk mendefinisikan ulang standar perawatan estetika di Indonesia, <strong>Aura Beauty Clinic</strong> hadir memberikan pengalaman eksklusif yang berfokus pada hasil nyata dan kenyamanan paripurna.
              </p>
              <p>
                Kami percaya bahwa setiap individu memiliki kilau alaminya sendiri. Tugas kami bukanlah untuk mengubah, melainkan menyingkap dan memancarkan versi terbaik dari diri Anda melalui teknologi dermatologi mutakhir dan protokol medis yang ketat.
              </p>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h5 className="font-serif text-lg text-charcoal">Teknologi Medis</h5>
                <p className="text-sm text-charcoal/60 leading-relaxed">Peralatan tersertifikasi FDA-Approved untuk keamanan terjamin.</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <Award className="w-5 h-5" />
                </div>
                <h5 className="font-serif text-lg text-charcoal">Dokter Tersertifikasi</h5>
                <p className="text-sm text-charcoal/60 leading-relaxed">Ditangani langsung oleh Sp.D.V.E (Spesialis Dermatologi).</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <Heart className="w-5 h-5" />
                </div>
                <h5 className="font-serif text-lg text-charcoal">White-Glove Service</h5>
                <p className="text-sm text-charcoal/60 leading-relaxed">Pelayanan VIP eksklusif dari Anda datang hingga selesai.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
