import React, { useMemo, useState } from 'react';
import './VideoGenerator.css';
import VideoPlayer from './VideoPlayer';

// Import videos from src/assets
import classicalRapVideo from '../assets/classical-rap.mp4';
import croonerLifeVideo from '../assets/crooner-life.mp4';
import rap2Video from '../assets/rap-2.mp4';
import rap3Video from '../assets/rap-3.mp4';
import rapVideoFile from '../assets/rap-video.mp4';

const VIDEO_CATALOG = [
  { file: 'classical-rap.mp4',    tags: ['classical', 'rap', 'hip-hop', 'orchestral'], url: classicalRapVideo },
  { file: 'crooner-life.mp4',     tags: ['crooner', 'ballad', 'vintage', 'voice'], url: croonerLifeVideo },
  { file: 'rap-2.mp4',            tags: ['rap', 'hip-hop', 'trap'], url: rap2Video },
  { file: 'rap-3.mp4',            tags: ['rap', 'hip-hop', 'boom bap'], url: rap3Video },
  { file: 'rap-video.mp4',        tags: ['rap', 'hip-hop', 'music video'], url: rapVideoFile },
];

// Remove the getAssetUrl function since we're using imports now

export default function VideoGenerator() {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [settings, setSettings] = useState({
    style: 'cinematic', duration: 15, resolution: '1080p', fps: 30, aspectRatio: '16:9'
  });
  const [rotationMap, setRotationMap] = useState({});

  const promptKey = useMemo(() => {
    const p = (prompt || '').toLowerCase().replace(/\s+/g, ' ').trim();
    return p.replace(/[^a-z0-9 ]/g, '') || 'default';
  }, [prompt]);

  const scoreCatalog = (text) => {
    const words = new Set(text.split(/\s+/g));
    return VIDEO_CATALOG.map(entry => {
      let score = 0;
      for (const tag of entry.tags) {
        const t = tag.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
        const tWords = t.split(/\s+/g).filter(Boolean);
        for (const tw of tWords) if (words.has(tw)) score += 1;
      }
      return { ...entry, score };
    }).sort((a, b) => b.score - a.score);
  };

  const pickNextForPrompt = () => {
    const scored = scoreCatalog((prompt || '').toLowerCase());
    const topScore = scored[0]?.score ?? 0;
    const candidates = (topScore > 0) ? scored.filter(s => s.score === topScore) : VIDEO_CATALOG;
    const used = new Set(rotationMap[promptKey] || []);
    let next = candidates.find(c => !used.has(c.file));
    if (!next) { used.clear(); next = candidates[0]; }
    const newUsed = new Set(used); newUsed.add(next.file);
    setRotationMap(prev => ({ ...prev, [promptKey]: Array.from(newUsed) }));
    return next; // Return the whole object now
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const selectedVideo = pickNextForPrompt();
      const newVideo = {
        id: Date.now(),
        title: selectedVideo.file.replace(/\.[^/.]+$/, ''),
        prompt: prompt || 'AI Generated Video',
        style: settings.style,
        duration: settings.duration,
        resolution: settings.resolution,
        fps: settings.fps,
        aspectRatio: settings.aspectRatio,
        createdAt: new Date().toLocaleDateString(),
        videoUrl: selectedVideo.url,
        status: 'ready'
      };
      setVideos([newVideo, ...videos]);
      setCurrentVideo(newVideo);
      setIsGenerating(false);
    }, 400);
  };
  
  return (
    <div className="video-generator-container">

      <div className="generator-content">
        <div className="generation-panel">
          <div className="prompt-section">
            <label>Video Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., hip-hop with orchestral strings"
              className="prompt-input"
              rows={4}
            />
          </div>

          <div className="settings-grid">
            <div className="setting-group">
              <label>Style</label>
              <select value={settings.style} onChange={(e) => setSettings({ ...settings, style: e.target.value })} className="setting-input">
                <option value="cinematic">Cinematic</option>
                <option value="anime">Anime</option>
                <option value="realistic">Realistic</option>
                <option value="abstract">Abstract</option>
                <option value="cartoon">Cartoon</option>
                <option value="vintage">Vintage</option>
                <option value="futuristic">Futuristic</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Duration</label>
              <select value={settings.duration} onChange={(e) => setSettings({ ...settings, duration: parseInt(e.target.value) })} className="setting-input">
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Resolution</label>
              <select value={settings.resolution} onChange={(e) => setSettings({ ...settings, resolution: e.target.value })} className="setting-input">
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (Full HD)</option>
                <option value="1440p">1440p (2K)</option>
                <option value="2160p">2160p (4K)</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Frame Rate</label>
              <select value={settings.fps} onChange={(e) => setSettings({ ...settings, fps: parseInt(e.target.value) })} className="setting-input">
                <option value={24}>24 FPS</option>
                <option value={30}>30 FPS</option>
                <option value={60}>60 FPS</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Aspect Ratio</label>
              <select value={settings.aspectRatio} onChange={(e) => setSettings({ ...settings, aspectRatio: e.target.value })} className="setting-input">
                <option value="16:9">16:9</option>
                <option value="4:3">4:3</option>
                <option value="1:1">1:1</option>
                <option value="9:16">9:16</option>
              </select>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={isGenerating} className="generate-btn">
            {isGenerating ? '🎬 Picking Clip…' : '🎥 Generate Video'}
          </button>
          {isGenerating && (
            <div className="generation-progress">
              <div className="progress-bar"><div className="progress-fill" /></div>
              <p>Selecting the best matching clip…</p>
            </div>
          )}
        </div>

        {currentVideo && (
          <div className="current-video">
            <h3>Current Video</h3>
            <VideoPlayer src={currentVideo.videoUrl} title={currentVideo.title} autoPlay />
          </div>
        )}

        <div className="videos-gallery">
          <h3>Generated Videos</h3>
          {videos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <p>No videos generated yet. Create your first video above!</p>
            </div>
          ) : (
            <div className="videos-grid">
              {videos.map((video) => (
                <div key={video.id} className="video-card">
                  <div className="video-thumbnail">
                    <video 
                      src={video.videoUrl} 
                      className="thumbnail-video"
                      preload="metadata"
                      muted
                      onLoadedMetadata={(e) => {
                        // Set thumbnail to first frame
                        e.target.currentTime = 0.1;
                      }}
                    />
                  </div>
                  <div className="video-info">
                    <h4>{video.title}</h4>
                    <p className="video-details">{video.style} • {video.resolution} • {video.fps}fps</p>
                    <p className="video-prompt">"{video.prompt}"</p>
                    <span className="video-date">{video.createdAt}</span>
                  </div>
                  <div className="video-actions">
                    <button onClick={() => setCurrentVideo(video)} className="action-btn load" title="Load">📂</button>
                    <button onClick={() => setVideos(videos.filter(v => v.id !== video.id))} className="action-btn delete" title="Delete">🗑️</button>
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