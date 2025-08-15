/**
 * Simplified lyricHelper.js - Just the essentials
 */

export class LyricHelper {
  
  /**
   * Basic lyrics parsing - just count words, lines, and detect sections
   */
  static parseLyrics(lyricsText) {
    if (!lyricsText || typeof lyricsText !== 'string') {
      return { sections: [], wordCount: 0, lineCount: 0 };
    }

    const lines = lyricsText.split('\n').filter(line => line.trim() !== '');
    const wordCount = lyricsText.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Simple section detection - just look for [brackets]
    const sectionCount = (lyricsText.match(/\[.*?\]/g) || []).length;
    
    return {
      sections: Array(sectionCount).fill({ type: 'section' }), // Simplified
      wordCount,
      lineCount: lines.length
    };
  }

  /**
   * Generate basic statistics
   */
  static getStatistics(parsedLyrics) {
    const estimatedDuration = Math.round((parsedLyrics.wordCount / 90) * 60); // 90 words per minute
    
    return {
      totalWords: parsedLyrics.wordCount,
      totalLines: parsedLyrics.lineCount,
      totalSections: parsedLyrics.sections.length,
      // ✅ Fixed: reference class name instead of `this`
      formattedDuration: LyricHelper.formatDuration(estimatedDuration)
    };
  }

  /**
   * Format duration from seconds to MM:SS
   */
  static formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

export default LyricHelper;
