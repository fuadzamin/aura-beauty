import { useState } from 'react';
import { PRODUCTS } from '../data';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import ProductDetailModal from './ProductDetailModal';

export default function Skincare() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section id="shop" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-bold tracking-widest text-gold uppercase mb-2 block">
            SHOP CATALOG
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight">
            Katalog Produk Skincare
          </h2>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-3xl overflow-hidden border border-nude/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer group"
            >
              {/* Product Image Box */}
              <div className="m-3 aspect-[4/3] rounded-2xl overflow-hidden bg-nude relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Product Info */}
              <div className="p-6 pt-2 flex flex-col flex-grow justify-between">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-gold uppercase mb-1.5 block">
                    {product.category}
                  </span>
                  <h3 className="font-serif font-bold text-lg md:text-xl text-charcoal leading-snug mb-6 group-hover:text-gold transition-colors">
                    {product.name}
                  </h3>
                </div>

                {/* Price & Variants Rows */}
                <div className="space-y-2 mt-auto">
                  {product.variants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="bg-cream rounded-xl px-4 py-3 flex items-center justify-between border border-nude/40"
                    >
                      <div>
                        <div className="font-bold text-sm text-charcoal leading-none mb-0.5">
                          {variant.size}
                        </div>
                        <div className="text-[11px] font-medium text-soft-gray">
                          Stok: {variant.stock}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm md:text-base text-gold">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 0
                          }).format(variant.price)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                          }}
                          className="w-8 h-8 rounded-full bg-charcoal hover:bg-gold text-white flex items-center justify-center font-bold shadow-sm transition-colors active:scale-95"
                          aria-label={`Tambah ${product.name} varian ${variant.size}`}
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
