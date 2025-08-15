// src/utils/genAILyrics.js
// Centralized backend calls for AI lyric generation (aligned to GenAIWorker.js)

const API_BASE = 'https://ai-worker.shepherdns86.workers.dev';
const ENDPOINT = '/api/open';

function buildLyricsPrompt(themes = [], meta = {}) {
  const { title = '', artist = '', album = '', year = '', genre = '' } = meta;
  const themeList = (Array.isArray(themes) ? themes : []).filter(Boolean);

  return [
    `Write original song lyrics in clean, plain text (no markdown).`,
    `Keep structure natural: verses, chorus, and a bridge if it fits.`,
    title || artist || album || genre || year ? `Metadata:` : '',
    title ? `- Title: ${title}` : '',
    artist ? `- Artist: ${artist}` : '',
    album ? `- Album: ${album}` : '',
    genre ? `- Genre: ${genre}` : '',
    year ? `- Year: ${year}` : '',
    themeList.length ? `Themes: ${themeList.join(', ')}` : '',
    ``,
    `Avoid profanity unless thematically necessary.`,
    `Return ONLY the lyrics text (no JSON or explanations).`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Generate lyrics from themes (and optional metadata).
 * @param {string[]} themes
 * @param {{title?:string, artist?:string, album?:string, year?:string|number, genre?:string}} options
 * @returns {Promise<string>}
 */
export async function generateLyrics(themes = [], options = {}) {
  const prompt = buildLyricsPrompt(themes, options);

  const res = await fetch(`${API_BASE}${ENDPOINT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'chat',                 // <-- matches OpenHandler.js
      prompt,                       // <-- user prompt
      system: 'You are a skilled songwriter who writes singable, coherent lyrics.',
    }),
  });

  // Better error surfacing to help diagnose
  if (!res.ok) {
    let details = '';
    try { details = await res.text(); } catch {}
    throw new Error(`Lyrics generation failed (${res.status}) at ${API_BASE}${ENDPOINT}\n${details}`);
  }

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const data = await res.json();
    // OpenHandler returns: { output: "<lyrics>" }
    return typeof data === 'string' ? data : (data.output || '');
  }

  // Fallback if Worker returns text
  return await res.text();
}
