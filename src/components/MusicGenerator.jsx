import React, { useState, useRef, useEffect } from 'react';
import './MusicGenerator.css';

export default function MusicGenerator() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [settings, setSettings] = useState({
    genre: 'electronic',
    mood: 'upbeat',
    tempo: 120,
    duration: 30,
    instrument: 'piano'
  });
  const audioRef = useRef(null);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // TODO: Integrate with OrpheusWorker for AI music generation
    setTimeout(() => {
      const newTrack = {
        id: Date.now(),
        title: `Generated Track ${tracks.length + 1}`,
        prompt: prompt || 'AI Generated Music',
        genre: settings.genre,
        mood: settings.mood,
        tempo: settings.tempo,
        duration: settings.duration,
        createdAt: new Date().toLocaleDateString(),
        // Placeholder - replace with actual generated audio URL
        audioUrl: null,
        waveform: generateMockWaveform()
      };
      
      setTracks([newTrack, ...tracks]);
      setCurrentTrack(newTrack);
      setIsGenerating(false);
    }, 3000);
  };

  const generateMockWaveform = () => {
    // Generate mock waveform data for visualization
    return Array.from({ length: 100 }, () => Math.random() * 100);
  };

  const handlePlay = (track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      // TODO: Load and play actual audio file
      console.log('Playing track:', track.title);
    }
  };

  const handleDownload = (track) => {
    // TODO: Implement actual audio file download
    alert(`Download functionality for "${track.title}" will be implemented when audio generation is ready.`);
  };

  return (
    <div className="music-generator-container">

      <div className="generator-content">
        {/* Generation Controls */}
        <div className="generation-panel">
          <div className="prompt-section">
            <label>Music Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the music you want to generate... (e.g., 'Upbeat electronic dance music with synthesizers')"
              className="prompt-input"
              rows={3}
            />
          </div>

          <div className="settings-grid">
            <div className="setting-group">
              <label>Genre</label>
              <select
                value={settings.genre}
                onChange={(e) => setSettings({...settings, genre: e.target.value})}
                className="setting-input"
              >
                <option value="electronic">Electronic</option>
                <option value="rock">Rock</option>
                <option value="jazz">Jazz</option>
                <option value="classical">Classical</option>
                <option value="ambient">Ambient</option>
                <option value="hip-hop">Hip Hop</option>
                <option value="folk">Folk</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Mood</label>
              <select
                value={settings.mood}
                onChange={(e) => setSettings({...settings, mood: e.target.value})}
                className="setting-input"
              >
                <option value="upbeat">Upbeat</option>
                <option value="calm">Calm</option>
                <option value="energetic">Energetic</option>
                <option value="melancholic">Melancholic</option>
                <option value="mysterious">Mysterious</option>
                <option value="romantic">Romantic</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Tempo (BPM)</label>
              <input
                type="range"
                min="60"
                max="180"
                value={settings.tempo}
                onChange={(e) => setSettings({...settings, tempo: parseInt(e.target.value)})}
                className="tempo-slider"
              />
              <span className="tempo-value">{settings.tempo}</span>
            </div>

            <div className="setting-group">
              <label>Duration (seconds)</label>
              <input
                type="range"
                min="15"
                max="120"
                value={settings.duration}
                onChange={(e) => setSettings({...settings, duration: parseInt(e.target.value)})}
                className="duration-slider"
              />
              <span className="duration-value">{settings.duration}s</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="generate-btn"
          >
            {isGenerating ? '🎵 Generating Music...' : '🎹 Generate Music'}
          </button>
        </div>

        {/* Current Track Display */}
        {currentTrack && (
          <div className="current-track">
            <h3>Current Track</h3>
            <div className="track-info">
              <h4>{currentTrack.title}</h4>
              <p>{currentTrack.genre} • {currentTrack.mood} • {currentTrack.tempo} BPM</p>
            </div>
            
            {/* Waveform Visualization */}
            <div className="waveform-container">
              <div className="waveform">
                {currentTrack.waveform.map((height, index) => (
                  <div
                    key={index}
                    className="waveform-bar"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="track-controls">
              <button
                onClick={() => handlePlay(currentTrack)}
                className="play-btn"
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              <button
                onClick={() => handleDownload(currentTrack)}
                className="download-btn"
              >
                📥 Download
              </button>
            </div>
          </div>
        )}

        {/* Generated Tracks List */}
        <div className="tracks-list">
          <h3>Generated Tracks</h3>
          {tracks.length === 0 ? (
            <div className="empty-state">
              <p>No tracks generated yet. Create your first track above!</p>
            </div>
          ) : (
            <div className="tracks-grid">
              {tracks.map((track) => (
                <div key={track.id} className="track-card">
                  <div className="track-header">
                    <h4>{track.title}</h4>
                    <span className="track-date">{track.createdAt}</span>
                  </div>
                  <p className="track-details">
                    {track.genre} • {track.mood} • {track.tempo} BPM
                  </p>
                  <p className="track-prompt">"{track.prompt}"</p>
                  
                  <div className="track-actions">
                    <button
                      onClick={() => handlePlay(track)}
                      className="action-btn play"
                    >
                      {currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <button
                      onClick={() => handleDownload(track)}
                      className="action-btn download"
                    >
                      📥
                    </button>
                    <button
                      onClick={() => setCurrentTrack(track)}
                      className="action-btn load"
                    >
                      📂
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}