// useSongLoader.js
import { useState, useEffect } from 'react';
import templateData from '../data/template.json'; // local static import

/**
 * Minimal loader:
 * - Always uses src/data/template.json as seed data.
 * - No fetch calls.
 */
export function useSongLoader() {
  const [seed, setSeed] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    setStatus('loading');
    // simulate async load if needed
    setTimeout(() => {
      // pick first item — or random if you prefer
      const first = templateData[0];
      setSeed({
        title: first?.title || '',
        artist: first?.artist || '',
        album: first?.album || '',
        year: first?.year || new Date().getFullYear(),
        genre: first?.genre || first?.type || '',
        themes: Array.isArray(first?.themes) ? first.themes : [],
        lyrics: first?.lyrics || ''
      });
      setStatus('ready');
    }, 0);
  }, []);

  return { seed, status, allTemplates: templateData };
}

export default useSongLoader;
