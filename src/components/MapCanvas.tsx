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
  const [viewMode, setViewMode] = useState<ViewMode>('exploration');
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const currentNarrativeMemory = memories[narrativeIndex];

  // 1. On crée une référence pour manipuler la carte
  const mapRef = useRef<MapRef>(null);

  // 2. L'effet qui déclenche le vol de la caméra
  // 2. L'effet qui déclenche le vol de la caméra (Mis à jour)
  useEffect(() => {
    if (!mapRef.current) return;

    if (viewMode === 'narrative') {
      const memory = memories[narrativeIndex];
      
      mapRef.current.flyTo({
        center: [memory.coordinates[0], memory.coordinates[1]],
        zoom: memory.zoomLevel || 14,
        speed: 1.1, 
        curve: 1.1, 
        padding: { left: 450, right: 0, top: 0, bottom: 0 }, 
        essential: true
      });
    } else if (viewMode === 'exploration') {
      // Quand on repasse en exploration, on retire le padding en douceur
      // sans forcer le déplacement de la caméra (l'utilisateur reste où il est)
      mapRef.current.easeTo({
        padding: { left: 0, right: 0, top: 0, bottom: 0 },
        duration: 800 // Une belle petite animation de 0.8 seconde pour se recentrer
      });
    }
  }, [narrativeIndex, viewMode]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
      
      {/* LE TOGGLE DES MODES */}
      <div style={{
        position: 'absolute', top: '2rem', right: '2rem', zIndex: 20,
        backgroundColor: 'white', borderRadius: '30px', padding: '0.4rem',
        display: 'flex', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => {
            setViewMode('exploration');
            setSelectedMemory(null);
          }}
          style={{
            padding: '0.6rem 1.2rem', borderRadius: '25px', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: viewMode === 'exploration' ? '#ff7eb3' : 'transparent',
            color: viewMode === 'exploration' ? 'white' : '#666',
            fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s'
          }}
        >
          <MapIcon size={18} /> Exploration
        </button>
        <button
          onClick={() => {
            setViewMode('narrative');
            setSelectedMemory(null);
          }}
          style={{
            padding: '0.6rem 1.2rem', borderRadius: '25px', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: viewMode === 'narrative' ? '#ff7eb3' : 'transparent',
            color: viewMode === 'narrative' ? 'white' : '#666',
            fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s'
          }}
        >
          <Play size={18} /> Narratif
        </button>
      </div>

      {/* LA CARTE */}
      <Map
        ref={mapRef} // On accroche notre référence ici
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 13.0038,
          latitude: 55.6050,
          zoom: 4
        }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        attributionControl={false}
      >
        {memories.map((memory) => {
          // On détermine si ce pin précis est le point actif du mode narratif
          const isCurrentNarrative = viewMode === 'narrative' && memory.id === currentNarrativeMemory.id;
          
          // On affiche le pin SI on est en exploration OU SI c'est le pin actif du mode narratif
          const shouldShowPin = viewMode === 'exploration' || isCurrentNarrative;

          // Si on ne doit pas l'afficher, on ne rend rien du tout (le pin disparaît)
          if (!shouldShowPin) return null;

          return (
            <Marker 
              key={memory.id} 
              longitude={memory.coordinates[0]} 
              latitude={memory.coordinates[1]}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                if (viewMode === 'exploration') {
                  setSelectedMemory(memory);
                }
              }}
            >
              <div 
                style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                  transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: isCurrentNarrative || hoveredPinId === memory.id 
                    ? 'scale(1.3)' 
                    : 'scale(1)' 
                }}
                onMouseEnter={() => setHoveredPinId(memory.id)}
                onMouseLeave={() => setHoveredPinId(null)}
              >
                {/* On affiche le label au survol OU tout le temps si c'est le pin actif du mode narratif */}
                {(hoveredPinId === memory.id || isCurrentNarrative) && memory.lieu && (
                  <div style={{
                    backgroundColor: 'white', padding: '4px 10px', borderRadius: '12px',
                    fontSize: '0.85rem', fontWeight: 'bold', color: '#333',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)', marginBottom: '6px', whiteSpace: 'nowrap',
                  }}>
                    {memory.lieu}
                  </div>
                )}
                <MapPin 
                  size={32} 
                  color={isCurrentNarrative ? "#f43f5e" : "#ff7eb3"} 
                  fill="#fff0f5" 
                />
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
            <FloatingPanel memory={currentNarrativeMemory} />
            <Timeline 
              memories={memories} 
              currentIndex={narrativeIndex} 
              onNavigate={(index) => setNarrativeIndex(index)} 
            />
          </>
        )}
      </AnimatePresence>

    </div>
  );
}