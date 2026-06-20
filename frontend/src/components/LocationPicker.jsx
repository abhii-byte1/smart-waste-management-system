import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { buttonTap } from '../utils/motion.js';

const LocationPicker = ({ onLocationSelect }) => {
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleFetchLocation = () => {
    if (!('geolocation' in navigator)) {
      setStatus('error');
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setStatus('loading');
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setStatus('success');
        onLocationSelect(coords);
      },
      (err) => {
        setStatus('error');
        setErrorMessage(err.message || 'Unable to retrieve location.');
        console.error('Geolocation error:', err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="w-full">
      <motion.button
        type="button"
        onClick={handleFetchLocation}
        disabled={status === 'loading'}
        whileHover={status !== 'loading' ? { scale: 1.02 } : {}}
        whileTap={status !== 'loading' ? buttonTap : {}}
        className={`relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border px-4 py-3.5 text-sm font-semibold shadow-sm transition-all duration-300 ${
          status === 'success'
            ? 'border-green-500/30 bg-green-500/10 text-green-400'
            : status === 'error'
            ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
            : 'border-brand-500/30 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20'
        }`}
      >
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Detecting Location...</span>
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Location Secured</span>
            </motion.div>
          )}
          {(status === 'idle' || status === 'error') && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              <span>{status === 'error' ? 'Retry Detecting Location' : 'Detect My Exact Location'}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      <AnimatePresence>
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 text-center text-xs text-red-400"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationPicker;
