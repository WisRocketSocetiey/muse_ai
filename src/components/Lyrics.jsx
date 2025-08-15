// Lyrics.jsx — Editor + Saved Songs (uses LyricsReader for the editor UI)
import React, { useState, useEffect } from 'react';
import styles from './Lyrics.module.css';
import LyricHelper from '../utils/lyricHelper';
import { generateLyrics } from '../utils/genAILyrics';
import { useSongLoader } from '../utils/useSongLoader';
import LyricsReader from './LyricsReader';

export default function Lyrics() {
  // Saved songs + generation context
  const [savedSongs, setSavedSongs] = useState([]);
  const [themes, setThemes] = useState([]);

  // Current doc shown in the reader
  const [currentDoc, setCurrentDoc] = useState({
    title: '',
    artistStyle: '',
    genre: '',
    lyrics: '',
  });

  // UX state
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  // Seed from src/data/template.json
  const { allTemplates } = useSongLoader();

  useEffect(() => {
    if (savedSongs.length === 0 && Array.isArray(allTemplates) && allTemplates.length) {
      const seeded = allTemplates.map((t, i) => ({
        id: `seed-${i}-${Date.now()}`,
        title: t.title || 'Untitled',
        artistStyle: t.artistStyle || t.artist || 'Unspecified style',
        genre: t.genre || t.type || 'Unspecified',
        themes: Array.isArray(t.themes) ? t.themes : [],
        lyrics: t.lyrics || '',
        createdAt: new Date().toLocaleDateString(),
      }));
      setSavedSongs(seeded);
    }
  }, [allTemplates, savedSongs.length]);

  // Generate lyrics using Worker (/api/open)
  const handleGenerate = async () => {
    if (isGenerating) return '';
    setGenError('');
    setIsGenerating(true);
    try {
      const text = await generateLyrics(themes, {
        title: currentDoc.title,
        artistStyle: currentDoc.artistStyle,
        genre: currentDoc.genre,
      });

      // hydrate parent state so sidebar preview stays accurate
      setCurrentDoc((prev) => ({ ...prev, lyrics: text || '' }));
      return text || '';
    } catch (err) {
      console.error('Generation failed:', err);
      const msg = String(err?.message || 'Generation failed');
      setGenError(msg);
      return msg;
    } finally {
      setIsGenerating(false);
    }
  };

  // Save current doc from the reader
  const handleSave = (doc) => {
    if (!doc?.title || !doc?.lyrics) return;
    const newSong = {
      id: Date.now(),
      ...doc,
      themes: Array.isArray(themes) ? themes : [],
      createdAt: new Date().toLocaleDateString(),
    };
    setSavedSongs((prev) => [newSong, ...prev]);
    setCurrentDoc(newSong);
  };

  // Load a saved song into the editor
  const loadSong = (song) => {
    setCurrentDoc({
      title: song.title || '',
      artistStyle: song.artistStyle || '',
      genre: song.genre || '',
      lyrics: song.lyrics || '',
    });
    // If you want to sync the themes from the saved song, uncomment:
    // setThemes(Array.isArray(song.themes) ? song.themes : []);
  };

  const deleteSong = (songId) => {
    setSavedSongs((prev) => prev.filter((song) => song.id !== songId));
    if (currentDoc?.id === songId) {
      setCurrentDoc({ title: '', artistStyle: '', genre: '', lyrics: '' });
    }
  };

  const addTheme = (theme) => {
    const clean = (theme || '').trim();
    if (clean && !themes.includes(clean)) setThemes((t) => [...t, clean]);
  };

  const removeTheme = (themeToRemove) => {
    setThemes((t) => t.filter((theme) => theme !== themeToRemove));
  };

  return (
    <div className={styles.lyricsContainer}>
      <div className={styles.lyricsContent}>
        {/* Left: Themes + Reader */}
        <div className={styles.editorColumn}>
          <div className={styles.themesSection}>
            <h4>THEMES</h4>
            <div className={styles.themesContainer}>
              {themes.map((theme, index) => (
                <span key={index} className={styles.themeTag}>
                  {theme}
                  <button
                    onClick={() => removeTheme(theme)}
                    className={styles.removeTheme}
                    title="Remove theme"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add theme..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addTheme(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                className={styles.themeInput}
              />
            </div>
          </div>

          <LyricsReader
            embed
            showGenerate
            showSave
            initial={currentDoc}
            onGenerate={handleGenerate}
            onSave={handleSave}
            parseLyrics={LyricHelper.parseLyrics}
            getStatistics={LyricHelper.getStatistics}
          />

          {isGenerating && <div className={styles.generatingNote}>Generating…</div>}
          {genError && <div className={styles.errorNote}>{genError}</div>}
        </div>

        {/* Right: Saved Songs */}
        <div className={styles.savedSongs}>
          <div className={styles.sidebarHeader}>
            <h3>Saved Songs ({savedSongs.length})</h3>
          </div>

          <div className={styles.songsList}>
            {savedSongs.length === 0 ? (
              <p className={styles.emptyState}>No saved songs yet</p>
            ) : (
              savedSongs.map((song) => (
                <div key={song.id} className={styles.songItem}>
                  <h4>{song.title}</h4>
                  <p>
                    {song.artistStyle} • {song.genre}
                  </p>
                  {song.themes && song.themes.length > 0 && (
                    <div className={styles.songThemes}>
                      {song.themes.slice(0, 3).map((theme, i) => (
                        <span key={i} className={styles.miniTheme}>
                          {theme}
                        </span>
                      ))}
                      {song.themes.length > 3 && (
                        <span className={styles.moreThemes}>+{song.themes.length - 3}</span>
                      )}
                    </div>
                  )}
                  <span className={styles.date}>{song.createdAt}</span>
                  <div className={styles.songActions}>
                    <button onClick={() => loadSong(song)} className={styles.btnLoad} disabled={isGenerating}>
                      Load
                    </button>
                    <button onClick={() => deleteSong(song.id)} className={styles.btnDelete} disabled={isGenerating}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
