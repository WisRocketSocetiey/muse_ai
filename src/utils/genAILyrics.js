// genAILyrics.js
// Minimal, swappable lyrics generator stub.
// Replace the body of generateLyrics() with your real worker/API call later.

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Generate lyrics from themes (stub).
 * @param {string[]} themes
 * @returns {Promise<string>}
 */
export async function generateLyrics(themes = []) {
  // Simulate latency – remove when wiring to real backend
  await sleep(1200);

  const sample = themes.length ? themes.slice(0, 3) : ['inspiration', 'creativity', 'expression'];

  return `[Verse 1]
Sample lyrics inspired by themes: ${sample.join(', ')}
Generated based on your artistic vision
Creative flow and authentic expression

[Chorus]
This is where the magic happens
AI-powered lyrical creation
Bringing your ideas to life

[Verse 2]
Drawing from musical heritage
Structure and rhythm maintained
Professional songwriting assistance`;
}

export default generateLyrics;
