import { useState, useRef, useEffect } from 'react';
import Map, { Marker, type MapRef } from 'react-map-gl/mapbox';
import { MapPin, Map as MapIcon, Play } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import 'mapbox-gl/dist/mapbox-gl.css';

import memoriesDataRaw from '../data/memories.json';
import { type Memory } from '../data/types';
import MemoryModal from './MemoryModal';
import FloatingPanel from './FloatingPanel';
import Timeline from './Timeline';

const { memories } = memoriesDataRaw as unknown as { memories: Memory[] };
type ViewMode = 'exploration' | 'narrative';

export default function MapCanvas() {
  const [viewMode, setViewMode] = useState<ViewMode>('narrative');
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const currentNarrativeMemory = memories[narrativeIndex];
  
  const mapRef = useRef<MapRef>(null);

  // Détection du mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Le vol de la caméra
  useEffect(() => {
    if (!mapRef.current) return;

    if (viewMode === 'narrative') {
      const memory = memories[narrativeIndex];
      
      // On sécurise le padding pour Mapbox (nombres entiers uniquement)
      const paddingOptions = isMobile 
        ? { left: 0, right: 0, top: 0, bottom: Math.round(window.innerHeight * 0.45) } 
        : { left: 450, right: 0, top: 0, bottom: 0 };
      
      mapRef.current.flyTo({
        center: [memory.coordinates[0], memory.coordinates[1]],
        zoom: memory.zoomLevel || 14,
        speed: 0.6, 
        curve: 1.1, 
        padding: paddingOptions, 
        essential: true
      });
    } else if (viewMode === 'exploration') {
      mapRef.current.easeTo({
        padding: { left: 0, right: 0, top: 0, bottom: 0 },
        duration: 800 
      });
    }
  }, [narrativeIndex, viewMode, isMobile]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
      
      {/* LE TOGGLE DES MODES (Ajusté pour mobile) */}
      <div style={{
        position: 'absolute', 
        top: isMobile ? '1rem' : '2rem', 
        right: isMobile ? '1rem' : '2rem', 
        zIndex: 20,
        backgroundColor: 'white', borderRadius: '30px', padding: '0.4rem',
        display: 'flex', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => { setViewMode('exploration'); setSelectedMemory(null); }}
          style={{
            padding: isMobile ? '0.5rem 0.8rem' : '0.6rem 1.2rem', 
            borderRadius: '25px', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: viewMode === 'exploration' ? '#ff7eb3' : 'transparent',
            color: viewMode === 'exploration' ? 'white' : '#666',
            fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s',
            fontSize: isMobile ? '0.85rem' : '1rem'
          }}
        >
          <MapIcon size={18} /> Exploration
        </button>
        <button
          onClick={() => { setViewMode('narrative'); setSelectedMemory(null); }}
          style={{
            padding: isMobile ? '0.5rem 0.8rem' : '0.6rem 1.2rem', 
            borderRadius: '25px', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: viewMode === 'narrative' ? '#ff7eb3' : 'transparent',
            color: viewMode === 'narrative' ? 'white' : '#666',
            fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s',
            fontSize: isMobile ? '0.85rem' : '1rem'
          }}
        >
          <Play size={18} /> Narratif
        </button>
      </div>

      {/* LA CARTE */}
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{ longitude: 13.0038, latitude: 55.6050, zoom: 4 }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        attributionControl={false}
      >
        {memories.map((memory) => {
          const isCurrentNarrative = viewMode === 'narrative' && memory.id === currentNarrativeMemory.id;
          const shouldShowPin = viewMode === 'exploration' || isCurrentNarrative;

          if (!shouldShowPin) return null;

          return (
            <Marker 
              key={memory.id} 
              longitude={memory.coordinates[0]} 
              latitude={memory.coordinates[1]}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                if (viewMode === 'exploration') setSelectedMemory(memory);
              }}
            >
              <div 
                style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                  transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: isCurrentNarrative || hoveredPinId === memory.id ? 'scale(1.3)' : 'scale(1)' 
                }}
                onMouseEnter={() => setHoveredPinId(memory.id)}
                onMouseLeave={() => setHoveredPinId(null)}
              >
                {(hoveredPinId === memory.id || isCurrentNarrative) && memory.lieu && (
                  <div style={{
                    backgroundColor: 'white', padding: '4px 10px', borderRadius: '12px',
                    fontSize: '0.85rem', fontWeight: 'bold', color: '#333',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)', marginBottom: '6px', whiteSpace: 'nowrap',
                  }}>
                    {memory.lieu}
                  </div>
                )}
                <MapPin size={32} color={isCurrentNarrative ? "#f43f5e" : "#ff7eb3"} fill="#fff0f5" />
              </div>
            </Marker>
          );
        })}
      </Map>

      {/* INTERFACES */}
      <AnimatePresence>
        {viewMode === 'exploration' && selectedMemory && (
          <MemoryModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewMode === 'narrative' && (
          <>
            <FloatingPanel memory={currentNarrativeMemory} isMobile={isMobile} />
            <Timeline 
              memories={memories} 
              currentIndex={narrativeIndex} 
              onNavigate={(index) => setNarrativeIndex(index)} 
              isMobile={isMobile}
            />
          </>
        )}
      </AnimatePresence>

    </div>
  );
}