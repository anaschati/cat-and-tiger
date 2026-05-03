import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Memory } from '../data/types';

interface TimelineProps {
  memories: Memory[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function Timeline({ memories, currentIndex, onNavigate }: TimelineProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === memories.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
        padding: '0.8rem 1.5rem', borderRadius: '50px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '2rem', zIndex: 10
      }}
    >
      {/* Bouton Précédent */}
      <button 
        onClick={() => !isFirst && onNavigate(currentIndex - 1)}
        disabled={isFirst}
        style={{
          background: 'none', border: 'none', cursor: isFirst ? 'default' : 'pointer',
          opacity: isFirst ? 0.3 : 1, display: 'flex', alignItems: 'center', transition: 'all 0.2s'
        }}
      >
        <ChevronLeft size={28} color="#333" />
      </button>

      {/* Progression (Les petits points) */}
      <div style={{ display: 'flex', gap: '0.8rem' }}>
        {memories.map((_, index) => (
          <div 
            key={index}
            onClick={() => onNavigate(index)}
            style={{
              width: currentIndex === index ? '24px' : '8px',
              height: '8px',
              borderRadius: '8px',
              backgroundColor: currentIndex === index ? '#ff7eb3' : '#ddd',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Bouton Suivant */}
      <button 
        onClick={() => !isLast && onNavigate(currentIndex + 1)}
        disabled={isLast}
        style={{
          background: 'none', border: 'none', cursor: isLast ? 'default' : 'pointer',
          opacity: isLast ? 0.3 : 1, display: 'flex', alignItems: 'center', transition: 'all 0.2s'
        }}
      >
        <ChevronRight size={28} color="#333" />
      </button>
    </motion.div>
  );
}