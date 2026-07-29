import { X, Clock, Calendar, CheckCircle2, ShieldCheck, ListOrdered } from 'lucide-react';
import { Treatment } from '../types';

interface TreatmentDetailModalProps {
  treatment: Treatment | null;
  isOpen: boolean;
  onClose: () => void;
  onBookClick: () => void;
}

export default function TreatmentDetailModal({ treatment, isOpen, onClose, onBookClick }: TreatmentDetailModalProps) {
  if (!isOpen || !treatment) return null;

  const handleBookNow = () => {
    onClose();
    onBookClick();
  };

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
          <div className="w-full md:w-2/5 relative shrink-0">
            <div className="aspect-[4/3] md:aspect-auto md:h-full w-full relative">
              <img 
                src={treatment.imageUrl} 
                alt={treatment.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent md:hidden" />
              <div className="absolute bottom-4 left-4 md:hidden text-white">
                <span className="text-xs font-semibold tracking-wider text-gold uppercase mb-1 block">{treatment.category}</span>
                <h2 className="font-serif text-2xl">{treatment.name}</h2>
              </div>
            </div>
          </div>

          {/* Details Side */}
          <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col bg-white">
            <div className="hidden md:block">
              <span className="text-xs font-semibold tracking-wider text-gold uppercase mb-2 block">{treatment.category}</span>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">{treatment.name}</h2>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gold/10">
              <div className="flex items-center gap-1.5 text-sm text-charcoal/70 bg-nude/50 px-3 py-1.5 rounded-sm">
                <Clock className="w-4 h-4 text-gold" />
                <span>Durasi: <strong>{treatment.duration}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-charcoal/70 bg-nude/50 px-3 py-1.5 rounded-sm">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>Dermatologist Tested</span>
              </div>
            </div>

            {/* Treatment Information */}
            <div className="space-y-8 flex-grow">
              
              <div>
                <h4 className="font-serif text-xl text-charcoal mb-3">Overview</h4>
                <p className="text-charcoal/80 leading-relaxed text-sm md:text-base text-balance">
                  {treatment.description}
                </p>
              </div>

              {treatment.benefits && (
                <div>
                  <h4 className="font-serif text-xl text-charcoal mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-gold" />
                    Hasil yang Diharapkan
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {treatment.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-charcoal/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {treatment.procedure && (
                <div>
                  <h4 className="font-serif text-xl text-charcoal mb-3 flex items-center gap-2">
                    <ListOrdered className="w-5 h-5 text-gold" />
                    Prosedur Perawatan
                  </h4>
                  <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-nude before:to-transparent">
                    {treatment.procedure.map((step, index) => (
                      <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-nude text-charcoal text-[10px] font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          {index + 1}
                        </div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-sm border border-nude/50 bg-cream/30 text-sm text-charcoal/80 shadow-sm ml-3 md:ml-0">
                          {step}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {treatment.downtime && (
                <div className="bg-gold/5 border border-gold/20 p-4 rounded-sm flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-charcoal mb-1">Downtime (Waktu Pemulihan)</h5>
                    <p className="text-sm text-charcoal/70">{treatment.downtime}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Action Footer for scroll */}
            <div className="mt-8 pt-6 border-t border-gold/20 flex flex-col gap-3">
              <button 
                onClick={handleBookNow}
                className="w-full py-4 bg-gold text-white font-medium text-sm tracking-wide hover:bg-gold-light transition-colors rounded-sm shadow-md uppercase"
              >
                Booking Sekarang
              </button>
              <div className="text-center text-xs text-charcoal/50">
                Masih bingung perawatan mana yang cocok? <a href="#" className="text-gold hover:underline font-medium">Konsultasi Gratis via WhatsApp</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
