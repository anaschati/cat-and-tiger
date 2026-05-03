import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type Memory } from '../data/types';

interface TimelineProps {
  memories: Memory[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  isMobile: boolean;
}

export default function Timeline({ memories, currentIndex, onNavigate, isMobile }: TimelineProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === memories.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      style={{
        position: 'absolute', 
        bottom: isMobile ? '1rem' : '2rem', 
        left: '50%', 
        // 2. On SUPPRIME la ligne transform: 'translateX(-50%)' qui était ici !
        backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
        padding: isMobile ? '0.6rem 1rem' : '0.8rem 1.5rem', 
        borderRadius: '50px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', 
        gap: isMobile ? '0.8rem' : '2rem',
        width: isMobile ? '92%' : 'auto', 
        justifyContent: 'center',
        zIndex: 10
      }}
    >
      <button 
        onClick={() => !isFirst && onNavigate(currentIndex - 1)}
        disabled={isFirst}
        style={{ background: 'none', border: 'none', cursor: isFirst ? 'default' : 'pointer', opacity: isFirst ? 0.3 : 1, display: 'flex', alignItems: 'center' }}
      >
        <ChevronLeft size={isMobile ? 24 : 28} color="#333" />
      </button>

      {/* Le container des points de la frise */}
      <div style={{ display: 'flex', gap: isMobile ? '0.4rem' : '0.8rem', overflowX: 'auto', padding: '2px' }}>
        {memories.map((_, index) => (
          <div 
            key={index}
            onClick={() => onNavigate(index)}
            style={{
              width: currentIndex === index ? (isMobile ? '16px' : '24px') : (isMobile ? '6px' : '8px'),
              height: isMobile ? '6px' : '8px',
              borderRadius: '8px',
              backgroundColor: currentIndex === index ? '#ff7eb3' : '#ddd',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }}
          />
        ))}
      </div>

      <button 
        onClick={() => !isLast && onNavigate(currentIndex + 1)}
        disabled={isLast}
        style={{ background: 'none', border: 'none', cursor: isLast ? 'default' : 'pointer', opacity: isLast ? 0.3 : 1, display: 'flex', alignItems: 'center' }}
      >
        <ChevronRight size={isMobile ? 24 : 28} color="#333" />
      </button>
    </motion.div>
  );
}