import { MapPin, ArrowRight } from 'lucide-react';

export default function Branches() {
  return (
    <section className="py-12 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branch 1 */}
          <div className="bg-white border border-nude p-6 rounded-sm flex items-center justify-between group hover:border-gold/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-nude/50 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-1 group-hover:text-gold transition-colors">Aura Beauty - Jakarta Selatan</h3>
                <p className="text-sm text-charcoal/70">Jl. Senopati No. XX, Kebayoran Baru</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gold group-hover:text-gold-light transition-colors">
              Lihat Detail
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Branch 2 */}
          <div className="bg-white border border-nude p-6 rounded-sm flex items-center justify-between group hover:border-gold/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-nude/50 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-1 group-hover:text-gold transition-colors">Aura Beauty - BSD Tangerang</h3>
                <p className="text-sm text-charcoal/70">Ruko Foresta Business Loft</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gold group-hover:text-gold-light transition-colors">
              Lihat Detail
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
