import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Printer, 
  CheckCircle2, 
  User, 
  Sparkles, 
  Package, 
  Building2, 
  Receipt,
  X,
  Clock,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Booking, Treatment, Product, ProductPurchase, PurchaseItem } from '../types';

interface POSTreatmentCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface POSProductCartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  maxStock: number;
}

interface POSViewProps {
  bookings: Booking[];
  treatments: Treatment[];
  products: Product[];
  onCompletePayment: (
    purchaseData: ProductPurchase,
    bookingIdToComplete?: string,
    productsToDeduct?: { productId: string; size: string; quantity: number }[]
  ) => void;
  selectedBookingFromParent?: Booking | null;
}

export default function POSView({
  bookings,
  treatments,
  products,
  onCompletePayment,
  selectedBookingFromParent
}: POSViewProps) {
  // Selected Customer / Booking context
  const [selectedBookingId, setSelectedBookingId] = useState<string>('walk-in');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [branch, setBranch] = useState('Surabaya Town Square');
  const [doctor, setDoctor] = useState('dr. Maya Indah, Sp.DVE');

  // POS Cart
  const [cartTreatments, setCartTreatments] = useState<POSTreatmentCartItem[]>([]);
  const [cartProducts, setCartProducts] = useState<POSProductCartItem[]>([]);

  // Payment settings
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Kartu Kredit/Debit' | 'Transfer Bank' | 'Tunai di Klinik'>('QRIS');
  const [cashGiven, setCashGiven] = useState<number>(0);

  // Search & Filters
  const [bookingSearch, setBookingSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('All');
  const [treatmentSearch, setTreatmentSearch] = useState('');

  // Receipt Modal State
  const [completedReceipt, setCompletedReceipt] = useState<ProductPurchase | null>(null);

  // Load parent booking if passed
  useEffect(() => {
    if (selectedBookingFromParent) {
      handleSelectBooking(selectedBookingFromParent);
    }
  }, [selectedBookingFromParent]);

  // Handle selecting a booking to process in POS
  const handleSelectBooking = (booking: Booking) => {
    setSelectedBookingId(booking.id);
    setCustomerName(booking.clientName);
    setCustomerPhone(booking.clientPhone);
    setBranch(booking.branch);
    setDoctor(booking.doctor);

    // Find treatment price
    const matchedTreatment = treatments.find(t => t.name === booking.treatmentName);
    const estimatedPrice = booking.totalAmount || 1500000;

    setCartTreatments([
      {
        id: matchedTreatment?.id || 't-custom',
        name: booking.treatmentName,
        price: estimatedPrice,
        quantity: 1
      }
    ]);
  };

  // Reset to Walk-in
  const handleSelectWalkIn = () => {
    setSelectedBookingId('walk-in');
    setCustomerName('Pasien Walk-in');
    setCustomerPhone('');
    setCartTreatments([]);
    setCartProducts([]);
  };

  // Add Treatment to Cart
  const handleAddTreatmentToCart = (treatment: Treatment, estimatedPrice: number = 1500000) => {
    setCartTreatments(prev => {
      const existing = prev.find(item => item.name === treatment.name);
      if (existing) {
        return prev.map(item => item.name === treatment.name ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: treatment.id, name: treatment.name, price: estimatedPrice, quantity: 1 }];
    });
  };

  // Add Product to Cart
  const handleAddProductToCart = (product: Product, variantSize: string, price: number, stock: number) => {
    if (stock <= 0) {
      alert('Stok produk habis!');
      return;
    }

    setCartProducts(prev => {
      const key = `${product.id}-${variantSize}`;
      const existing = prev.find(p => `${p.id}-${p.size}` === key);
      if (existing) {
        if (existing.quantity >= stock) {
          alert(`Jumlah melebihi sisa stok (${stock} unit)!`);
          return prev;
        }
        return prev.map(p => `${p.id}-${p.size}` === key ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          size: variantSize,
          price,
          quantity: 1,
          maxStock: stock
        }
      ];
    });
  };

  // Modify Treatment quantity
  const handleUpdateTreatmentQty = (index: number, delta: number) => {
    setCartTreatments(prev => {
      return prev.map((item, i) => {
        if (i === index) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as POSTreatmentCartItem[];
    });
  };

  // Modify Product quantity
  const handleUpdateProductQty = (index: number, delta: number) => {
    setCartProducts(prev => {
      return prev.map((item, i) => {
        if (i === index) {
          const newQty = item.quantity + delta;
          if (newQty > item.maxStock) {
            alert(`Maksimal stok tersedia adalah ${item.maxStock} unit.`);
            return item;
          }
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as POSProductCartItem[];
    });
  };

  // Calculations
  const treatmentsSubtotal = cartTreatments.reduce((sum, t) => sum + (t.price * t.quantity), 0);
  const productsSubtotal = cartProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const rawSubtotal = treatmentsSubtotal + productsSubtotal;
  const grandTotal = Math.max(0, rawSubtotal - discountAmount);
  const changeAmount = paymentMethod === 'Tunai di Klinik' ? Math.max(0, cashGiven - grandTotal) : 0;

  // Process POS Transaction
  const handleCheckout = () => {
    if (!customerName.trim()) {
      alert('Mohon isi nama pasien / pelanggan.');
      return;
    }

    if (cartTreatments.length === 0 && cartProducts.length === 0) {
      alert('Keranjang POS masih kosong! Silakan pilih Perawatan atau Produk Skincare.');
      return;
    }

    if (paymentMethod === 'Tunai di Klinik' && cashGiven < grandTotal) {
      alert(`Jumlah uang tunai (Rp ${cashGiven.toLocaleString('id-ID')}) kurang dari total tagihan (Rp ${grandTotal.toLocaleString('id-ID')}).`);
      return;
    }

    const posReceiptId = `POS-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Construct purchase items array
    const allPurchaseItems: PurchaseItem[] = [
      ...cartTreatments.map(t => ({
        productName: `[Layanan] ${t.name}`,
        size: '1 Sesi',
        quantity: t.quantity,
        pricePerUnit: t.price,
        type: 'Treatment' as const
      })),
      ...cartProducts.map(p => ({
        productName: p.name,
        size: p.size,
        quantity: p.quantity,
        pricePerUnit: p.price,
        type: 'Product' as const
      }))
    ];

    const newPurchaseRecord: ProductPurchase = {
      id: posReceiptId,
      customerName,
      customerPhone: customerPhone || '-',
      items: allPurchaseItems,
      totalAmount: grandTotal,
      date: nowStr,
      paymentMethod,
      status: 'Lunas',
      branch,
      doctor,
      discountAmount,
      cashAmount: paymentMethod === 'Tunai di Klinik' ? cashGiven : undefined,
      changeAmount: paymentMethod === 'Tunai di Klinik' ? changeAmount : undefined
    };

    // Construct deduction list for products
    const deductions = cartProducts.map(p => ({
      productId: p.id,
      size: p.size,
      quantity: p.quantity
    }));

    // Trigger parent state updates
    onCompletePayment(
      newPurchaseRecord,
      selectedBookingId !== 'walk-in' ? selectedBookingId : undefined,
      deductions
    );

    // Show receipt modal
    setCompletedReceipt(newPurchaseRecord);
  };

  // Reset cart after receipt modal close
  const handleResetPOS = () => {
    setCompletedReceipt(null);
    setSelectedBookingId('walk-in');
    setCustomerName('Pasien Walk-in');
    setCustomerPhone('');
    setCartTreatments([]);
    setCartProducts([]);
    setDiscountAmount(0);
    setCashGiven(0);
  };

  // Filter products for adding
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedProductCategory === 'All' || p.category === selectedProductCategory;
    return matchesSearch && matchesCat;
  });

  const activeBookings = bookings.filter(b => b.status === 'Terkonfirmasi' || b.status === 'Pending');

  const filteredBookings = activeBookings.filter(b =>
    b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.clientName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.treatmentName.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  const filteredTreatments = treatments.filter(t =>
    t.name.toLowerCase().includes(treatmentSearch.toLowerCase()) ||
    t.category.toLowerCase().includes(treatmentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER POS */}
      <div className="bg-white p-3.5 rounded-xs border border-gold/15 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white bg-gold px-2 py-0.5 rounded-xs uppercase tracking-wider">Kasir &amp; POS Terpadu</span>
            <span className="text-xs text-soft-gray">Sistem Pembayaran Treatment + Skincare Add-On</span>
          </div>
          <h1 className="font-serif text-xl text-charcoal mt-0.5">Point of Sale (POS) Kasir</h1>
        </div>

        {/* Branch & Doctor Indicator */}
        <div className="flex items-center gap-3 text-xs bg-cream/30 p-2 rounded-xs border border-gold/10">
          <div className="flex items-center gap-1.5 text-charcoal font-medium">
            <Building2 className="w-3.5 h-3.5 text-gold" />
            <span>{branch}</span>
          </div>
          <span className="text-gold/40">|</span>
          <div className="flex items-center gap-1.5 text-soft-gray">
            <User className="w-3.5 h-3.5 text-gold" />
            <span>{doctor}</span>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN POS INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: 1. PEMILIHAN RESERVASI & ADD-ON KATALOG (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* SECTION 1: PEMILIHAN RESERVASI PASIEN */}
          <div className="bg-white p-3.5 rounded-xs border border-gold/15 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/10 pb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                <h2 className="font-serif text-sm font-semibold text-charcoal">1. Pilih Reservasi Pasien ({activeBookings.length})</h2>
              </div>
              <button 
                onClick={handleSelectWalkIn}
                className={`text-[11px] px-2.5 py-0.5 rounded-xs border transition-colors ${
                  selectedBookingId === 'walk-in' 
                    ? 'bg-gold text-white border-gold font-medium shadow-xs' 
                    : 'border-gold/30 text-soft-gray hover:text-charcoal hover:border-gold'
                }`}
              >
                + Pasien Walk-in (Non-Booking)
              </button>
            </div>

            {/* Search Bar Reservasi */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-soft-gray" />
              <input 
                type="text" 
                placeholder="Cari nama pasien, no. booking, atau perawatan..."
                value={bookingSearch}
                onChange={e => setBookingSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
              />
            </div>

            {filteredBookings.length > 0 ? (
              <div className="space-y-1 text-xs max-h-36 overflow-y-auto pr-1">
                <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-soft-gray uppercase px-2.5 py-1 bg-cream/40 rounded-xs border border-gold/10">
                  <span className="col-span-3">No. Booking</span>
                  <span className="col-span-4">Pasien &amp; Perawatan</span>
                  <span className="col-span-3">Jam &amp; Nominal</span>
                  <span className="col-span-2 text-right">Pilih</span>
                </div>

                {filteredBookings.map(b => {
                  const isSelected = selectedBookingId === b.id;

                  return (
                    <div 
                      key={b.id}
                      onClick={() => handleSelectBooking(b)}
                      className={`
                        grid grid-cols-12 gap-2 items-center px-2.5 py-1.5 rounded-xs border cursor-pointer transition-all text-xs
                        ${isSelected 
                          ? 'bg-gold/10 border-gold shadow-xs' 
                          : 'bg-white border-gold/15 hover:border-gold/40 hover:bg-cream/20'
                        }
                      `}
                    >
                      <div className="col-span-3 min-w-0">
                        <span className="font-bold text-gold font-mono text-[11px] truncate block">{b.id}</span>
                        <div className="text-[9px] text-emerald-700 font-medium">{b.status}</div>
                      </div>

                      <div className="col-span-4 min-w-0">
                        <div className="font-semibold text-charcoal text-[11px] truncate">{b.clientName}</div>
                        <div className="text-[10px] text-soft-gray truncate">{b.treatmentName}</div>
                      </div>

                      <div className="col-span-3">
                        <div className="text-soft-gray text-[10px]">{b.time}</div>
                        <div className="font-bold text-charcoal text-[11px]">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(b.totalAmount || 1500000)}
                        </div>
                      </div>

                      <div className="col-span-2 text-right">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-xs ${
                          isSelected ? 'bg-gold text-white' : 'bg-cream text-gold border border-gold/30'
                        }`}>
                          {isSelected ? 'Terpilih' : 'Pilih'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-soft-gray italic py-1 text-center">
                {bookingSearch ? 'Tidak ada reservasi yang cocok dengan pencarian.' : 'Tidak ada reservasi pending saat ini.'}
              </p>
            )}
          </div>

          {/* SECTION 2: ADD TREATMENT / PERAWATAN */}
          <div className="bg-white rounded-xs border border-gold/15 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-gold/10 pb-2">
              <h2 className="font-serif text-sm font-semibold text-charcoal flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>2. Katalog Layanan Perawatan Medis</span>
              </h2>
              <span className="text-[11px] text-soft-gray">
                {cartTreatments.length} Layanan dipilih
              </span>
            </div>

            {/* Treatment Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-soft-gray" />
              <input 
                type="text" 
                placeholder="Cari nama perawatan atau kategori..."
                value={treatmentSearch}
                onChange={e => setTreatmentSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
              />
            </div>

            {/* Minimalist Text-Based Treatment List */}
            <div className="space-y-1 text-xs max-h-36 overflow-y-auto pr-1">
              <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-soft-gray uppercase px-2.5 py-1 bg-cream/40 rounded-xs border border-gold/10">
                <span className="col-span-5">Layanan / Perawatan</span>
                <span className="col-span-3">Kategori &amp; Durasi</span>
                <span className="col-span-2 text-right">Harga</span>
                <span className="col-span-2 text-right">Aksi</span>
              </div>
              
              {filteredTreatments.map(t => {
                const estPrice = t.category.includes('Laser') ? 2500000 : t.category.includes('Anti') ? 3800000 : 650000;

                return (
                  <div
                    key={t.id}
                    className="grid grid-cols-12 gap-2 items-center px-2.5 py-1.5 bg-white rounded-xs border border-gold/15 hover:border-gold hover:bg-cream/20 transition-colors"
                  >
                    <div className="col-span-5 min-w-0">
                      <div className="font-semibold text-charcoal text-[11px] truncate">{t.name}</div>
                      <div className="text-[9px] text-soft-gray font-mono">{t.id}</div>
                    </div>

                    <div className="col-span-3 text-[10px] text-soft-gray">
                      <span className="inline-block px-1 py-0.2 text-[9px] bg-gold/10 text-gold rounded-xs font-semibold mr-1">
                        {t.category}
                      </span>
                      <span>{t.duration}</span>
                    </div>

                    <div className="col-span-2 text-right font-bold text-charcoal text-[11px]">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(estPrice)}
                    </div>

                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => handleAddTreatmentToCart(t, estPrice)}
                        className="px-2 py-0.5 bg-cream border border-gold/30 text-gold hover:bg-gold hover:text-white text-[10px] font-bold rounded-xs transition-colors"
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: ADD-ON SKINCARE PRODUCTS */}
          <div className="bg-white rounded-xs border border-gold/15 p-3.5 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/10 pb-2">
              <h2 className="font-serif text-sm font-semibold text-charcoal flex items-center gap-2">
                <Package className="w-4 h-4 text-gold" />
                <span>3. Add-On Skincare Pasca Treatment</span>
              </h2>
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10px]">
                {['All', 'Serum', 'Sunscreen', 'Cream', 'Cleanser'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedProductCategory(cat)}
                    className={`px-2 py-0.5 rounded-xs whitespace-nowrap transition-colors ${
                      selectedProductCategory === cat 
                        ? 'bg-gold text-white font-medium' 
                        : 'bg-cream/40 text-soft-gray hover:text-charcoal'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-soft-gray" />
              <input 
                type="text" 
                placeholder="Cari produk skincare rekomendasi dokter..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
              />
            </div>

            {/* Minimalist Text-Based Skincare Products List */}
            <div className="space-y-1 text-xs max-h-36 overflow-y-auto pr-1">
              <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-soft-gray uppercase px-2.5 py-1 bg-cream/40 rounded-xs border border-gold/10">
                <span className="col-span-5">Produk Skincare &amp; Size</span>
                <span className="col-span-2">Stok</span>
                <span className="col-span-3 text-right">Harga</span>
                <span className="col-span-2 text-right">Aksi</span>
              </div>

              {filteredProducts.map(p => {
                const variant = p.variants[0] || { size: '30 ml', price: 350000, stock: 20 };

                return (
                  <div key={p.id} className="grid grid-cols-12 gap-2 items-center px-2.5 py-1.5 bg-white rounded-xs border border-gold/15 hover:border-gold hover:bg-cream/20 transition-colors">
                    <div className="col-span-5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded-xs">
                          {p.category}
                        </span>
                        <span className="font-semibold text-charcoal text-[11px] truncate">{p.name}</span>
                      </div>
                      <div className="text-[9px] text-soft-gray mt-0.5">Ukuran: {variant.size}</div>
                    </div>

                    <div className="col-span-2 text-[10px]">
                      <span className={`font-semibold ${variant.stock < 10 ? 'text-red-600' : 'text-emerald-700'}`}>
                        {variant.stock} unit
                      </span>
                    </div>

                    <div className="col-span-3 text-right font-bold text-gold text-[11px]">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(variant.price)}
                    </div>

                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => handleAddProductToCart(p, variant.size, variant.price, variant.stock)}
                        disabled={variant.stock <= 0}
                        className="px-2 py-0.5 bg-cream border border-gold/30 text-gold hover:bg-gold hover:text-white disabled:opacity-40 disabled:hover:bg-cream text-[10px] font-medium rounded-xs transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: POS INVOICE CART & CHECKOUT (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xs border border-gold/20 p-4 space-y-3.5 sticky top-20 shadow-xs">
            
            <div className="flex items-center justify-between border-b border-gold/15 pb-2">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-gold" />
                <h2 className="font-serif text-base text-charcoal">Tagihan &amp; Rincian POS</h2>
              </div>
              <span className="text-[11px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-xs">
                {selectedBookingId !== 'walk-in' ? `Ref: ${selectedBookingId}` : 'Walk-in'}
              </span>
            </div>

            {/* Customer Information Fields */}
            <div className="bg-cream/30 p-2.5 rounded-xs border border-gold/10 space-y-1.5 text-xs">
              <div>
                <label className="block text-soft-gray text-[9px] uppercase font-bold">Nama Pasien / Pelanggan</label>
                <input 
                  type="text"
                  placeholder="Masukkan nama..."
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full mt-0.5 px-2 py-0.5 bg-white border border-gold/20 rounded-xs font-medium text-charcoal text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-soft-gray text-[9px] uppercase font-bold">No. WhatsApp</label>
                  <input 
                    type="text"
                    placeholder="0812..."
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full mt-0.5 px-2 py-0.5 bg-white border border-gold/20 rounded-xs text-xs text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-soft-gray text-[9px] uppercase font-bold">Dokter Penanggung Jawab</label>
                  <select 
                    value={doctor}
                    onChange={e => setDoctor(e.target.value)}
                    className="w-full mt-0.5 px-1.5 py-0.5 bg-white border border-gold/20 rounded-xs text-xs text-charcoal focus:outline-none focus:border-gold"
                  >
                    <option value="dr. Maya Indah, Sp.DVE">dr. Maya Indah, Sp.DVE</option>
                    <option value="dr. Kartika Sari">dr. Kartika Sari</option>
                    <option value="dr. Amanda Clarissa">dr. Amanda Clarissa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Itemized Cart List */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-charcoal block border-b border-gold/10 pb-0.5">Rincian Item Invoice:</span>
              
              {cartTreatments.length === 0 && cartProducts.length === 0 ? (
                <div className="py-4 text-center text-soft-gray text-xs border border-dashed border-gold/20 rounded-xs">
                  Keranjang POS belum berisi item.
                  <br />
                  <span className="text-[10px]">Pilih perawatan atau produk di panel sebelah kiri.</span>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
                  {/* Treatments list */}
                  {cartTreatments.map((t, idx) => (
                    <div key={`t-${idx}`} className="flex items-center justify-between p-1.5 bg-cream/20 rounded-xs border border-gold/10">
                      <div className="min-w-0 pr-2">
                        <span className="text-[8px] font-bold text-gold uppercase bg-gold/10 px-1 py-0.2 rounded-xs mr-1">Perawatan</span>
                        <span className="font-semibold text-charcoal text-[11px]">{t.name}</span>
                        <div className="text-[9px] text-soft-gray">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(t.price)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => handleUpdateTreatmentQty(idx, -1)} className="p-0.5 hover:bg-cream rounded-xs border border-gold/20">
                          <Minus className="w-3 h-3 text-soft-gray" />
                        </button>
                        <span className="font-bold text-charcoal px-1 text-xs">{t.quantity}</span>
                        <button onClick={() => handleUpdateTreatmentQty(idx, 1)} className="p-0.5 hover:bg-cream rounded-xs border border-gold/20">
                          <Plus className="w-3 h-3 text-soft-gray" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Products list */}
                  {cartProducts.map((p, idx) => (
                    <div key={`p-${idx}`} className="flex items-center justify-between p-1.5 bg-cream/20 rounded-xs border border-gold/10">
                      <div className="min-w-0 pr-2">
                        <span className="text-[8px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1 py-0.2 rounded-xs mr-1">Skincare</span>
                        <span className="font-semibold text-charcoal text-[11px]">{p.name} ({p.size})</span>
                        <div className="text-[9px] text-soft-gray">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.price)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => handleUpdateProductQty(idx, -1)} className="p-0.5 hover:bg-cream rounded-xs border border-gold/20">
                          <Minus className="w-3 h-3 text-soft-gray" />
                        </button>
                        <span className="font-bold text-charcoal px-1 text-xs">{p.quantity}</span>
                        <button onClick={() => handleUpdateProductQty(idx, 1)} className="p-0.5 hover:bg-cream rounded-xs border border-gold/20">
                          <Plus className="w-3 h-3 text-soft-gray" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-cream/40 p-2.5 rounded-xs border border-gold/15 space-y-1.5 text-xs">
              <div className="flex justify-between text-soft-gray text-[11px]">
                <span>Subtotal Perawatan:</span>
                <span className="font-medium text-charcoal">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(treatmentsSubtotal)}
                </span>
              </div>

              <div className="flex justify-between text-soft-gray text-[11px]">
                <span>Subtotal Skincare Add-On:</span>
                <span className="font-medium text-charcoal">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(productsSubtotal)}
                </span>
              </div>

              {/* Discount Field */}
              <div className="flex justify-between items-center pt-1 border-t border-gold/10 text-[11px]">
                <span className="text-soft-gray font-medium">Potongan / Diskon (Rp):</span>
                <input 
                  type="number"
                  value={discountAmount || ''}
                  placeholder="0"
                  onChange={e => setDiscountAmount(Number(e.target.value))}
                  className="w-24 px-1.5 py-0.5 text-right bg-white border border-gold/30 rounded-xs text-xs font-semibold text-gold focus:outline-none"
                />
              </div>

              {/* Total Final */}
              <div className="flex justify-between items-center pt-1.5 border-t border-gold/20 text-xs font-bold">
                <span className="text-charcoal">Total Tagihan (Nett):</span>
                <span className="text-gold font-serif text-base">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(grandTotal)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5 text-xs">
              <label className="block text-soft-gray font-semibold text-[11px]">Metode Pembayaran:</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['QRIS', 'Tunai di Klinik', 'Kartu Kredit/Debit', 'Transfer Bank'] as const).map(pm => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    className={`py-1.5 px-2 text-[10px] rounded-xs border font-medium transition-colors text-center ${
                      paymentMethod === pm 
                        ? 'bg-gold text-white border-gold font-bold shadow-xs' 
                        : 'bg-white border-gold/20 text-soft-gray hover:text-charcoal hover:border-gold/40'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Paid & Change Calculation if Tunai */}
            {paymentMethod === 'Tunai di Klinik' && (
              <div className="bg-amber-50/60 p-2.5 rounded-xs border border-amber-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-amber-900 text-[11px]">Uang Diterima (Rp):</label>
                  <input 
                    type="number"
                    value={cashGiven || ''}
                    placeholder="0"
                    onChange={e => setCashGiven(Number(e.target.value))}
                    className="w-28 px-2 py-0.5 text-right bg-white border border-amber-300 rounded-xs font-bold text-amber-900 text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Quick cash buttons */}
                <div className="flex gap-1 overflow-x-auto pt-0.5">
                  {[grandTotal, 500000, 1000000, 2000000, 3000000].map((num, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCashGiven(num)}
                      className="px-1.5 py-0.5 bg-white border border-amber-200 text-[9px] text-amber-800 rounded-xs hover:bg-amber-100 font-medium whitespace-nowrap"
                    >
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-amber-200 text-xs font-bold">
                  <span className="text-amber-900 text-[11px]">Kembalian:</span>
                  <span className={`text-xs ${changeAmount >= 0 ? 'text-emerald-700 font-serif font-bold' : 'text-red-600'}`}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(changeAmount)}
                  </span>
                </div>
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckout}
              disabled={cartTreatments.length === 0 && cartProducts.length === 0}
              className="w-full py-2.5 bg-gold text-white font-medium text-xs rounded-xs hover:bg-gold-light disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <CreditCard className="w-4 h-4" />
              <span>Selesaikan Pembayaran &amp; Cetak Struk</span>
            </button>

          </div>
        </div>

      </div>

      {/* MODAL: PRINTABLE RECEIPT / STRUK KASIR */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-gold/30 w-full max-w-md p-6 space-y-5 shadow-2xl">
            
            {/* Header Struk */}
            <div className="text-center space-y-1 pb-4 border-b border-dashed border-gold/20">
              <span className="text-xs font-serif font-bold tracking-widest text-charcoal">AURA BEAUTY CLINIC</span>
              <p className="text-[10px] text-soft-gray uppercase">{completedReceipt.branch}</p>
              <div className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-xs">
                SISTEM KASIR POS - LUNAS
              </div>
            </div>

            {/* Meta Info */}
            <div className="text-xs space-y-1 bg-cream/30 p-3 rounded-xs border border-gold/10">
              <div className="flex justify-between">
                <span className="text-soft-gray">No. Invoice:</span>
                <span className="font-bold text-gold">{completedReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soft-gray">Waktu:</span>
                <span className="text-charcoal">{completedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soft-gray">Pasien / Pembeli:</span>
                <span className="font-semibold text-charcoal">{completedReceipt.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soft-gray">Dokter PJ:</span>
                <span className="text-charcoal">{completedReceipt.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soft-gray">Metode Pembayaran:</span>
                <span className="font-medium text-gold">{completedReceipt.paymentMethod}</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-charcoal border-b border-gold/10 pb-1">Item Perawatan &amp; Produk:</div>
              {completedReceipt.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-gold/5">
                  <div>
                    <div className="font-medium text-charcoal">{item.productName} ({item.size})</div>
                    <div className="text-[10px] text-soft-gray">
                      {item.quantity} x {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.pricePerUnit)}
                    </div>
                  </div>
                  <div className="font-semibold text-charcoal">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.quantity * item.pricePerUnit)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1.5 pt-2 border-t border-dashed border-gold/20 text-xs">
              {completedReceipt.discountAmount ? (
                <div className="flex justify-between text-soft-gray">
                  <span>Potongan Diskon:</span>
                  <span className="text-red-600 font-semibold">
                    -{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(completedReceipt.discountAmount)}
                  </span>
                </div>
              ) : null}

              <div className="flex justify-between text-sm font-bold text-charcoal pt-1">
                <span>TOTAL LUNAS:</span>
                <span className="text-gold font-serif">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(completedReceipt.totalAmount)}
                </span>
              </div>

              {completedReceipt.cashAmount ? (
                <>
                  <div className="flex justify-between text-[11px] text-soft-gray">
                    <span>Uang Tunai Diterima:</span>
                    <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(completedReceipt.cashAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-emerald-700">
                    <span>Kembalian:</span>
                    <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(completedReceipt.changeAmount || 0)}</span>
                  </div>
                </>
              ) : null}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex gap-2 justify-end border-t border-gold/10">
              <button 
                onClick={() => window.print()} 
                className="px-3.5 py-2 bg-cream border border-gold/30 text-gold hover:bg-gold hover:text-white text-xs font-medium rounded-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Struk</span>
              </button>
              <button 
                onClick={handleResetPOS}
                className="px-4 py-2 bg-charcoal text-white text-xs font-medium rounded-xs hover:bg-black transition-colors"
              >
                Selesai &amp; Transaksi Baru
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
