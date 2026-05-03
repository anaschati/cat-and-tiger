import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Memory } from '../data/types';

interface FloatingPanelProps {
  memory: Memory;
}

export default function FloatingPanel({ memory }: FloatingPanelProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={memory.id} // Déclenche l'animation au changement de souvenir
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'absolute', top: '5%', left: '2rem',
          width: '400px', height: '80%', // Ne prend pas toute la hauteur pour laisser respirer la carte
          backgroundColor: 'white', borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', zIndex: 10
        }}
      >
        {/* HAUT : Carrousel (45% de la hauteur) */}
        <div style={{ height: '45%', width: '100%', backgroundColor: '#f0f0f0' }}>
          {memory.images && memory.images.length > 0 ? (
            <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} style={{ width: '100%', height: '100%' }}>
              {memory.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img src={img} alt={`Souvenir ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
              <p>Pas de photo 📸</p>
            </div>
          )}
        </div>

        {/* BAS : Texte (55% de la hauteur) */}
        <div style={{ padding: '2rem', height: '55%', display: 'flex', flexDirection: 'column' }}>
          <span style={{ 
            backgroundColor: '#fff0f5', color: '#ff7eb3', padding: '0.4rem 1rem', 
            borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '1px', 
            textTransform: 'uppercase', alignSelf: 'flex-start', marginBottom: '1rem'
          }}>
            {memory.displayDate}
          </span>
          
          <h2 style={{ fontSize: '1.8rem', color: '#222', margin: '0 0 1rem 0', lineHeight: 1.2 }}>
            {memory.title}
          </h2>
          
          <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '0.5rem' }}>
            <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.6, margin: 0 }}>
              {memory.description}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}