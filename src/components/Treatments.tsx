import { useState } from 'react';
import { TREATMENTS } from '../data';
import { Clock } from 'lucide-react';
import { Treatment } from '../types';
import TreatmentDetailModal from './TreatmentDetailModal';

interface TreatmentsProps {
  onBookClick: () => void;
}

export default function Treatments({ onBookClick }: TreatmentsProps) {
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  
  const tabs = ['Semua', 'Brightening', 'Anti-Aging', 'Slimming & Contour'];
  
  const filteredTreatments = activeTab === 'Semua' 
    ? TREATMENTS 
    : TREATMENTS.filter(t => t.category.includes(activeTab) || activeTab.includes(t.category.split(' ')[0])); // Simple filter for demo

  return (
    <section id="treatments" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-rose-brand uppercase mb-2 block">
            AURA CLINIC PROTOCOLS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight mb-4">Popular Treatments</h2>
          <p className="text-charcoal/70 text-balance">Perawatan estetika medis yang dirancang khusus untuk memancarkan aura kecantikan sejati Anda.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-medium transition-all rounded-sm border ${
                activeTab === tab 
                  ? 'bg-gold text-white border-gold' 
                  : 'bg-white text-charcoal border-nude hover:border-gold'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTreatments.map(treatment => (
            <div key={treatment.id} className="group flex flex-col bg-cream border border-nude/50 rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300">
              <div 
                className="relative aspect-[4/3] overflow-hidden bg-nude cursor-pointer"
                onClick={() => setSelectedTreatment(treatment)}
              >
                <img 
                  src={treatment.imageUrl} 
                  alt={treatment.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 flex items-center gap-1.5 rounded-sm">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span className="text-[11px] font-semibold text-charcoal uppercase tracking-wider">{treatment.duration}</span>
                </div>
              </div>
              
              <div className="flex flex-col flex-grow p-6">
                <span className="text-xs font-semibold tracking-wider text-gold uppercase mb-2">{treatment.category}</span>
                <h3 
                  className="font-serif text-2xl text-charcoal mb-3 cursor-pointer hover:text-gold transition-colors"
                  onClick={() => setSelectedTreatment(treatment)}
                >
                  {treatment.name}
                </h3>
                <p className="text-sm text-charcoal/70 leading-relaxed mb-6 flex-grow">{treatment.description}</p>
                
                <div className="flex flex-col gap-2.5 mt-auto">
                  <button 
                    onClick={onBookClick}
                    className="w-full py-2.5 bg-gold text-white text-sm font-medium hover:bg-gold-light transition-colors rounded-sm shadow-sm"
                  >
                    Booking Sekarang
                  </button>
                  <button 
                    onClick={() => setSelectedTreatment(treatment)}
                    className="w-full text-center text-xs text-charcoal/60 hover:text-gold font-medium transition-colors py-1"
                  >
                    Lihat Detail Treatment &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TreatmentDetailModal 
        treatment={selectedTreatment}
        isOpen={selectedTreatment !== null}
        onClose={() => setSelectedTreatment(null)}
        onBookClick={onBookClick}
      />
    </section>
  );
}
