import { ShoppingBag, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onBookClick: () => void;
  onAdminClick?: () => void;
}

export default function Navbar({ onBookClick, onAdminClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-cream/90 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 flex items-center justify-center">
            {/* Simple logo representation for now */}
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-gold" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 22h20L12 2z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl leading-none text-charcoal tracking-wide">AURA BEAUTY</span>
            <span className="font-sans text-[10px] tracking-[0.2em] text-charcoal/70 uppercase">Aesthetic Clinic</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-sm font-medium text-charcoal/80 hover:text-gold transition-colors">Home</a>
          <a href="#about" className="text-sm font-medium text-charcoal/80 hover:text-gold transition-colors">Tentang Kami</a>
          <a href="#treatments" className="text-sm font-medium text-charcoal/80 hover:text-gold transition-colors">Treatment</a>
          <a href="#shop" className="text-sm font-medium text-charcoal/80 hover:text-gold transition-colors">Skincare</a>
          <a href="#gallery" className="text-sm font-medium text-charcoal/80 hover:text-gold transition-colors">Galeri</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {onAdminClick && (
            <button 
              onClick={onAdminClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gold/40 text-gold hover:bg-gold hover:text-white text-xs font-semibold rounded-sm transition-all shadow-xs"
              title="Akses Dashboard Admin"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          <button className="relative p-2 text-charcoal hover:text-gold transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-white text-[10px] font-bold flex items-center justify-center rounded-full">0</span>
          </button>

          <button 
            onClick={onBookClick}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 bg-gold text-white font-medium text-sm tracking-wide hover:bg-gold-light transition-all rounded-sm shadow-sm"
          >
            Reservasi Perawatan
          </button>
        </div>
      </div>
    </header>
  );
}
