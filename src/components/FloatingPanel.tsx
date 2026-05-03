import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { type Memory } from '../data/types';

interface FloatingPanelProps {
  memory: Memory;
  isMobile: boolean; // Ajout de la prop
}

export default function FloatingPanel({ memory, isMobile }: FloatingPanelProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={memory.id}
        // Sur mobile, l'animation vient du bas (y), sur ordi de la gauche (x)
        initial={{ opacity: 0, y: isMobile ? 50 : 0, x: isMobile ? '-50%' : -50 }}
        animate={{ opacity: 1, y: 0, x: isMobile ? '-50%' : 0 }}
        exit={{ opacity: 0, y: isMobile ? 50 : 0, x: isMobile ? '-50%' : -50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'absolute', 
          
          // --- LOGIQUE RESPONSIVE ---
          ...(isMobile ? {
            bottom: '5.5rem', // Juste au-dessus de la frise
            left: '50%',
            width: '92%',
            height: '40vh',
            top: 'auto',
          } : {
            top: '5%', 
            left: '2rem',
            width: '400px', 
            height: '80%',
          }),

          backgroundColor: 'white', borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', zIndex: 10
        }}
      >
        {/* Carrousel (prend un peu moins de place sur mobile pour laisser le texte respirer) */}
        <div style={{ height: isMobile ? '40%' : '45%', width: '100%', backgroundColor: '#f0f0f0' }}>
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

        {/* Texte (padding réduit sur mobile) */}
        <div style={{ padding: isMobile ? '1.2rem' : '2rem', height: isMobile ? '60%' : '55%', display: 'flex', flexDirection: 'column' }}>
          <span style={{ 
            backgroundColor: '#fff0f5', color: '#ff7eb3', padding: '0.4rem 1rem', 
            borderRadius: '20px', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px', 
            textTransform: 'uppercase', alignSelf: 'flex-start', marginBottom: '0.8rem'
          }}>
            {memory.displayDate}
          </span>
          
          <h2 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', color: '#222', margin: '0 0 0.8rem 0', lineHeight: 1.2 }}>
            {memory.title}
          </h2>
          
          <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '0.5rem' }}>
            <p style={{ fontSize: isMobile ? '0.9rem' : '1rem', color: '#555', lineHeight: 1.5, margin: 0 }}>
              {memory.description}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}