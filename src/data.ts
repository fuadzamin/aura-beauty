import { Treatment, Product } from './types';

export const TREATMENTS: Treatment[] = [
  {
    id: 't1',
    name: 'Aura Radiance Pico Laser',
    category: 'Laser & Light',
    duration: '45 Menit',
    description: 'Mencerahkan flek hitam, mengecilkan pori-pori, dan merangsang kolagen secara instan.',
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800', // Placeholder for luxury treatment
    downtime: 'No downtime (Tanpa waktu pemulihan)',
    benefits: ['Flek hitam memudar', 'Warna kulit lebih merata', 'Pori-pori mengecil', 'Tekstur kulit lebih halus'],
    procedure: ['Pembersihan wajah ganda (Double Cleansing)', 'Aplikasi krim anestesi (Opsional)', 'Tindakan Pico Laser oleh Dokter', 'Pendinginan dan Soothing Mask']
  },
  {
    id: 't2',
    name: 'Crystal Clear Facial',
    category: 'Facial & Cleansing',
    duration: '60 Menit',
    description: 'Pembersihan mendalam komedo, ekstraksi tanpa rasa sakit, dan hidrasi maksimal untuk kulit bercahaya.',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    downtime: 'No downtime',
    benefits: ['Kulit bersih bebas komedo', 'Lebih lembap dan terhidrasi', 'Cerah seketika', 'Sirkulasi darah di wajah lebih lancar'],
    procedure: ['Cleansing & Toning', 'Eksfoliasi enzim ringan', 'Ekstraksi komedo tanpa rasa sakit', 'Pemijatan relaksasi wajah', 'Masker hidrasi mendalam']
  },
  {
    id: 't3',
    name: 'Diamond Lift Contour',
    category: 'Anti-Aging',
    duration: '90 Menit',
    description: 'Perawatan anti-aging non-invasif untuk mengencangkan kulit wajah dan mendefinisikan rahang.',
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800',
    downtime: 'Kemerahan ringan (hilang dalam 1-2 jam)',
    benefits: ['Kulit wajah lebih kencang (Lifting)', 'Garis halus tersamarkan', 'V-shape contouring rahang', 'Stimulasi kolagen jangka panjang'],
    procedure: ['Pembersihan wajah', 'Aplikasi gel konduktor', 'Tindakan Radio Frequency (RF) & Ultrasound', 'Pemijatan lymphatic drainage', 'Masker emas kolagen']
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Gentle Amino Radiant Cleansing Foam',
    category: 'Skincare',
    imageUrl: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=800',
    description: 'Pembersih wajah dengan formula asam amino lembut yang membersihkan pori secara menyeluruh tanpa membuat kulit kering.',
    variants: [
      { size: '100ml', stock: 40, price: 95000 }
    ]
  },
  {
    id: 'p2',
    name: 'Cica Exfoliating Essence Toner',
    category: 'Skincare',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    description: 'Toner eksfoliasi lembut dengan ekstrak Centella Asiatica untuk menenangkan kulit berjerawat dan meratakan tekstur.',
    variants: [
      { size: '150ml', stock: 40, price: 110000 }
    ]
  },
  {
    id: 'p3',
    name: 'Advanced Brightening 10% Niacinamide Serum',
    category: 'Skincare',
    imageUrl: 'https://images.unsplash.com/photo-1608248593842-898031535728?auto=format&fit=crop&q=80&w=800',
    description: 'Serum pencerah konsentrat tinggi untuk memudarkan noda hitam, mengontrol sebum berlebih, dan mencerahkan warna kulit.',
    variants: [
      { size: '20ml', stock: 40, price: 145000 },
      { size: '50ml', stock: 40, price: 250000 }
    ]
  },
  {
    id: 'p4',
    name: 'Luminous Hydration Barrier Crème',
    category: 'Skincare',
    imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800',
    description: 'Krim pelembap dengan ceramide & hyaluronic acid untuk mengunci kelembapan dan memperkuat skin barrier.',
    variants: [
      { size: '30g', stock: 25, price: 175000 },
      { size: '50g', stock: 30, price: 240000 }
    ]
  }
];
