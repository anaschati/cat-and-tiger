import { useState } from 'react';
import LockScreen from './components/LockScreen';
import MapCanvas from './components/MapCanvas';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LockScreen onUnlock={() => setIsAuthenticated(true)} />;
  }

  // L'écran est déverrouillé, on affiche la carte !
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <MapCanvas />
    </div>
  );
}