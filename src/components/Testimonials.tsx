import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Amanda R.',
    role: 'Entrepreneur',
    content: 'Pelayanan yang sangat luar biasa. Dokter sangat detail menjelaskan kondisi kulit saya, dan hasil perawatan Pico Laser-nya terlihat sejak sesi pertama. Klinik sangat nyaman dan mewah.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 2,
    name: 'Jessica T.',
    role: 'Content Creator',
    content: 'Saya selalu mempercayakan perawatan kulit saya di Aura Beauty. Seluruh staf ramah, tempatnya bersih, dan teknologi yang digunakan sangat canggih. The best aesthetic clinic in town!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 3,
    name: 'Michelle K.',
    role: 'Corporate Executive',
    content: 'Sebagai orang yang sibuk, saya sangat menghargai ketepatan waktu di sini. Perawatan Diamond Lift Contour sangat efektif untuk relaksasi sekaligus menjaga kekencangan kulit wajah saya.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200'
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white border-t border-nude">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-gold uppercase mb-2 block">
            CLIENT TESTIMONIALS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight mb-4">Pengalaman Klien Aura</h2>
          <p className="text-charcoal/70 text-balance">
            Kepuasan dan senyum percaya diri klien adalah pencapaian terbesar kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-nude/20 p-8 rounded-sm border border-nude relative">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-charcoal/80 leading-relaxed mb-8 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover border border-gold/30"
                />
                <div>
                  <h5 className="font-serif text-lg text-charcoal leading-none mb-1">{testimonial.name}</h5>
                  <span className="text-xs text-charcoal/50 uppercase tracking-wider">{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
