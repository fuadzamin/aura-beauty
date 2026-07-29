export default function Footer() {
  return (
    <footer className="bg-emerald border-t border-gold/20 pt-16 pb-8 text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-serif text-2xl mb-4">Aura Beauty</h3>
            <p className="text-cream/70 text-sm max-w-sm mb-6 leading-relaxed">
              Klinik estetika terkemuka yang memadukan teknologi medis modern dengan sentuhan perawatan holistik. Pancarkan aura sejati Anda bersama kami.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold transition-colors cursor-pointer text-sm">IG</div>
              <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold transition-colors cursor-pointer text-sm">FB</div>
              <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold transition-colors cursor-pointer text-sm">TT</div>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold tracking-wider uppercase mb-4 text-gold">Layanan Kami</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-cream/70 hover:text-white transition-colors">Semua Perawatan</a></li>
              <li><a href="#" className="text-sm text-cream/70 hover:text-white transition-colors">Toko Skincare Medis</a></li>
              <li><a href="#" className="text-sm text-cream/70 hover:text-white transition-colors">Galeri Before & After</a></li>
              <li><a href="#" className="text-sm text-cream/70 hover:text-white transition-colors">Konsultasi Dokter</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-sm font-semibold tracking-wider uppercase mb-4 text-gold">Dukungan</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-cream/70 hover:text-white transition-colors">Hubungi Kami (WhatsApp)</a></li>
              <li><a href="#" className="text-sm text-cream/70 hover:text-white transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-sm text-cream/70 hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="text-sm text-cream/70 hover:text-white transition-colors">FAQ Booking</a></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/50">
            &copy; {new Date().getFullYear()} Aura Beauty Aesthetic Clinic. All rights reserved.
          </p>
          <p className="text-xs text-cream/50">
            Designed for Elegance.
          </p>
        </div>
      </div>
    </footer>
  );
}
