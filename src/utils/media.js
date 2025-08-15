export function playVideo(videoEl) {
  if (!videoEl) return;
  
  try {
    // Reset to beginning
    videoEl.currentTime = 0;
    
    // Attempt to play
    const playPromise = videoEl.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Video playback started successfully');
        })
        .catch((error) => {
          console.warn('Video autoplay failed:', error.message);
          // On mobile/restrictive environments, user interaction is required
          if (error.name === 'NotAllowedError') {
            console.log('User interaction required for video playback');
          }
        });
    }
  } catch (error) {
    console.error('Error attempting to play video:', error);
  }
}

export function downloadFile(url, filename = 'download') {
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
    
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: open in new tab
    window.open(url, '_blank');
  }
}