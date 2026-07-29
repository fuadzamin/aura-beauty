import { X, Droplet, Sparkles, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  const defaultPrice = product.variants?.[0]?.price ?? product.price ?? 0;
  const defaultSize = product.variants?.[0]?.size ?? product.size ?? '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal/80 backdrop-blur-sm">
      <div className="bg-cream w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header (Mobile sticky close) */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="p-2 text-charcoal/50 hover:text-charcoal bg-white/80 backdrop-blur-md rounded-full shadow-sm transition-colors hover:bg-nude"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-y-auto">
          {/* Image Side */}
          <div className="w-full md:w-2/5 bg-white p-8 md:p-12 flex items-center justify-center shrink-0 border-r border-gold/10">
            <div className="aspect-square w-full relative">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Details Side */}
          <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col">
            <span className="text-xs font-semibold tracking-wider text-gold uppercase mb-2">{product.category}</span>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-2">{product.name}</h2>
            <p className="text-sm text-charcoal/50 mb-6">{defaultSize} | Formulasi Dokter Medis</p>
            
            <div className="text-2xl text-gold font-medium mb-6">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(defaultPrice)}
            </div>

            {/* Variants choice if available */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-semibold tracking-wider text-charcoal/60 uppercase mb-2">Pilih Ukuran / Varian</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <div key={idx} className="px-4 py-2 border border-gold/30 rounded-md bg-white text-xs text-charcoal font-medium flex items-center gap-3">
                      <span>{v.size}</span>
                      <span className="text-gold font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v.price)}</span>
                      <span className="text-[10px] text-gray-400">(Stok: {v.stock})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Copywriting */}
            <div className="space-y-6 flex-grow">
              <div>
                <p className="text-charcoal/80 leading-relaxed text-sm md:text-base">
                  {product.description || 'Skincare medis teruji klinis untuk hasil maksimal pada kesehatan kulit wajah Anda.'}
                </p>
              </div>

              <div className="border-t border-gold/20 pt-6">
                <h4 className="font-serif text-lg text-charcoal mb-4">Key Ingredients</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-sm text-charcoal/80"><strong>15% Pure L-Ascorbic Acid:</strong> Konsentrasi stabil untuk mencerahkan noda hitam secara efektif.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Droplet className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-sm text-charcoal/80"><strong>Ferulic Acid & Vitamin E:</strong> Pengganda kinerja antioksidan untuk pelindung dari polusi dan sinar UV.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-sm text-charcoal/80"><strong>Hyaluronic Acid:</strong> Mengunci hidrasi di lapisan kulit terdalam agar tetap <em>plump</em> dan awet muda.</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-gold/20 pt-6">
                <h4 className="font-serif text-lg text-charcoal mb-3">Ritual Penggunaan</h4>
                <p className="text-sm text-charcoal/70 leading-relaxed">
                  Gunakan pada pagi hari setelah membersihkan wajah. Teteskan 3-4 tetes pada telapak tangan, lalu tepuk lembut pada wajah dan leher hingga meresap sempurna. Lanjutkan dengan pelembap dan tabir surya.
                </p>
              </div>
            </div>

            {/* Sticky Action Footer for scroll */}
            <div className="mt-8 pt-6 border-t border-gold/20 flex flex-col sm:flex-row gap-3">
              <button className="flex-1 py-3.5 border border-gold text-gold font-medium text-sm tracking-wide hover:bg-gold hover:text-white transition-colors rounded-sm flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Tambah ke Keranjang
              </button>
              <button className="flex-1 py-3.5 bg-gold text-white font-medium text-sm tracking-wide hover:bg-gold-light transition-colors rounded-sm shadow-md">
                Beli & Pickup (1 Jam)
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
