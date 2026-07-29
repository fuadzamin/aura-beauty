import { useState } from 'react';
import { Info, PlayCircle } from 'lucide-react';

interface BeforeAfterSliderProps {
  key?: number | string;
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
}

const BeforeAfterSlider = ({ beforeImage, afterImage, title, description }: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  
  return (
    <div className="flex flex-col bg-white rounded-sm border border-nude overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden select-none">
        {/* After Image (Background) */}
        <div className="absolute inset-0 w-full h-full">
          <img src={afterImage} alt="After" className="w-full h-full object-cover" draggable={false} />
        </div>
        
        {/* Before Image (Clipped) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden" 
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img src={beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        </div>

        <input 
          type="range" 
          min="0" max="100" 
          value={sliderPosition} 
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
          aria-label="Before and after slider"
        />
        
        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none z-20"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-nude">
            <div className="flex gap-1">
              <div className="w-0.5 h-3 bg-gold/60" />
              <div className="w-0.5 h-3 bg-gold/60" />
            </div>
          </div>
        </div>

        <div className="absolute top-4 left-4 bg-charcoal/60 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm pointer-events-none z-20">Before</div>
        <div className="absolute top-4 right-4 bg-gold/80 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm pointer-events-none z-20">After</div>
      </div>
      <div className="p-5 border-t border-nude">
        <h4 className="font-serif text-lg text-charcoal mb-1">{title}</h4>
        <p className="text-sm text-charcoal/60">{description}</p>
      </div>
    </div>
  );
};

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const filters = ['Semua', 'Acne Journey', 'Flek Hitam', 'Slimming'];

  const results = [
    {
      id: 1,
      category: 'Acne Journey',
      title: 'Acne Scar Revision',
      description: 'Hasil setelah 4x sesi Glow Pico Laser & Peeling.',
      beforeImage: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800',
      afterImage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 2,
      category: 'Flek Hitam',
      title: 'Melasma Treatment',
      description: 'Pudarnya hiperpigmentasi dalam 8 minggu perawatan.',
      beforeImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
      afterImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 3,
      category: 'Slimming',
      title: 'Jawline Contouring',
      description: 'Hasil V-Shape 1 sesi Diamond Lift Contour.',
      beforeImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
      afterImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    },
  ];

  const filteredResults = activeFilter === 'Semua' 
    ? results 
    : results.filter(r => r.category === activeFilter);

  const videoThumbnails = [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400&h=700',
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=400&h=700',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=700',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=700'
  ];

  return (
    <section id="gallery" className="py-24 bg-nude/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-widest text-rose-brand uppercase mb-2 block">
            REAL PATIENT RESULTS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight mb-4">Galeri Before &amp; After</h2>
          <p className="text-charcoal/70 text-balance">Bukti nyata transformasi kecantikan yang kami tangani dengan dedikasi tinggi.</p>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-gold/5 border border-gold/20 p-4 rounded-sm flex items-start md:items-center gap-3 max-w-3xl mx-auto mb-12">
          <Info className="w-5 h-5 text-gold shrink-0 mt-0.5 md:mt-0" />
          <p className="text-xs md:text-sm text-charcoal/70">
            <strong>Disclaimer:</strong> Hasil perawatan dapat bervariasi pada setiap individu. Semua foto dalam galeri ini adalah 100% asli dari klien Aura Beauty tanpa menggunakan filter atau editan.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 text-sm font-medium transition-all rounded-sm border ${
                activeFilter === filter 
                  ? 'bg-gold text-white border-gold' 
                  : 'bg-white text-charcoal border-nude hover:border-gold'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredResults.map(result => (
            <BeforeAfterSlider 
              key={result.id} 
              beforeImage={result.beforeImage} 
              afterImage={result.afterImage}
              title={result.title}
              description={result.description}
            />
          ))}
        </div>

        {/* Client Video Stories */}
        <div className="pt-16 border-t border-gold/20">
          <h3 className="font-serif text-2xl text-charcoal text-center mb-10">Client Video Stories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videoThumbnails.map((thumb, index) => (
              <div key={index} className="relative aspect-[9/16] bg-charcoal rounded-sm overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all">
                <img 
                  src={thumb} 
                  alt={`Client Story ${index + 1}`} 
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle className="w-10 h-10 text-white/80 group-hover:text-gold transition-colors duration-300" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-xs md:text-sm font-medium leading-snug drop-shadow-md">
                    {index % 2 === 0 ? '"Kulit jadi jauh lebih sehat..."' : '"Hasilnya terlihat sejak sesi pertama!"'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
