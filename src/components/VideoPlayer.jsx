import React, { useEffect, useRef, useState } from 'react';
import { playVideo, downloadFile } from '../utils/media';

/**
 * Reusable HTML5 video player with common controls.
 * Props:
 * - src: string (required)
 * - title?: string (for download filename)
 * - autoPlay?: boolean
 * - className?: string
 * - onPlay?: () => void
 */
export default function VideoPlayer({ src, title = 'video', autoPlay = false, className = '', onPlay }) {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      setIsLoading(true);
      setHasError(false);
      
      const video = videoRef.current;
      
      const handleLoadedData = () => {
        setIsLoading(false);
        if (autoPlay) {
          playVideo(video);
        }
      };
      
      const handleError = () => {
        setIsLoading(false);
        setHasError(true);
        console.error('Video failed to load:', src);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      
      // Force load
      video.load();

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [src, autoPlay]);

  if (hasError) {
    return (
      <div className={`video-preview error ${className}`}>
        <div className="video-error">
          <p>❌ Video failed to load</p>
          <small>Check if {src} exists and is accessible</small>
        </div>
      </div>
    );
  }

  return (
    <div className={`video-preview ${className}`}>
      {isLoading && (
        <div className="video-loading">
          <p>⏳ Loading video...</p>
        </div>
      )}
      
      <video
        key={src}
        ref={videoRef}
        src={src}
        controls
        playsInline
        preload="metadata"
        className="video-player"
        style={{ display: isLoading ? 'none' : 'block' }}
      />

      <div className="video-controls">
        <button
          onClick={() => { 
            if (onPlay) onPlay(); 
            playVideo(videoRef.current); 
          }}
          className="control-btn play"
          disabled={isLoading || hasError}
        >
          ▶️ Play
        </button>
        <button
          onClick={() => downloadFile(src, `${title}.mp4`)}
          className="control-btn download"
          disabled={hasError}
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
  );
}