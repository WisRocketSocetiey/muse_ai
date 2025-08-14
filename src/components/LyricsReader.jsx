// LyricsReader.jsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './LyricsReader.module.css'; // <-- changed

export default function LyricsReader({
  onGenerate,
  onSave,
  parseLyrics,
  getStatistics,
  showGenerate = false,
  showSave = false,
  embed = false,
  initial = { title:'', artist:'', album:'', year:'', genre:'', lyrics:'' },
}) {
  const [title, setTitle]   = useState(initial.title || '');
  const [artist, setArtist] = useState(initial.artist || '');
  const [album, setAlbum]   = useState(initial.album || '');
  const [year, setYear]     = useState(initial.year || '');
  const [genre, setGenre]   = useState(initial.genre || '');
  const [lyrics, setLyrics] = useState(initial.lyrics || '');
  const [isBusy, setIsBusy] = useState(false);
  const [stats, setStats]   = useState(null);
  const textareaRef = useRef(null);

  // keep fields in sync when parent loads a different song
  useEffect(() => {
    setTitle(initial.title || '');
    setArtist(initial.artist || '');
    setAlbum(initial.album || '');
    setYear(initial.year || '');
    setGenre(initial.genre || '');
    setLyrics(initial.lyrics || '');
  }, [initial]);

  useEffect(() => {
    if (lyrics && typeof parseLyrics === 'function' && typeof getStatistics === 'function') {
      const parsed = parseLyrics(lyrics);
      setStats(getStatistics(parsed));
    } else {
      setStats(null);
    }
  }, [lyrics, parseLyrics, getStatistics]);

  const handleGenerate = async () => {
    if (!onGenerate) return;
    setIsBusy(true);
    try {
      const result = await onGenerate();
      if (typeof result === 'string') setLyrics(result);
    } finally {
      setIsBusy(false);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  };

  const handleSave = () => {
    if (!onSave) return;
    onSave({ title, artist, album, year, genre, lyrics, updatedAt: new Date().toISOString() });
  };

  const editor = (
    <>
      <div className={styles.songMetadata}>
        <div className={styles.metadataRow}>
          <input
            type="text" placeholder="Song Title" value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${styles.inputField} ${styles.titleInput}`}
          />
          <input
            type="text" placeholder="Artist" value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className={`${styles.inputField} ${styles.artistInput}`}
          />
        </div>
        <div className={styles.metadataRow}>
          <input
            type="text" placeholder="Album" value={album}
            onChange={(e) => setAlbum(e.target.value)}
            className={`${styles.inputField} ${styles.albumInput}`}
          />
          <input
            type="text" placeholder="Year" value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`${styles.inputField} ${styles.yearInput}`}
          />
        </div>
        <div className={styles.metadataRow}>
          <input
            type="text" placeholder="Genre" value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className={`${styles.inputField} ${styles.genreInput}`}
          />
        </div>
      </div>

      {(showGenerate || showSave) && (
        <div className={styles.editorToolbar}>
          {showGenerate && (
            <button onClick={handleGenerate} disabled={isBusy} className={`${styles.btn} ${styles.btnPrimary}`}>
              {isBusy ? 'Generating...' : '✨ Generate Lyrics'}
            </button>
          )}
          {showSave && (
            <button onClick={handleSave} className={`${styles.btn} ${styles.btnSecondary}`}>
              💾 Save
            </button>
          )}
        </div>
      )}

      {stats && (
        <div className={styles.lyricsStats}>
          <span>Words: {stats.totalWords}</span>
          <span>Lines: {stats.totalLines}</span>
          <span>Duration: {stats.formattedDuration}</span>
          <span>Sections: {stats.totalSections}</span>
        </div>
      )}

      <div className={styles.editorWrapper}>
        <textarea
          ref={textareaRef}
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder="Start writing your lyrics here…"
          className={styles.lyricsEditor}
        />
      </div>
    </>
  );

  if (embed) return editor;

  // optional full-page rendering if used standalone
  return (
    <div>
      {editor}
    </div>
  );
}
