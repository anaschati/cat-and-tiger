import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, HelpCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import authDataRaw from '../data/auth.json';
import type { AuthData } from '../data/types';

const authData = authDataRaw as unknown as AuthData;

interface LockScreenProps {
  onUnlock: () => void;
}

// Les 3 phases possibles de l'écran de verrouillage
type AuthPhase = 'username' | 'password' | '2fa';

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [phase, setPhase] = useState<AuthPhase>('username');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400); 
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phase === 'username') {
      if (username.toLowerCase() === authData.username.answer.toLowerCase()) {
        setPhase('password');
        setFailedAttempts(0); // On reset les erreurs pour l'étape suivante
      } else {
        setFailedAttempts(prev => prev + 1);
        triggerShake();
      }
    } else if (phase === 'password') {
      if (password.toLowerCase() === authData.pwd.answer.toLowerCase()) {
        setPhase('2fa');
        setFailedAttempts(0);
      } else {
        setFailedAttempts(prev => prev + 1);
        triggerShake();
      }
    }
  };

  const handle2FAChoice = (choice: string) => {
    if (choice === authData.twoFactor.answer) {
      onUnlock(); 
    } else {
      triggerShake();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fdfbf7' }}>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, x: isShaking ? [-10, 10, -10, 10, 0] : 0 }}
        transition={{ duration: isShaking ? 0.4 : 0.5 }}
        style={{ padding: '2.5rem', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', textAlign: 'center', width: '100%', maxWidth: '450px', overflow: 'hidden' }}
      >
        
        {phase === 'username' || phase === 'password' ? (
          <>
            <Lock size={48} color="#ff7eb3" style={{ marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Accès Restreint</h2>
            
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              {/* CHAMP IDENTIFIANT */}
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder={authData.username.question} 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={phase !== 'username'} // Se désactive quand on passe au mot de passe
                  style={{ 
                    width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '12px', 
                    border: '1px solid #eee', fontSize: '1rem', 
                    backgroundColor: phase === 'password' ? '#f0f0f0' : '#fafafa',
                    color: phase === 'password' ? '#888' : '#333',
                    transition: 'all 0.3s'
                  }}
                />
                {/* Petite icône de validation qui apparaît quand on passe au mot de passe */}
                <AnimatePresence>
                  {phase === 'password' && (
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ position: 'absolute', right: '1rem', top: '1rem' }}>
                      <CheckCircle2 color="#4ade80" size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CHAMP MOT DE PASSE (Animé) */}
              <AnimatePresence>
                {phase === 'password' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -20 }} 
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <input 
                      type="password" 
                      placeholder={authData.pwd.question} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '12px', border: '1px solid #eee', fontSize: '1rem', backgroundColor: '#fafafa' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AFFICHAGE DES INDICES (Après 3 tentatives) */}
              <AnimatePresence>
                {failedAttempts >= 3 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ color: '#ff7eb3', fontSize: '0.9rem', textAlign: 'left', backgroundColor: '#fff0f5', padding: '1rem', borderRadius: '12px', overflow: 'hidden' }}
                  >
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <HelpCircle size={16} /> Indice :
                    </p>
                    <p style={{ margin: 0 }}>
                      {phase === 'username' ? authData.username.hints![0] : authData.pwd.hints![0]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit"
                style={{ padding: '1rem', borderRadius: '12px', border: 'none', backgroundColor: '#ff7eb3', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }}
              >
                {phase === 'username' ? 'Continuer' : 'Déverrouiller'}
              </button>
            </form>
          </>
        ) : (
          /* --- ÉTAPE 2 : DOUBLE VÉRIFICATION (Inchangée) --- */
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <ShieldCheck size={56} color="#4ade80" style={{ marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '0.5rem', color: '#333', fontSize: '1.4rem' }}>Double vérification</h2>
            <p style={{ marginBottom: '2rem', color: '#666', fontSize: '0.95rem' }}>
              {authData.twoFactor.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {authData.twoFactor.choices!.map((choice, index) => (
                <button 
                  key={index}
                  onClick={() => handle2FAChoice(choice)}
                  style={{ padding: '1rem', borderRadius: '12px', border: '2px solid #f0f0f0', backgroundColor: 'white', color: '#444', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#ff7eb3')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#f0f0f0')}
                >
                  {choice}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}