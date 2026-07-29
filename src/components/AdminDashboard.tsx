import { useState, FormEvent } from 'react';
import { 
  Search, 
  Plus, 
  ArrowLeft,
  AlertTriangle,
  X,
  LayoutDashboard,
  Calendar,
  Sparkles,
  Package,
  Building2,
  Menu,
  User,
  ShoppingBag,
  Receipt,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  CreditCard
} from 'lucide-react';
import { TREATMENTS as initialTreatments, PRODUCTS as initialProducts } from '../data';
import { Treatment, Product, Booking, ProductPurchase, PurchaseItem } from '../types';
import POSView from './POSView';

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    clientName: 'Siti Rahmawati',
    clientPhone: '0812-3456-7890',
    treatmentName: 'Aura Radiance Pico Laser',
    branch: 'Surabaya Town Square',
    date: '2026-07-29',
    time: '10:00 WIB',
    doctor: 'dr. Maya Indah, Sp.DVE',
    status: 'Terkonfirmasi',
    totalAmount: 2500000
  },
  {
    id: 'BK-1002',
    clientName: 'Ananda Putri',
    clientPhone: '0819-8765-4321',
    treatmentName: 'Crystal Clear Facial',
    branch: 'Dharmawangsa, Jakarta',
    date: '2026-07-29',
    time: '13:00 WIB',
    doctor: 'dr. Kartika Sari',
    status: 'Pending',
    totalAmount: 650000
  },
  {
    id: 'BK-1003',
    clientName: 'Dewi Lestari',
    clientPhone: '0857-1122-3344',
    treatmentName: 'Diamond Lift Contour',
    branch: 'Seminyak, Bali',
    date: '2026-07-30',
    time: '15:30 WITA',
    doctor: 'dr. Amanda Clarissa',
    status: 'Terkonfirmasi',
    totalAmount: 3800000
  },
  {
    id: 'BK-1004',
    clientName: 'Budi Santoso',
    clientPhone: '0813-9988-7766',
    treatmentName: 'Crystal Clear Facial',
    branch: 'Surabaya Town Square',
    date: '2026-07-28',
    time: '11:00 WIB',
    doctor: 'dr. Maya Indah, Sp.DVE',
    status: 'Selesai',
    totalAmount: 650000
  },
  {
    id: 'BK-1005',
    clientName: 'Clarissa Wijaya',
    clientPhone: '0821-4455-6677',
    treatmentName: 'Aura Radiance Pico Laser',
    branch: 'Dharmawangsa, Jakarta',
    date: '2026-07-31',
    time: '16:00 WIB',
    doctor: 'dr. Kartika Sari',
    status: 'Pending',
    totalAmount: 2500000
  }
];

const INITIAL_PURCHASES: ProductPurchase[] = [
  {
    id: 'TRX-8001',
    customerName: 'Siti Rahmawati',
    customerPhone: '0812-3456-7890',
    items: [
      { productName: 'Aura Radiance Serum', size: '30 ml', quantity: 1, pricePerUnit: 480000 },
      { productName: 'UV Barrier Sunscreen Broad Spectrum', size: '50 ml', quantity: 1, pricePerUnit: 320000 }
    ],
    totalAmount: 800000,
    date: '2026-07-28 14:20',
    paymentMethod: 'QRIS',
    status: 'Lunas',
    branch: 'Surabaya Town Square'
  },
  {
    id: 'TRX-8002',
    customerName: 'Dewi Lestari',
    customerPhone: '0857-1122-3344',
    items: [
      { productName: 'Cellular Renewal Night Cream', size: '50 gr', quantity: 1, pricePerUnit: 750000 }
    ],
    totalAmount: 750000,
    date: '2026-07-28 11:15',
    paymentMethod: 'Kartu Kredit',
    status: 'Selesai',
    branch: 'Seminyak, Bali'
  },
  {
    id: 'TRX-8003',
    customerName: 'Ananda Putri',
    customerPhone: '0819-8765-4321',
    items: [
      { productName: 'Hydra Gel Gentle Cleanser', size: '100 ml', quantity: 2, pricePerUnit: 250000 }
    ],
    totalAmount: 500000,
    date: '2026-07-27 16:45',
    paymentMethod: 'Transfer Bank',
    status: 'Dikirim',
    branch: 'Dharmawangsa, Jakarta'
  },
  {
    id: 'TRX-8004',
    customerName: 'Rina Kusuma',
    customerPhone: '0822-3344-5566',
    items: [
      { productName: 'Aura Radiance Serum', size: '30 ml', quantity: 1, pricePerUnit: 480000 },
      { productName: 'Cellular Renewal Night Cream', size: '30 gr', quantity: 1, pricePerUnit: 450000 }
    ],
    totalAmount: 930000,
    date: '2026-07-26 10:30',
    paymentMethod: 'Tunai di Klinik',
    status: 'Selesai',
    branch: 'Surabaya Town Square'
  }
];

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export default function AdminDashboard({ onBackToSite }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'pos' | 'treatments' | 'inventory' | 'purchases' | 'reports'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State data
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [treatments, setTreatments] = useState<Treatment[]>(initialTreatments);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [purchases, setPurchases] = useState<ProductPurchase[]>(INITIAL_PURCHASES);
  const [selectedPosBooking, setSelectedPosBooking] = useState<Booking | null>(null);

  // POS Complete Handler
  const handleCompletePOSPayment = (
    newPurchase: ProductPurchase,
    bookingIdToComplete?: string,
    productsToDeduct?: { productId: string; size: string; quantity: number }[]
  ) => {
    // 1. Record purchase
    setPurchases(prev => [newPurchase, ...prev]);

    // 2. Complete linked booking
    if (bookingIdToComplete) {
      setBookings(prev => prev.map(b => b.id === bookingIdToComplete ? { ...b, status: 'Selesai' } : b));
    }

    // 3. Deduct product inventory stock
    if (productsToDeduct && productsToDeduct.length > 0) {
      setProducts(prevProducts => {
        return prevProducts.map(p => {
          const matches = productsToDeduct.filter(item => item.productId === p.id);
          if (matches.length === 0) return p;

          const updatedVariants = p.variants.map(v => {
            const match = matches.find(m => m.size === v.size);
            if (match) {
              return { ...v, stock: Math.max(0, v.stock - match.quantity) };
            }
            return v;
          });

          return { ...p, variants: updatedVariants };
        });
      });
    }

    setSelectedPosBooking(null);
  };

  // Filters state for bookings
  const [bookingSearch, setBookingSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [branchFilter, setBranchFilter] = useState<string>('All');

  // Filters state for products
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('All');

  // Filters state for purchases
  const [purchaseSearch, setPurchaseSearch] = useState('');
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState<string>('All');
  const [selectedPurchase, setSelectedPurchase] = useState<ProductPurchase | null>(null);

  // New Booking Modal state
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [newBookingData, setNewBookingData] = useState({
    clientName: '',
    clientPhone: '',
    treatmentName: treatments[0]?.name || 'Aura Radiance Pico Laser',
    branch: 'Surabaya Town Square',
    date: '2026-07-30',
    time: '10:00 WIB',
    doctor: 'dr. Maya Indah, Sp.DVE',
    totalAmount: 2500000
  });

  // Stock edit state
  const [editingStockProductId, setEditingStockProductId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  // Product Add/Edit Modal state
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Serum',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    size: '30 ml',
    price: 350000,
    stock: 50
  });

  const [editProductForm, setEditProductForm] = useState({
    id: '',
    name: '',
    category: 'Serum',
    description: '',
    imageUrl: '',
    size: '30 ml',
    price: 350000,
    stock: 50
  });

  // New Treatment modal state
  const [isNewTreatmentModalOpen, setIsNewTreatmentModalOpen] = useState(false);
  const [newTreatment, setNewTreatment] = useState({
    name: '',
    category: 'Facial & Cleansing',
    duration: '60 Menit',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    downtime: 'Tanpa downtime',
    benefits: 'Kulit lebih sehat, Kencang'
  });

  // Update Booking Status
  const handleUpdateStatus = (id: string, newStatus: 'Pending' | 'Terkonfirmasi' | 'Selesai' | 'Dibatalkan') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  // Update Purchase Status
  const handleUpdatePurchaseStatus = (id: string, newStatus: 'Lunas' | 'Dikirim' | 'Selesai' | 'Dibatalkan') => {
    setPurchases(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  // Add new booking
  const handleAddBooking = (e: FormEvent) => {
    e.preventDefault();
    const newId = `BK-${1000 + bookings.length + 1}`;
    const created: Booking = {
      id: newId,
      ...newBookingData,
      status: 'Pending'
    };
    setBookings([created, ...bookings]);
    setIsNewBookingModalOpen(false);
    setNewBookingData({
      clientName: '',
      clientPhone: '',
      treatmentName: treatments[0]?.name || 'Aura Radiance Pico Laser',
      branch: 'Surabaya Town Square',
      date: '2026-07-30',
      time: '10:00 WIB',
      doctor: 'dr. Maya Indah, Sp.DVE',
      totalAmount: 2500000
    });
  };

  // Add new product
  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: `p${products.length + 1}`,
      name: newProductForm.name,
      category: newProductForm.category,
      description: newProductForm.description,
      imageUrl: newProductForm.imageUrl,
      variants: [
        {
          size: newProductForm.size,
          price: newProductForm.price,
          stock: newProductForm.stock
        }
      ]
    };

    setProducts([created, ...products]);
    setIsAddProductModalOpen(false);
    setNewProductForm({
      name: '',
      category: 'Serum',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
      size: '30 ml',
      price: 350000,
      stock: 50
    });
  };

  // Start Edit Product
  const handleStartEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditProductForm({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description || '',
      imageUrl: p.imageUrl,
      size: p.variants[0]?.size || '30 ml',
      price: p.variants[0]?.price || 350000,
      stock: p.variants[0]?.stock || 30
    });
  };

  // Save Edit Product
  const handleSaveEditProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProducts(prev => prev.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          name: editProductForm.name,
          category: editProductForm.category,
          description: editProductForm.description,
          imageUrl: editProductForm.imageUrl,
          variants: [
            {
              size: editProductForm.size,
              price: editProductForm.price,
              stock: editProductForm.stock
            }
          ]
        };
      }
      return p;
    }));

    setEditingProduct(null);
  };

  // Delete Product
  const handleDeleteProduct = (productId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  // Add new treatment
  const handleAddTreatment = (e: FormEvent) => {
    e.preventDefault();
    const created: Treatment = {
      id: `t${treatments.length + 1}`,
      name: newTreatment.name,
      category: newTreatment.category,
      duration: newTreatment.duration,
      description: newTreatment.description,
      imageUrl: newTreatment.imageUrl,
      downtime: newTreatment.downtime,
      benefits: newTreatment.benefits.split(',').map(b => b.trim())
    };
    setTreatments([...treatments, created]);
    setIsNewTreatmentModalOpen(false);
    setNewTreatment({
      name: '',
      category: 'Facial & Cleansing',
      duration: '60 Menit',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
      downtime: 'Tanpa downtime',
      benefits: 'Kulit lebih sehat, Kencang'
    });
  };

  // Quick Update Stock
  const handleSaveStock = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedVariants = p.variants.map(v => ({ ...v, stock: tempStockValue }));
        return { ...p, variants: updatedVariants };
      }
      return p;
    }));
    setEditingStockProductId(null);
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.clientName.toLowerCase().includes(bookingSearch.toLowerCase()) || 
                          b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          b.clientPhone.includes(bookingSearch);
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesBranch = branchFilter === 'All' || b.branch === branchFilter;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Purchases
  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = p.customerName.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
                          p.id.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
                          p.customerPhone.includes(purchaseSearch);
    const matchesStatus = purchaseStatusFilter === 'All' || p.status === purchaseStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalRevenue = bookings
    .filter(b => b.status === 'Selesai' || b.status === 'Terkonfirmasi')
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'Terkonfirmasi').length;
  const completedCount = bookings.filter(b => b.status === 'Selesai').length;

  const totalProductSales = purchases
    .filter(p => p.status === 'Lunas' || p.status === 'Selesai' || p.status === 'Dikirim')
    .reduce((sum, p) => sum + p.totalAmount, 0);

  interface NavItem {
    id: 'overview' | 'bookings' | 'pos' | 'treatments' | 'inventory' | 'purchases' | 'reports';
    label: string;
    icon: typeof LayoutDashboard;
    badge?: number | null;
  }

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'bookings', label: 'Reservasi', icon: Calendar, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'pos', label: 'Kasir & POS', icon: CreditCard },
    { id: 'treatments', label: 'Katalog Perawatan', icon: Sparkles },
    { id: 'inventory', label: 'Kelola Produk & Stok', icon: Package },
    { id: 'purchases', label: 'History Pembelian', icon: Receipt },
    { id: 'reports', label: 'Cabang & Performa', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans flex antialiased">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MINIMALIST SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gold/15 flex flex-col justify-between
        transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 space-y-8">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-wider text-charcoal">AURA BEAUTY</span>
              <span className="text-[10px] uppercase font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-xs">Admin</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-soft-gray hover:text-charcoal p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xs text-xs font-medium transition-colors
                    ${isActive 
                      ? 'bg-gold/10 text-gold font-semibold' 
                      : 'text-soft-gray hover:bg-cream/40 hover:text-charcoal'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-soft-gray'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-gold text-white text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gold/10 space-y-3">
          {/* Doctor Info */}
          <div className="flex items-center gap-3 px-2 py-1.5 text-xs">
            <div className="w-8 h-8 rounded-full bg-cream border border-gold/20 flex items-center justify-center text-gold font-semibold">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-medium text-charcoal truncate">dr. Kartika Sari</div>
              <div className="text-[10px] text-soft-gray truncate">Dokter Penanggung Jawab</div>
            </div>
          </div>

          {/* Back to main site */}
          <button 
            onClick={onBackToSite}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-soft-gray hover:text-gold border border-gold/20 rounded-xs hover:border-gold/40 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Situs Utama</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Minimal Header on Content */}
        <header className="bg-white border-b border-gold/15 h-14 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-charcoal p-1.5 hover:bg-cream/40 rounded-xs"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-base text-charcoal capitalize">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-soft-gray">
            <span className="hidden sm:inline">Klinik Operasional</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Action Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-serif text-2xl text-charcoal">Ringkasan Operasional</h1>
                  <p className="text-xs text-soft-gray mt-0.5">Status aktivitas reservasi &amp; statistik performa klinik hari ini.</p>
                </div>
                <button 
                  onClick={() => setIsNewBookingModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gold text-white text-xs font-medium rounded-xs hover:bg-gold-light transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Booking</span>
                </button>
              </div>

              {/* Minimalist Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xs border border-gold/15 flex flex-col justify-between">
                  <span className="text-xs text-soft-gray uppercase tracking-wider">Estimasi Omzet Service</span>
                  <div className="font-serif text-2xl text-charcoal my-2">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalRevenue)}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">+14% dari bulan lalu</span>
                </div>

                <div className="bg-white p-5 rounded-xs border border-gold/15 flex flex-col justify-between">
                  <span className="text-xs text-soft-gray uppercase tracking-wider">Penjualan Skincare</span>
                  <div className="font-serif text-2xl text-gold my-2">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalProductSales)}
                  </div>
                  <span className="text-[11px] text-soft-gray">{purchases.length} transaksi penjualan</span>
                </div>

                <div className="bg-white p-5 rounded-xs border border-gold/15 flex flex-col justify-between">
                  <span className="text-xs text-soft-gray uppercase tracking-wider">Menunggu Konfirmasi</span>
                  <div className="font-serif text-2xl text-charcoal my-2">
                    {pendingCount} <span className="text-xs font-sans text-soft-gray">pasien</span>
                  </div>
                  <span className="text-[11px] text-gold font-medium">Perlu verifikasi</span>
                </div>

                <div className="bg-white p-5 rounded-xs border border-gold/15 flex flex-col justify-between">
                  <span className="text-xs text-soft-gray uppercase tracking-wider">Selesai Ditangani</span>
                  <div className="font-serif text-2xl text-charcoal my-2">
                    {completedCount} <span className="text-xs font-sans text-soft-gray">sesi</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">Perawatan medis tuntas</span>
                </div>
              </div>

              {/* Overview Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Cols: Recent Bookings */}
                <div className="lg:col-span-2 bg-white rounded-xs border border-gold/15 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gold/10">
                    <h2 className="font-serif text-lg text-charcoal">Reservasi Terbaru</h2>
                    <button 
                      onClick={() => setActiveTab('bookings')} 
                      className="text-xs font-medium text-gold hover:underline"
                    >
                      Lihat Semua
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="text-soft-gray border-b border-gold/10 text-[11px]">
                          <th className="py-2">Pasien</th>
                          <th className="py-2">Perawatan</th>
                          <th className="py-2">Jadwal</th>
                          <th className="py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold/10">
                        {bookings.slice(0, 4).map(b => (
                          <tr key={b.id} className="hover:bg-cream/30 transition-colors">
                            <td className="py-3">
                              <div className="font-medium text-charcoal">{b.clientName}</div>
                              <div className="text-[10px] text-soft-gray">{b.clientPhone}</div>
                            </td>
                            <td className="py-3 text-charcoal">{b.treatmentName}</td>
                            <td className="py-3 text-soft-gray">
                              <div>{b.date}</div>
                              <div className="text-gold font-medium">{b.time}</div>
                            </td>
                            <td className="py-3">
                              <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-xs ${
                                b.status === 'Terkonfirmasi' ? 'bg-emerald-50 text-emerald-700' :
                                b.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                                b.status === 'Selesai' ? 'bg-blue-50 text-blue-700' :
                                'bg-red-50 text-red-700'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Col: Minimal Notices */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xs border border-gold/15 p-6 space-y-4">
                    <h3 className="font-serif text-base text-charcoal flex items-center justify-between">
                      <span>Peringatan Stok Produk</span>
                      <AlertTriangle className="w-4 h-4 text-gold" />
                    </h3>
                    <div className="space-y-3 text-xs">
                      {products.map(p => {
                        const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
                        return (
                          <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-gold/10 last:border-0">
                            <div>
                              <div className="font-medium text-charcoal">{p.name}</div>
                              <div className="text-[10px] text-soft-gray">Sisa: {totalStock} unit</div>
                            </div>
                            <button 
                              onClick={() => setActiveTab('inventory')}
                              className="text-[11px] text-gold hover:underline"
                            >
                              Update
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-xs border border-gold/15 p-6 space-y-3">
                    <h3 className="font-serif text-base text-charcoal">Status Cabang</h3>
                    <div className="text-xs space-y-2 text-soft-gray">
                      <div className="flex justify-between">
                        <span>Surabaya:</span>
                        <span className="text-emerald-700 font-medium">Buka (10:00 - 20:00)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jakarta:</span>
                        <span className="text-emerald-700 font-medium">Buka (10:00 - 20:00)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bali:</span>
                        <span className="text-emerald-700 font-medium">Buka (10:00 - 20:00)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl text-charcoal">Daftar Reservasi</h1>
                  <p className="text-xs text-soft-gray">Kelola jadwal &amp; status janji temu pasien.</p>
                </div>
                <button 
                  onClick={() => setIsNewBookingModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gold text-white text-xs font-medium rounded-xs hover:bg-gold-light transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Booking Manual</span>
                </button>
              </div>

              {/* Minimalist Filter Bar */}
              <div className="bg-white p-4 rounded-xs border border-gold/15 flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
                <div className="relative w-full md:w-80">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-soft-gray" />
                  <input 
                    type="text" 
                    placeholder="Cari pasien atau ID..." 
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-cream/30 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-soft-gray">Status:</span>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="py-1.5 px-2 bg-cream/30 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                    >
                      <option value="All">Semua</option>
                      <option value="Pending">Pending</option>
                      <option value="Terkonfirmasi">Terkonfirmasi</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-soft-gray">Cabang:</span>
                    <select 
                      value={branchFilter}
                      onChange={(e) => setBranchFilter(e.target.value)}
                      className="py-1.5 px-2 bg-cream/30 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                    >
                      <option value="All">Semua Cabang</option>
                      <option value="Surabaya Town Square">Surabaya</option>
                      <option value="Dharmawangsa, Jakarta">Jakarta</option>
                      <option value="Seminyak, Bali">Bali</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xs border border-gold/15 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-cream/40 text-soft-gray border-b border-gold/15">
                        <th className="py-3 px-4">ID &amp; Pasien</th>
                        <th className="py-3 px-4">Perawatan</th>
                        <th className="py-3 px-4">Cabang</th>
                        <th className="py-3 px-4">Jadwal</th>
                        <th className="py-3 px-4">Biaya</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-soft-gray">
                            Tidak ditemukan reservasi.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map(b => (
                          <tr key={b.id} className="hover:bg-cream/20 transition-colors">
                            <td className="py-3.5 px-4 font-medium">
                              <div className="text-[10px] font-bold text-gold">{b.id}</div>
                              <div className="text-charcoal">{b.clientName}</div>
                              <div className="text-[10px] text-soft-gray">{b.clientPhone}</div>
                            </td>
                            <td className="py-3.5 px-4 text-charcoal">{b.treatmentName}</td>
                            <td className="py-3.5 px-4 text-soft-gray">{b.branch}</td>
                            <td className="py-3.5 px-4">
                              <div className="text-charcoal">{b.date}</div>
                              <div className="text-gold font-medium">{b.time}</div>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-charcoal">
                              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(b.totalAmount)}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-xs ${
                                b.status === 'Terkonfirmasi' ? 'bg-emerald-50 text-emerald-700' :
                                b.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                                b.status === 'Selesai' ? 'bg-blue-50 text-blue-700' :
                                'bg-red-50 text-red-700'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {(b.status === 'Pending' || b.status === 'Terkonfirmasi') && (
                                  <button 
                                    onClick={() => {
                                      setSelectedPosBooking(b);
                                      setActiveTab('pos');
                                    }}
                                    className="px-2 py-1 bg-gold/10 text-gold border border-gold/30 text-[10px] font-semibold rounded-xs hover:bg-gold hover:text-white transition-colors flex items-center gap-1"
                                    title="Proses ke POS untuk Pembayaran & Add-on Produk"
                                  >
                                    <CreditCard className="w-3 h-3" />
                                    <span>POS Kasir</span>
                                  </button>
                                )}
                                {b.status === 'Pending' && (
                                  <button 
                                    onClick={() => handleUpdateStatus(b.id, 'Terkonfirmasi')}
                                    className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] rounded-xs hover:bg-emerald-100"
                                  >
                                    Konfirmasi
                                  </button>
                                )}
                                {b.status === 'Terkonfirmasi' && (
                                  <button 
                                    onClick={() => handleUpdateStatus(b.id, 'Selesai')}
                                    className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] rounded-xs hover:bg-blue-100"
                                  >
                                    Selesai
                                  </button>
                                )}
                                {b.status !== 'Dibatalkan' && b.status !== 'Selesai' && (
                                  <button 
                                    onClick={() => handleUpdateStatus(b.id, 'Dibatalkan')}
                                    className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 text-[10px] rounded-xs hover:bg-red-100"
                                  >
                                    Batal
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* POS KASIR TAB */}
          {activeTab === 'pos' && (
            <POSView 
              bookings={bookings}
              treatments={treatments}
              products={products}
              onCompletePayment={handleCompletePOSPayment}
              selectedBookingFromParent={selectedPosBooking}
            />
          )}

          {/* TREATMENTS TAB */}
          {activeTab === 'treatments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl text-charcoal">Katalog Perawatan Medis</h1>
                  <p className="text-xs text-soft-gray">Kelola varian layanan &amp; informasi medis.</p>
                </div>
                <button 
                  onClick={() => setIsNewTreatmentModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gold text-white text-xs font-medium rounded-xs hover:bg-gold-light transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Perawatan Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {treatments.map(t => (
                  <div key={t.id} className="bg-white rounded-xs border border-gold/15 p-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-gold tracking-wider">{t.category}</span>
                        <span className="text-xs text-soft-gray">{t.duration}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-charcoal">{t.name}</h3>
                      <p className="text-xs text-soft-gray leading-relaxed">{t.description}</p>
                      
                      <div className="text-xs pt-2 border-t border-gold/10 space-y-1">
                        <div className="text-charcoal"><span className="text-soft-gray">Downtime:</span> {t.downtime || 'Tanpa downtime'}</div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gold/10 flex items-center justify-between text-xs">
                      <span className="text-soft-gray">ID: {t.id}</span>
                      <button 
                        onClick={() => alert(`Edit treatment: ${t.name}`)}
                        className="text-gold hover:underline font-medium"
                      >
                        Edit Detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INVENTORY / PRODUCT MANAGEMENT TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl text-charcoal">Kelola Produk Skincare</h1>
                  <p className="text-xs text-soft-gray">Kelola data produk, harga, varian, dan stok barang.</p>
                </div>
                <button 
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gold text-white text-xs font-medium rounded-xs hover:bg-gold-light transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Produk Baru</span>
                </button>
              </div>

              {/* Filter Bar */}
              <div className="bg-white p-4 rounded-xs border border-gold/15 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-soft-gray" />
                  <input 
                    type="text" 
                    placeholder="Cari nama produk / kategori..." 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-cream/30 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-soft-gray">Kategori:</span>
                  <select 
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="py-1.5 px-2 bg-cream/30 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  >
                    <option value="All">Semua Kategori</option>
                    <option value="Serum">Serum</option>
                    <option value="Sunscreen">Sunscreen</option>
                    <option value="Cream">Cream</option>
                    <option value="Cleanser">Cleanser</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xs border border-gold/15 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-cream/40 text-soft-gray border-b border-gold/15">
                        <th className="py-3 px-4">Gambar</th>
                        <th className="py-3 px-4">Nama Produk</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Varian &amp; Harga</th>
                        <th className="py-3 px-4">Stok</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-soft-gray">
                            Tidak ada produk yang sesuai.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map(p => {
                          const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
                          const isEditingThisStock = editingStockProductId === p.id;

                          return (
                            <tr key={p.id} className="hover:bg-cream/20 transition-colors">
                              <td className="py-3 px-4">
                                <img 
                                  src={p.imageUrl} 
                                  alt={p.name} 
                                  className="w-10 h-10 object-cover rounded-xs border border-gold/20"
                                />
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-charcoal">{p.name}</div>
                                <div className="text-[10px] text-soft-gray line-clamp-1 max-w-xs">{p.description}</div>
                              </td>
                              <td className="py-3.5 px-4 text-soft-gray">
                                <span className="inline-block px-2 py-0.5 bg-cream text-gold text-[10px] font-semibold rounded-xs">
                                  {p.category}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                {p.variants.map((v, i) => (
                                  <div key={i} className="text-[11px] font-medium">
                                    {v.size}: <span className="text-gold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v.price)}</span>
                                  </div>
                                ))}
                              </td>
                              <td className="py-3.5 px-4">
                                {isEditingThisStock ? (
                                  <div className="flex items-center gap-1">
                                    <input 
                                      type="number" 
                                      value={tempStockValue} 
                                      onChange={(e) => setTempStockValue(Number(e.target.value))}
                                      className="w-16 px-1.5 py-0.5 text-xs border border-gold rounded-xs"
                                    />
                                    <button onClick={() => handleSaveStock(p.id)} className="px-2 py-0.5 bg-gold text-white text-[10px] rounded-xs">
                                      OK
                                    </button>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => {
                                      setEditingStockProductId(p.id);
                                      setTempStockValue(totalStock);
                                    }}
                                    className={`font-semibold hover:underline ${totalStock < 30 ? 'text-amber-700' : 'text-emerald-700'}`}
                                  >
                                    {totalStock} Unit
                                  </button>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => handleStartEditProduct(p)}
                                    className="p-1.5 text-soft-gray hover:text-gold border border-gold/20 rounded-xs hover:border-gold transition-colors"
                                    title="Edit Produk"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 text-soft-gray hover:text-red-600 border border-gold/20 rounded-xs hover:border-red-300 transition-colors"
                                    title="Hapus Produk"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* HISTORY PEMBELIAN PRODUK TAB */}
          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl text-charcoal">Riwayat Pembelian Skincare</h1>
                  <p className="text-xs text-soft-gray">Daftar transaksi penjualan produk skincare klinis di semua cabang.</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1.5 bg-white border border-gold/15 rounded-xs font-medium text-charcoal">
                    Total Omzet: <span className="text-gold font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalProductSales)}</span>
                  </span>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="bg-white p-4 rounded-xs border border-gold/15 flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
                <div className="relative w-full md:w-80">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-soft-gray" />
                  <input 
                    type="text" 
                    placeholder="Cari ID transaksi / nama pembeli..." 
                    value={purchaseSearch}
                    onChange={(e) => setPurchaseSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-cream/30 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-soft-gray">Status Pembayaran:</span>
                  <select 
                    value={purchaseStatusFilter}
                    onChange={(e) => setPurchaseStatusFilter(e.target.value)}
                    className="py-1.5 px-2 bg-cream/30 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  >
                    <option value="All">Semua Status</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Dikirim">Dikirim</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>

              {/* Purchases Table */}
              <div className="bg-white rounded-xs border border-gold/15 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-cream/40 text-soft-gray border-b border-gold/15">
                        <th className="py-3 px-4">ID &amp; Pembeli</th>
                        <th className="py-3 px-4">Item Produk</th>
                        <th className="py-3 px-4">Cabang</th>
                        <th className="py-3 px-4">Tanggal &amp; Metode</th>
                        <th className="py-3 px-4">Total Biaya</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10">
                      {filteredPurchases.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-soft-gray">
                            Tidak ditemukan transaksi pembelian produk.
                          </td>
                        </tr>
                      ) : (
                        filteredPurchases.map(p => (
                          <tr key={p.id} className="hover:bg-cream/20 transition-colors">
                            <td className="py-3.5 px-4 font-medium">
                              <div className="text-[10px] font-bold text-gold">{p.id}</div>
                              <div className="text-charcoal">{p.customerName}</div>
                              <div className="text-[10px] text-soft-gray">{p.customerPhone}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                {p.items.map((item, idx) => (
                                  <div key={idx} className="text-charcoal">
                                    {item.productName} ({item.size}) <span className="text-gold font-semibold">x{item.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-soft-gray">{p.branch}</td>
                            <td className="py-3.5 px-4">
                              <div className="text-charcoal">{p.date}</div>
                              <div className="text-[10px] text-soft-gray font-medium">{p.paymentMethod}</div>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-charcoal">
                              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.totalAmount)}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-xs ${
                                p.status === 'Lunas' ? 'bg-emerald-50 text-emerald-700' :
                                p.status === 'Dikirim' ? 'bg-amber-50 text-amber-700' :
                                p.status === 'Selesai' ? 'bg-blue-50 text-blue-700' :
                                'bg-red-50 text-red-700'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button 
                                  onClick={() => setSelectedPurchase(p)}
                                  className="px-2.5 py-1 bg-cream border border-gold/30 text-gold hover:bg-gold hover:text-white text-[10px] font-medium rounded-xs transition-colors inline-flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Detail</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-2xl text-charcoal">Performance Cabang</h1>
                <p className="text-xs text-soft-gray">Kapasitas &amp; aktivitas klinik di tiap lokasi.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Surabaya Town Square', city: 'Surabaya', doctors: 'dr. Maya Indah, Sp.DVE', occupancy: '88%', activeBookings: 12 },
                  { name: 'Dharmawangsa', city: 'Jakarta Selatan', doctors: 'dr. Kartika Sari', occupancy: '92%', activeBookings: 18 },
                  { name: 'Seminyak', city: 'Badung, Bali', doctors: 'dr. Amanda Clarissa', occupancy: '76%', activeBookings: 8 }
                ].map((b, idx) => (
                  <div key={idx} className="bg-white rounded-xs border border-gold/15 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-gold">{b.city}</span>
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs">Buka</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-charcoal">{b.name}</h3>
                    <p className="text-xs text-soft-gray">PJ: {b.doctors}</p>

                    <div className="pt-3 border-t border-gold/10 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-soft-gray">Okupansi Bed:</span>
                        <span className="font-semibold text-gold">{b.occupancy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-soft-gray">Pasien Aktif:</span>
                        <span className="font-semibold text-charcoal">{b.activeBookings} Pasien</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: NEW BOOKING */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-gold/20 w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gold/10">
              <h3 className="font-serif text-lg text-charcoal">Tambah Booking Manual</h3>
              <button onClick={() => setIsNewBookingModalOpen(false)} className="text-soft-gray hover:text-charcoal">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBooking} className="space-y-3 text-xs">
              <div>
                <label className="block text-soft-gray mb-1">Nama Pasien</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Ani Suryani"
                  value={newBookingData.clientName}
                  onChange={e => setNewBookingData({ ...newBookingData, clientName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-soft-gray mb-1">Telepon / WhatsApp</label>
                <input 
                  type="text" 
                  required
                  placeholder="0812xxxx"
                  value={newBookingData.clientPhone}
                  onChange={e => setNewBookingData({ ...newBookingData, clientPhone: e.target.value })}
                  className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-soft-gray mb-1">Treatment</label>
                  <select 
                    value={newBookingData.treatmentName}
                    onChange={e => setNewBookingData({ ...newBookingData, treatmentName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  >
                    {treatments.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-soft-gray mb-1">Cabang</label>
                  <select 
                    value={newBookingData.branch}
                    onChange={e => setNewBookingData({ ...newBookingData, branch: e.target.value })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  >
                    <option value="Surabaya Town Square">Surabaya</option>
                    <option value="Dharmawangsa, Jakarta">Jakarta</option>
                    <option value="Seminyak, Bali">Bali</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-soft-gray mb-1">Tanggal</label>
                  <input 
                    type="date" 
                    required
                    value={newBookingData.date}
                    onChange={e => setNewBookingData({ ...newBookingData, date: e.target.value })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-soft-gray mb-1">Jam</label>
                  <input 
                    type="text" 
                    required
                    placeholder="10:00 WIB"
                    value={newBookingData.time}
                    onChange={e => setNewBookingData({ ...newBookingData, time: e.target.value })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-3 py-1.5 border border-gold/20 text-soft-gray rounded-xs"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-gold text-white font-medium rounded-xs hover:bg-gold-light"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-gold/20 w-full max-w-md p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gold/10">
              <h3 className="font-serif text-lg text-charcoal">Tambah Produk Skincare</h3>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-soft-gray hover:text-charcoal">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-soft-gray mb-1">Nama Produk</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Hydra Defense Moisture Cream"
                  value={newProductForm.name}
                  onChange={e => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-soft-gray mb-1">Kategori</label>
                  <select 
                    value={newProductForm.category}
                    onChange={e => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  >
                    <option value="Serum">Serum</option>
                    <option value="Sunscreen">Sunscreen</option>
                    <option value="Cream">Cream</option>
                    <option value="Cleanser">Cleanser</option>
                  </select>
                </div>

                <div>
                  <label className="block text-soft-gray mb-1">Ukuran / Size</label>
                  <input 
                    type="text" 
                    required
                    placeholder="30 ml / 50 gr"
                    value={newProductForm.size}
                    onChange={e => setNewProductForm({ ...newProductForm, size: e.target.value })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-soft-gray mb-1">Harga (IDR)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="350000"
                    value={newProductForm.price}
                    onChange={e => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-soft-gray mb-1">Stok Awal</label>
                  <input 
                    type="number" 
                    required
                    placeholder="50"
                    value={newProductForm.stock}
                    onChange={e => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-soft-gray mb-1">URL Gambar Produk</label>
                <input 
                  type="text" 
                  required
                  value={newProductForm.imageUrl}
                  onChange={e => setNewProductForm({ ...newProductForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-soft-gray mb-1">Deskripsi Singkat</label>
                <textarea 
                  rows={2}
                  placeholder="Keterangan manfaat produk..."
                  value={newProductForm.description}
                  onChange={e => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-3 py-1.5 border border-gold/20 text-soft-gray rounded-xs"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-gold text-white font-medium rounded-xs hover:bg-gold-light"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-gold/20 w-full max-w-md p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gold/10">
              <h3 className="font-serif text-lg text-charcoal">Edit Produk Skincare</h3>
              <button onClick={() => setEditingProduct(null)} className="text-soft-gray hover:text-charcoal">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-soft-gray mb-1">Nama Produk</label>
                <input 
                  type="text" 
                  required
                  value={editProductForm.name}
                  onChange={e => setEditProductForm({ ...editProductForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-soft-gray mb-1">Kategori</label>
                  <select 
                    value={editProductForm.category}
                    onChange={e => setEditProductForm({ ...editProductForm, category: e.target.value })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  >
                    <option value="Serum">Serum</option>
                    <option value="Sunscreen">Sunscreen</option>
                    <option value="Cream">Cream</option>
                    <option value="Cleanser">Cleanser</option>
                  </select>
                </div>

                <div>
                  <label className="block text-soft-gray mb-1">Ukuran / Size</label>
                  <input 
                    type="text" 
                    required
                    value={editProductForm.size}
                    onChange={e => setEditProductForm({ ...editProductForm, size: e.target.value })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-soft-gray mb-1">Harga (IDR)</label>
                  <input 
                    type="number" 
                    required
                    value={editProductForm.price}
                    onChange={e => setEditProductForm({ ...editProductForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-soft-gray mb-1">Stok Barang</label>
                  <input 
                    type="number" 
                    required
                    value={editProductForm.stock}
                    onChange={e => setEditProductForm({ ...editProductForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-soft-gray mb-1">URL Gambar Produk</label>
                <input 
                  type="text" 
                  required
                  value={editProductForm.imageUrl}
                  onChange={e => setEditProductForm({ ...editProductForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-soft-gray mb-1">Deskripsi Singkat</label>
                <textarea 
                  rows={2}
                  value={editProductForm.description}
                  onChange={e => setEditProductForm({ ...editProductForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-1.5 border border-gold/20 text-soft-gray rounded-xs"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-gold text-white font-medium rounded-xs hover:bg-gold-light"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL PURCHASE RECEIPT */}
      {selectedPurchase && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-gold/20 w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gold/10">
              <div>
                <span className="text-[10px] text-gold font-bold uppercase">Bukti Transaksi</span>
                <h3 className="font-serif text-lg text-charcoal">{selectedPurchase.id}</h3>
              </div>
              <button onClick={() => setSelectedPurchase(null)} className="text-soft-gray hover:text-charcoal">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-cream/30 p-3 rounded-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-soft-gray">Pelanggan:</span>
                  <span className="font-semibold text-charcoal">{selectedPurchase.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-soft-gray">No. Telepon:</span>
                  <span className="text-charcoal">{selectedPurchase.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-soft-gray">Tanggal:</span>
                  <span className="text-charcoal">{selectedPurchase.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-soft-gray">Cabang Pembelian:</span>
                  <span className="text-charcoal">{selectedPurchase.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-soft-gray">Metode Pembayaran:</span>
                  <span className="font-medium text-gold">{selectedPurchase.paymentMethod}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-charcoal border-b border-gold/10 pb-1">Item Produk:</div>
                {selectedPurchase.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-gold/5">
                    <div>
                      <div className="font-medium text-charcoal">{item.productName} ({item.size})</div>
                      <div className="text-[10px] text-soft-gray">{item.quantity} x {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.pricePerUnit)}</div>
                    </div>
                    <div className="font-semibold text-charcoal">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.quantity * item.pricePerUnit)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gold/15 text-sm font-bold text-charcoal">
                <span>Total Pembayaran:</span>
                <span className="text-gold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedPurchase.totalAmount)}</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-soft-gray">Ubah Status:</span>
                <div className="flex gap-1">
                  {(['Lunas', 'Dikirim', 'Selesai', 'Dibatalkan'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        handleUpdatePurchaseStatus(selectedPurchase.id, st);
                        setSelectedPurchase({ ...selectedPurchase, status: st });
                      }}
                      className={`px-2 py-1 text-[10px] rounded-xs ${
                        selectedPurchase.status === st 
                          ? 'bg-gold text-white font-bold' 
                          : 'bg-cream text-soft-gray hover:text-charcoal'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setSelectedPurchase(null)}
                className="px-4 py-1.5 bg-charcoal text-white text-xs rounded-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW TREATMENT */}
      {isNewTreatmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-gold/20 w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gold/10">
              <h3 className="font-serif text-lg text-charcoal">Tambah Perawatan Baru</h3>
              <button onClick={() => setIsNewTreatmentModalOpen(false)} className="text-soft-gray hover:text-charcoal">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTreatment} className="space-y-3 text-xs">
              <div>
                <label className="block text-soft-gray mb-1">Nama Perawatan</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Silk Peel Hydrodermabrasion"
                  value={newTreatment.name}
                  onChange={e => setNewTreatment({ ...newTreatment, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-soft-gray mb-1">Kategori</label>
                  <select 
                    value={newTreatment.category}
                    onChange={e => setNewTreatment({ ...newTreatment, category: e.target.value })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  >
                    <option value="Laser & Light">Laser & Light</option>
                    <option value="Facial & Cleansing">Facial & Cleansing</option>
                    <option value="Anti-Aging">Anti-Aging</option>
                    <option value="Acne Care">Acne Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-soft-gray mb-1">Durasi</label>
                  <input 
                    type="text" 
                    required
                    placeholder="60 Menit"
                    value={newTreatment.duration}
                    onChange={e => setNewTreatment({ ...newTreatment, duration: e.target.value })}
                    className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-soft-gray mb-1">Deskripsi Singkat</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Jelaskan manfaat perawatan..."
                  value={newTreatment.description}
                  onChange={e => setNewTreatment({ ...newTreatment, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-cream/20 border border-gold/20 rounded-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsNewTreatmentModalOpen(false)}
                  className="px-3 py-1.5 border border-gold/20 text-soft-gray rounded-xs"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-gold text-white font-medium rounded-xs hover:bg-gold-light"
                >
                  Simpan Perawatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
