// Lyrics.jsx (refactored: keep Sidebar + Themes; delegate editor to LyricsReader)
import React, { useState, useEffect } from 'react';
import styles from './Lyrics.module.css';
import LyricHelper from '../utils/lyricHelper';
import { generateLyrics } from '../utils/genAILyrics';
import { useSongLoader } from '../utils/useSongLoader';
import LyricsReader from './LyricsReader';

export default function Lyrics() {
  // Sidebar / library state
  const [savedSongs, setSavedSongs] = useState([]);
  const [themes, setThemes] = useState([]);
  const [currentDoc, setCurrentDoc] = useState({
    title: '',
    artist: '',
    album: '',
    year: '',
    genre: '',
    lyrics: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Seed from src/data/template.json via useSongLoader
  const { allTemplates } = useSongLoader();

  // Seed ALL entries from src/data/template.json into Saved Songs on first load
  useEffect(() => {
    if (savedSongs.length === 0 && Array.isArray(allTemplates) && allTemplates.length) {
      const seeded = allTemplates.map((t, i) => ({
        id: `seed-${i}-${Date.now()}`,
        title: t.title || 'Untitled',
        artist: t.artist || 'Unknown Artist',
        genre: t.genre || t.type || 'Unspecified',
        album: t.album || '',
        year: t.year || new Date().getFullYear(),
        themes: Array.isArray(t.themes) ? t.themes : [],
        lyrics: t.lyrics || '',
        createdAt: new Date().toLocaleDateString(),
      }));
      setSavedSongs(seeded);
    }
  }, [allTemplates, savedSongs.length]);

  // Generation driven by themes
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const text = await generateLyrics(themes);
      return text; // LyricsReader will set its own textarea
    } catch (err) {
      console.error('Generation failed:', err);
      return '';
    } finally {
      setIsGenerating(false);
    }
  };

  // Save from the Reader
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
    // optional: toast/alert
  };

  // Load a song into the Reader
  const loadSong = (song) => {
    setCurrentDoc({
      title: song.title || '',
      artist: song.artist || '',
      album: song.album || '',
      year: song.year?.toString?.() || '',
      genre: song.genre || '',
      lyrics: song.lyrics || '',
    });
  };

  const deleteSong = (songId) => {
    setSavedSongs((prev) => prev.filter((song) => song.id !== songId));
    if (currentDoc?.id === songId) {
      setCurrentDoc({
        title: '',
        artist: '',
        album: '',
        year: '',
        genre: '',
        lyrics: '',
      });
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
      <div className={styles.lyricsHeader}>
        <h2>Lyrics Studio</h2>
        <p>Create, edit, and manage your song lyrics with AI assistance</p>
      </div>

      <div className={styles.lyricsContent}>
        {/* Editor Column: Themes + Reader (no duplicate editor code) */}
        <div className={styles.editorColumn}>
          {/* Themes Section stays here (generation context) */}
          <div className={styles.themesSection}>
            <h4>Themes</h4>
            <div className={styles.themesContainer}>
              {themes.map((theme, index) => (
                <span key={index} className={styles.themeTag}>
                  {theme}
                  <button onClick={() => removeTheme(theme)} className={styles.removeTheme}>
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

          {/* Delegate editor window to LyricsReader */}
          <LyricsReader
            embed                 // <---- NEW: no duplicate header/container
            showGenerate
            showSave
            initial={currentDoc}
            onGenerate={handleGenerate}
            onSave={handleSave}
            parseLyrics={LyricHelper.parseLyrics}
            getStatistics={LyricHelper.getStatistics}
          />

          {/* Optional UX: reflect generate button busy state */}
          {isGenerating && <div className={styles.generatingNote}>Generating…</div>}
        </div>

        {/* Saved Songs Sidebar (unchanged) */}
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
                  <p>{song.artist} • {song.genre}</p>
                  {song.album && <p className={styles.albumInfo}>{song.album} ({song.year})</p>}
                  {song.themes && song.themes.length > 0 && (
                    <div className={styles.songThemes}>
                      {song.themes.slice(0, 3).map((theme, i) => (
                        <span key={i} className={styles.miniTheme}>{theme}</span>
                      ))}
                      {song.themes.length > 3 && (
                        <span className={styles.moreThemes}>+{song.themes.length - 3}</span>
                      )}
                    </div>
                  )}
                  <span className={styles.date}>{song.createdAt}</span>
                  <div className={styles.songActions}>
                    <button onClick={() => loadSong(song)} className={styles.btnLoad}>
                      Load
                    </button>
                    <button onClick={() => deleteSong(song.id)} className={styles.btnDelete}>
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
