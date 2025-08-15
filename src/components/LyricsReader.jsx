// LyricsReader.jsx — focused editor for title, artist style, genre, and lyrics
import React, { useEffect, useMemo, useState } from 'react';
import styles from './LyricsReader.module.css';

const GENRES = [
  'Pop', 'Hip-Hop / Rap', 'R&B / Soul', 'Rock', 'Indie', 'Country',
  'EDM / Dance', 'Lo‑Fi', 'Jazz', 'Blues', 'Folk', 'Singer‑Songwriter',
  'Metal', 'Reggae', 'Latin', 'Afrobeats', 'K‑Pop', 'Classical'
];

const STYLE_SUGGESTIONS = [
  'Kendrick-style conscious rap',
  'Billie Eilish moody pop',
  'Taylor Swift narrative pop',
  'Drake melodic rap',
  'Adele powerhouse ballad',
  'Johnny Cash storytelling country',
  'The Weeknd dark synth-pop',
  'Ed Sheeran acoustic pop',
  'Olivia Rodrigo pop-rock angst',
  'Frank Ocean introspective R&B'
];

export default function LyricsReader({
  embed,
  showGenerate = true,
  showSave = true,
  initial,
  onGenerate,
  onSave,
  parseLyrics,
  getStatistics,
}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [artistStyle, setArtistStyle] = useState(initial?.artistStyle || '');
  const [genre, setGenre] = useState(initial?.genre || '');
  const [lyrics, setLyrics] = useState(initial?.lyrics || '');
  const [busy, setBusy] = useState(false);

  // keep local state in sync when parent loads a different song
  useEffect(() => {
    setTitle(initial?.title || '');
    setArtistStyle(initial?.artistStyle || '');
    setGenre(initial?.genre || '');
    setLyrics(initial?.lyrics || '');
  }, [initial?.title, initial?.artistStyle, initial?.genre, initial?.lyrics]);

  // lightweight stats display
  const stats = useMemo(() => {
    try {
      return getStatistics ? getStatistics(lyrics) : null;
    } catch {
      return null;
    }
  }, [lyrics, getStatistics]);

  const handleGenerate = async () => {
    if (!onGenerate || busy) return;
    setBusy(true);
    try {
      const text = await onGenerate();
      if (typeof text === 'string') setLyrics(text);
    } finally {
      setBusy(false);
    }
  };

  const handleSave = () => {
    if (!onSave) return;
    onSave({ title, artistStyle, genre, lyrics });
  };

  return (
    <div className={styles.readerContainer}>
      <div className={styles.songMetadata}>
        <div className={styles.metadataRow}>
          <input
            className={`${styles.inputField} ${styles.titleInput}`}
            placeholder="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className={`${styles.inputField} ${styles.artistInput}`}
            placeholder='Artist style (e.g., "Billie Eilish moody pop")'
            list="artistStyleSuggestions"
            value={artistStyle}
            onChange={(e) => setArtistStyle(e.target.value)}
          />
          <datalist id="artistStyleSuggestions">
            {STYLE_SUGGESTIONS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <div className={styles.metadataRow}>
          <select
            className={`${styles.inputField} ${styles.genreInput}`}
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">Select genre…</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.editorToolbar}>
          {showGenerate && (
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleGenerate}
              disabled={busy}
              type="button"
            >
              ✨ Generate Lyrics
            </button>
          )}
          {showSave && (
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={handleSave}
              disabled={busy || !title || !lyrics}
              type="button"
            >
              💾 Save
            </button>
          )}
        </div>

        {stats && (
          <div className={styles.lyricsStats}>
            <span>Words: {stats.wordCount}</span>
            <span>Lines: {stats.lineCount}</span>
            {stats.readTime && <span>Read time: {stats.readTime}</span>}
          </div>
        )}
      </div>

      <div className={styles.editorWrapper}>
        <textarea
          className={styles.lyricsEditor}
          placeholder="Start writing your lyrics here…"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          rows={14}
        />
      </div>
    </div>
  );
}
