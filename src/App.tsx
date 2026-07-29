/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Branches from './components/Branches';
import Treatments from './components/Treatments';
import Skincare from './components/Skincare';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import CtaSection from './components/CtaSection';
import BookingModal from './components/BookingModal';
import Footer from './components/Footer';

export default function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream flex flex-col font-sans">
      <Navbar onBookClick={() => setIsBookingModalOpen(true)} />
      
      <main className="flex-grow">
        <Hero onBookClick={() => setIsBookingModalOpen(true)} />
        <Branches />
        <About />
        <Treatments onBookClick={() => setIsBookingModalOpen(true)} />
        <Skincare />
        <Gallery />
        <Testimonials />
        <CtaSection onBookClick={() => setIsBookingModalOpen(true)} />
      </main>
      
      <Footer />

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  );
}

