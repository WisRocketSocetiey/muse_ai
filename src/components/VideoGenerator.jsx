import React, { useState } from 'react';
import './VideoGenerator.css';

export default function VideoGenerator() {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [settings, setSettings] = useState({
    style: 'cinematic',
    duration: 15,
    resolution: '1080p',
    fps: 30,
    aspectRatio: '16:9'
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // TODO: Integrate with OrpheusWorker for AI video generation
    setTimeout(() => {
      const newVideo = {
        id: Date.now(),
        title: `Generated Video ${videos.length + 1}`,
        prompt: prompt || 'AI Generated Video',
        style: settings.style,
        duration: settings.duration,
        resolution: settings.resolution,
        fps: settings.fps,
        aspectRatio: settings.aspectRatio,
        createdAt: new Date().toLocaleDateString(),
        // Placeholder - replace with actual generated video URL
        videoUrl: null,
        thumbnailUrl: null,
        status: 'ready'
      };
      
      setVideos([newVideo, ...videos]);
      setCurrentVideo(newVideo);
      setIsGenerating(false);
    }, 5000);
  };

  const handlePlay = (video) => {
    setCurrentVideo(video);
    // TODO: Load and play actual video file
    console.log('Playing video:', video.title);
  };

  const handleDownload = (video) => {
    // TODO: Implement actual video file download
    alert(`Download functionality for "${video.title}" will be implemented when video generation is ready.`);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-generator-container">
      <div className="video-header">
        <h2>Video Generator</h2>
        <p>Create AI-generated videos and visual content</p>
      </div>

      <div className="generator-content">
        {/* Generation Controls */}
        <div className="generation-panel">
          <div className="prompt-section">
            <label>Video Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video you want to generate... (e.g., 'A serene sunset over mountains with flowing water')"
              className="prompt-input"
              rows={4}
            />
          </div>

          <div className="settings-grid">
            <div className="setting-group">
              <label>Style</label>
              <select
                value={settings.style}
                onChange={(e) => setSettings({...settings, style: e.target.value})}
                className="setting-input"
              >
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
              <select
                value={settings.duration}
                onChange={(e) => setSettings({...settings, duration: parseInt(e.target.value)})}
                className="setting-input"
              >
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Resolution</label>
              <select
                value={settings.resolution}
                onChange={(e) => setSettings({...settings, resolution: e.target.value})}
                className="setting-input"
              >
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (Full HD)</option>
                <option value="1440p">1440p (2K)</option>
                <option value="2160p">2160p (4K)</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Frame Rate</label>
              <select
                value={settings.fps}
                onChange={(e) => setSettings({...settings, fps: parseInt(e.target.value)})}
                className="setting-input"
              >
                <option value={24}>24 FPS (Cinema)</option>
                <option value={30}>30 FPS (Standard)</option>
                <option value={60}>60 FPS (Smooth)</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Aspect Ratio</label>
              <select
                value={settings.aspectRatio}
                onChange={(e) => setSettings({...settings, aspectRatio: e.target.value})}
                className="setting-input"
              >
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="4:3">4:3 (Standard)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="9:16">9:16 (Portrait)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="generate-btn"
          >
            {isGenerating ? '🎬 Generating Video...' : '🎥 Generate Video'}
          </button>

          {isGenerating && (
            <div className="generation-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <p>Processing your video... This may take a few minutes.</p>
            </div>
          )}
        </div>

        {/* Current Video Preview */}
        {currentVideo && (
          <div className="current-video">
            <h3>Current Video</h3>
            <div className="video-preview">
              <div className="video-placeholder">
                <div className="placeholder-content">
                  <h4>{currentVideo.title}</h4>
                  <p>{currentVideo.style} • {currentVideo.resolution} • {formatDuration(currentVideo.duration)}</p>
                  <div className="placeholder-icon">🎬</div>
                  <p className="preview-note">Video preview will appear here</p>
                </div>
              </div>
              
              <div className="video-controls">
                <button
                  onClick={() => handlePlay(currentVideo)}
                  className="control-btn play"
                >
                  ▶️ Play
                </button>
                <button
                  onClick={() => handleDownload(currentVideo)}
                  className="control-btn download"
                >
                  📥 Download
                </button>
                <button
                  className="control-btn share"
                  onClick={() => alert('Share functionality coming soon!')}
                >
                  🔗 Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generated Videos Gallery */}
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
                    <div className="thumbnail-placeholder">
                      <span className="thumbnail-icon">🎬</span>
                      <span className="video-duration">{formatDuration(video.duration)}</span>
                    </div>
                  </div>
                  
                  <div className="video-info">
                    <h4>{video.title}</h4>
                    <p className="video-details">
                      {video.style} • {video.resolution} • {video.fps}fps
                    </p>
                    <p className="video-prompt">"{video.prompt}"</p>
                    <span className="video-date">{video.createdAt}</span>
                  </div>

                  <div className="video-actions">
                    <button
                      onClick={() => handlePlay(video)}
                      className="action-btn play"
                      title="Play Video"
                    >
                      ▶️
                    </button>
                    <button
                      onClick={() => handleDownload(video)}
                      className="action-btn download"
                      title="Download Video"
                    >
                      📥
                    </button>
                    <button
                      onClick={() => setCurrentVideo(video)}
                      className="action-btn load"
                      title="Load Video"
                    >
                      📂
                    </button>
                    <button
                      onClick={() => {
                        setVideos(videos.filter(v => v.id !== video.id));
                        if (currentVideo?.id === video.id) {
                          setCurrentVideo(null);
                        }
                      }}
                      className="action-btn delete"
                      title="Delete Video"
                    >
                      🗑️
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