import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import des styles vitaux pour que Swiper fonctionne bien
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import type { Memory } from '../data/types';

interface MemoryModalProps {
  memory: Memory;
  onClose: () => void;
}

export default function MemoryModal({ memory, onClose }: MemoryModalProps) {
  return (
    // L'arrière-plan grisé et cliquable pour fermer
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000 // S'assure de passer par-dessus la carte
      }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          width: '80vw', height: '80vh', backgroundColor: 'white',
          borderRadius: '24px', overflow: 'hidden', display: 'flex',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique DANS la boîte
      >
        {/* Bouton Fermer */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10,
            background: 'white', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          <X color="#333" size={24} />
        </button>

        {/* --- MOITIÉ GAUCHE : SLIDESHOW --- */}
        <div style={{ width: '50%', height: '100%', backgroundColor: '#f0f0f0' }}>
          {memory.images && memory.images.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              style={{ width: '100%', height: '100%' }}
            >
              {memory.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img 
                    src={img} 
                    alt={`Souvenir ${index + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            // Fallback s'il n'y a pas d'images pour ce souvenir
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
              <p>Pas de photo pour ce souvenir 📸</p>
            </div>
          )}
        </div>

        {/* --- MOITIÉ DROITE : TEXTE (Proportions strictes) --- */}
        <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', padding: '3rem 4rem' }}>
          
          {/* HAUT (20%) : Date */}
          <div style={{ height: '20%', display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              backgroundColor: '#fff0f5', color: '#ff7eb3', padding: '0.5rem 1.2rem', 
              borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase'
            }}>
              {memory.displayDate}
            </span>
          </div>

          {/* MILIEU (20%) : Titre */}
          <div style={{ height: '20%', display: 'flex', alignItems: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#222', margin: 0, lineHeight: 1.1 }}>
              {memory.title}
            </h2>
          </div>

          {/* BAS (60%) : Description */}
          <div style={{ height: '60%', overflowY: 'auto', paddingTop: '1rem' }}>
            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.8, margin: 0 }}>
              {memory.description}
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}