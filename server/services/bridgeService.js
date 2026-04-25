import fetch from 'node-fetch';
import spotifyUrlInfo from 'spotify-url-info';
import stringSimilarity from 'string-similarity';
import YouTubeSR from 'youtube-sr';
const YouTube = YouTubeSR.YouTube || YouTubeSR;

import yts from 'yt-search';
import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';

const { getTracks, getData } = spotifyUrlInfo(fetch);
const execFile = promisify(execFileCallback);

const getSaavnBaseUrl = () =>
  (process.env.VITE_API_BASE_URL || process.env.VITE_JIOSAAVN_API_URL || 'https://www.jiosaavn.com/api.php').replace(/\/+$/, '');

const fetchSaavnSearchResults = async (query, limit = 10) => {
  try {
    const url = `${getSaavnBaseUrl()}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json().catch(() => ({}));
    return Array.isArray(data?.data?.results) ? data.data.results : [];
  } catch {
    return [];
  }
};

const extractYouTubeWithDanzy = async (url) => {
  const endpoint = `https://api.danzy.web.id/api/search/yts?q=${encodeURIComponent(url)}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`danzy API failed (${res.status})`);

  const payload = await res.json().catch(() => ({}));
  const candidates = payload?.result || payload?.results || payload?.data || [];
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error('danzy API returned empty result');
  }

  return {
    playlistName: 'YouTube Import',
    tracks: candidates.slice(0, 150).map((item) => {
      const title = item?.title || item?.name || '';
      const channel = item?.author?.name || item?.channel?.name || item?.uploader || 'Unknown Artist';
      const meta = parseYouTubeMetadata(title, channel);
      return {
        name: meta.title || title,
        artist: meta.artists.length > 0 ? meta.artists : [channel],
        rawTitle: meta.rawTitle,
        allParts: meta.allParts,
        image: item?.image || item?.thumbnail || item?.thumb || null,
      };
    }),
  };
};

const extractYouTubeWithSxtream = async (url) => {
  const endpoint = `https://api.sxtream.my.id/downloader/ytmp3?url=${encodeURIComponent(url)}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`sxtream API failed (${res.status})`);

  const payload = await res.json().catch(() => ({}));
  const data = payload?.result || payload?.data || payload;
  const title = data?.title || data?.name;
  if (!title) throw new Error('sxtream API returned empty title');

  const channel = data?.author || data?.uploader || 'Unknown Artist';
  const meta = parseYouTubeMetadata(title, channel);
  return {
    playlistName: 'YouTube Import',
    tracks: [{
      name: meta.title || title,
      artist: meta.artists.length > 0 ? meta.artists : [channel],
      rawTitle: meta.rawTitle,
      allParts: meta.allParts,
      image: data?.thumbnail || null,
      directAudioUrl: data?.url || data?.download || null,
    }],
  };
};

const getSaavnBaseUrl = () =>
  (process.env.VITE_API_BASE_URL || process.env.VITE_JIOSAAVN_API_URL || 'https://www.jiosaavn.com/api.php').replace(/\/+$/, '');

const fetchSaavnSearchResults = async (query, limit = 10) => {
  try {
    const url = `${getSaavnBaseUrl()}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json().catch(() => ({}));
    return Array.isArray(data?.data?.results) ? data.data.results : [];
  } catch {
    return [];
  }
};

const extractYouTubeWithDanzy = async (url) => {
  const endpoint = `https://api.danzy.web.id/api/search/yts?q=${encodeURIComponent(url)}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`danzy API failed (${res.status})`);

  const payload = await res.json().catch(() => ({}));
  const candidates = payload?.result || payload?.results || payload?.data || [];
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error('danzy API returned empty result');
  }

  return {
    playlistName: 'YouTube Import',
    tracks: candidates.slice(0, 150).map((item) => {
      const title = item?.title || item?.name || '';
      const channel = item?.author?.name || item?.channel?.name || item?.uploader || 'Unknown Artist';
      const meta = parseYouTubeMetadata(title, channel);
      return {
        name: meta.title || title,
        artist: meta.artists.length > 0 ? meta.artists : [channel],
        rawTitle: meta.rawTitle,
        allParts: meta.allParts,
        image: item?.image || item?.thumbnail || item?.thumb || null,
      };
    }),
  };
};

const extractYouTubeWithSxtream = async (url) => {
  const endpoint = `https://api.sxtream.my.id/downloader/ytmp3?url=${encodeURIComponent(url)}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`sxtream API failed (${res.status})`);

  const payload = await res.json().catch(() => ({}));
  const data = payload?.result || payload?.data || payload;
  const title = data?.title || data?.name;
  if (!title) throw new Error('sxtream API returned empty title');

  const channel = data?.author || data?.uploader || 'Unknown Artist';
  const meta = parseYouTubeMetadata(title, channel);
  return {
    playlistName: 'YouTube Import',
    tracks: [{
      name: meta.title || title,
      artist: meta.artists.length > 0 ? meta.artists : [channel],
      rawTitle: meta.rawTitle,
      allParts: meta.allParts,
      image: data?.thumbnail || null,
      directAudioUrl: data?.url || data?.download || null,
    }],
  };
};

const getSaavnBaseUrl = () =>
  (process.env.VITE_API_BASE_URL || process.env.VITE_JIOSAAVN_API_URL || 'https://www.jiosaavn.com/api.php').replace(/\/+$/, '');

const fetchSaavnSearchResults = async (query, limit = 10) => {
  try {
    const url = `${getSaavnBaseUrl()}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json().catch(() => ({}));
    return Array.isArray(data?.data?.results) ? data.data.results : [];
  } catch {
    return [];
  }
};

const extractYouTubeWithDanzy = async (url) => {
  const endpoint = `https://api.danzy.web.id/api/search/yts?q=${encodeURIComponent(url)}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`danzy API failed (${res.status})`);

  const payload = await res.json().catch(() => ({}));
  const candidates = payload?.result || payload?.results || payload?.data || [];
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error('danzy API returned empty result');
  }

  return {
    playlistName: 'YouTube Import',
    tracks: candidates.slice(0, 150).map((item) => {
      const title = item?.title || item?.name || '';
      const channel = item?.author?.name || item?.channel?.name || item?.uploader || 'Unknown Artist';
      const meta = parseYouTubeMetadata(title, channel);
      return {
        name: meta.title || title,
        artist: meta.artists.length > 0 ? meta.artists : [channel],
        rawTitle: meta.rawTitle,
        allParts: meta.allParts,
        image: item?.image || item?.thumbnail || item?.thumb || null,
      };
    }),
  };
};

const extractYouTubeWithSxtream = async (url) => {
  const endpoint = `https://api.sxtream.my.id/downloader/ytmp3?url=${encodeURIComponent(url)}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`sxtream API failed (${res.status})`);

  const payload = await res.json().catch(() => ({}));
  const data = payload?.result || payload?.data || payload;
  const title = data?.title || data?.name;
  if (!title) throw new Error('sxtream API returned empty title');

  const channel = data?.author || data?.uploader || 'Unknown Artist';
  const meta = parseYouTubeMetadata(title, channel);
  return {
    playlistName: 'YouTube Import',
    tracks: [{
      name: meta.title || title,
      artist: meta.artists.length > 0 ? meta.artists : [channel],
      rawTitle: meta.rawTitle,
      allParts: meta.allParts,
      image: data?.thumbnail || null,
      directAudioUrl: data?.url || data?.download || null,
    }],
  };
};

/**
 * Utility to clean song titles for better matching
 */
const cleanTitle = (title) => {
  return title
    .toLowerCase()
    .replace(/\(feat\..*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/- .*?(remastered|edit|version|mix|original|deluxe|expanded|soundtrack|official video|lyric video|music video)/gi, '')
    .replace(/\b(Lyrical|Audio|Video|Official|Full Song|Film Version|HD|4K|720p)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Checks if a string looks like a music label channel instead of an artist
 */
const isMusicLabel = (name) => {
    const labels = ['music', 'records', 't-series', 'tseries', 'saregama', 'sony', 'zee', 'tips', 'venus', 'official', 'production', 'channel', 'vevo'];
    const lower = name.toLowerCase();
    return labels.some(label => lower.includes(label));
};

/**
 * Intelligently parse YouTube titles for Mixes to find potential Song Name and Artists
 */
const parseYouTubeMetadata = (title, channelName) => {
    let songTitle = title;
    let potentialArtists = [];

    // Clean title from common suffixes first
    let cleanedMainTitle = title.replace(/\b(Lyrical|Audio|Video|Official|Full Song|Film Version|HD|4K|720p)\b/gi, '').trim();

    // Split by common separators: | , - , : , – (en dash), — (em dash)
    const parts = cleanedMainTitle.split(/[|:\-–—]/).map(p => p.trim());
    
    if (parts.length > 1) {
        songTitle = parts[0];
        // The other parts usually contain artists or album names
        potentialArtists = parts.slice(1).flatMap(p => 
            p.replace(/\(.*?\)/g, '') // remove (Prod. by ...)
             .split(/[,&/]|(feat\.)|(ft\.)/i)
             .map(a => a ? a.trim() : '')
             .filter(a => a && a.length > 1)
        );
    }

    if (!isMusicLabel(channelName)) potentialArtists.push(channelName);

    // Filter out common noise
    potentialArtists = potentialArtists.filter(a => 
        a.length > 2 && 
        !isMusicLabel(a) && 
        !/^(prod|music|directed|starring|singer|composed|lyrics)/i.test(a) &&
        !/^[0-9]+$/.test(a) && 
        !/^[^\w\s]+$/.test(a)
    );

    return {
        title: cleanTitle(songTitle),
        artists: potentialArtists,
        rawTitle: cleanedMainTitle,
        allParts: parts
    };
};

/**
 * Specialized Matcher for YouTube Mixes
 */
const findJioSaavnMatchForMix = async (title, artistsArray = [], rawTitle = "", allParts = []) => {
    const cleanedTitle = cleanTitle(title);
    const primaryArtist = artistsArray[0] || '';
    
    // Create more aggressive search tiers
    let searchTiers = [
        `${cleanedTitle} ${primaryArtist}`, // "Song Artist"
        allParts.length > 1 ? `${allParts[0]} ${allParts[1]}` : '', // "Part1 Part2" (Common for Song | Movie)
        cleanedTitle, // "Song"
        rawTitle.substring(0, 100).replace(/[|:\-–—]/g, ' '), // "Full Title"
    ].filter(q => q && q.trim().length > 2);

    // Deduplicate tiers
    searchTiers = [...new Set(searchTiers)];

    let results = [];
    for (const query of searchTiers) {
        try {
            const batch = await fetchSaavnSearchResults(query, 10);
            results = [...results, ...batch];
            if (results.length >= 10) break;
        } catch (err) {}
    }

    if (results.length === 0) return null;

    // Deduplicate results by ID
    const uniqueResults = Array.from(new Map(results.map(r => [r.id, r])).values());

    const scoredResults = uniqueResults.map(res => {
        const resTitle = cleanTitle(res.name || '');
        const resArtistsAll = (res.artists?.all || []).map(a => a.name.toLowerCase());
        const resAlbum = cleanTitle(res.album?.name || '');
        
        // 1. Title Similarity
        const titleSim = stringSimilarity.compareTwoStrings(cleanedTitle.toLowerCase(), resTitle.toLowerCase());
        
        // 2. Cross-Intersection Check
        // Try to find if JioSaavn result name exists anywhere in the raw YouTube title
        const rawTitleLower = rawTitle.toLowerCase();
        const isInRawTitle = rawTitleLower.includes(resTitle.toLowerCase());
        
        // 3. Artist match
        const artistInTitleIntersect = resArtistsAll.some(ra => 
            rawTitleLower.includes(ra) || cleanedTitle.toLowerCase().includes(ra)
        );

        let confidence = (titleSim * 0.5);
        if (artistInTitleIntersect) confidence += 0.4;
        if (isInRawTitle && titleSim < 0.5) confidence += 0.3; // Boost if name matches but similarity is low due to extra text

        // Check if album matches any parts
        if (allParts.some(p => cleanTitle(p).includes(resAlbum) || resAlbum.includes(cleanTitle(p)))) {
            confidence += 0.1;
        }

        return { data: res, confidence };
    });

    scoredResults.sort((a, b) => b.confidence - a.confidence);
    const best = scoredResults[0];
    
    // For Mixes, we can be slightly more lenient if it's the only result
    if (best.confidence < 0.35) return null;

    return {
        id: best.data.id,
        name: best.data.name,
        artist: best.data.artists?.primary?.[0]?.name || best.data.artists?.all?.[0]?.name,
        album: best.data.album?.name,
        image: best.data.image?.[1]?.url || best.data.image?.[2]?.url,
        confidence: Math.min(100, Math.round(best.confidence * 100))
    };
};

/**
 * Original Common Matcher Logic (For Spotify/Standard YT)
 */
const findJioSaavnMatch = async (title, artistRaw) => {
    const spotifyArtistsArray = artistRaw.split(/[&,]/).map(a => a.trim());
    const primarySpotifyArtist = spotifyArtistsArray[0];
    const cleanedSpotifyTitle = cleanTitle(title);
    
    // --- Tiered Search Strategy ---
    let results = [];
    
    // Tier 1: Title + Full Artist String
    results = await fetchSaavnSearchResults(`${cleanedSpotifyTitle} ${artistRaw}`, 10);

    // Tier 2: Title + Primary Artist
    if (results.length === 0) {
      results = await fetchSaavnSearchResults(`${cleanedSpotifyTitle} ${primarySpotifyArtist}`, 10);
    }

    // Tier 3: Title Only
    if (results.length === 0) {
      results = await fetchSaavnSearchResults(cleanedSpotifyTitle, 10);
    }

    if (results.length === 0) return null;

    // Calculate confidence scores
    const scoredResults = results.map(res => {
      const resTitle = res.name || '';
      const resArtistsAll = res.artists?.all || [];
      const primaryResArtist = res.artists?.primary?.[0]?.name || '';
      const cleanedResTitle = cleanTitle(resTitle);
      
      const titleSim = stringSimilarity.compareTwoStrings(cleanedSpotifyTitle, cleanedResTitle);
      let artistSim = stringSimilarity.compareTwoStrings(artistRaw.toLowerCase(), primaryResArtist.toLowerCase());
      
      const hasOverlappingArtist = resArtistsAll.some(ra => 
          artistRaw.toLowerCase().includes(ra.name.toLowerCase()) ||
          ra.name.toLowerCase().includes(artistRaw.toLowerCase()) ||
          primarySpotifyArtist.toLowerCase().includes(ra.name.toLowerCase()) ||
          ra.name.toLowerCase().includes(primarySpotifyArtist.toLowerCase())
      );
      
      if (hasOverlappingArtist) artistSim = Math.max(artistSim, 1.0);
      const isARRahman = artistRaw.toLowerCase().includes('rahman') || primaryResArtist.toLowerCase().includes('rahman');
      if (isARRahman && hasOverlappingArtist) artistSim = 1.0;

      const totalConfidence = (titleSim * 0.6) + (artistSim * 0.4);
      return { data: res, confidence: totalConfidence };
    });

    scoredResults.sort((a, b) => b.confidence - a.confidence);
    const best = scoredResults[0];
    
    return {
        id: best.data.id,
        name: best.data.name,
        artist: best.data.artists?.primary?.[0]?.name || best.data.artists?.all?.[0]?.name,
        album: best.data.album?.name,
        image: best.data.image?.[1]?.url || best.data.image?.[2]?.url,
        confidence: Math.round(best.confidence * 100)
    };
};

/**
 * Utility to split array into chunks for batch processing
 */
const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};


/**
 * Playlist Bridge Service (Universal)
 */
export const analyzePlaylist = async (url) => {
  try {
    const isSpotify = url.includes('spotify.com');
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

    if (!isSpotify && !isYouTube) {
        throw new Error('Invalid URL. Please provide a Spotify or YouTube playlist link.');
    }

    let tracksToProcess = [];
    let playlistName = 'Music Import';
    let extractionMethod = 'unknown';

    if (isSpotify) {
        console.log(`[BRIDGE SERVICE] Analyzing Spotify: ${url}`);
        const spotifyTracks = await getTracks(url);
        const spotifyData = await getData(url).catch(() => ({}));
        playlistName = spotifyData.name || 'Spotify Import';
        tracksToProcess = spotifyTracks.map(t => ({
            name: t.name,
            artist: t.artist || 'Unknown Artist',
            image: null
        }));
        extractionMethod = 'spotify';
    } else {
        console.log(`[BRIDGE SERVICE] Analyzing YouTube: ${url}`);
        const urlObj = new URL(url.replace('music.youtube.com', 'www.youtube.com'));
        const listId = urlObj.searchParams.get('list');

        let fallbackToLegacy = false;

        // Fast path requested: Danzy YT search API
        try {
            const danzyData = await extractYouTubeWithDanzy(url);
            playlistName = danzyData.playlistName;
            tracksToProcess = danzyData.tracks;
            extractionMethod = 'danzy-yts';
            console.log(`[BRIDGE SERVICE] danzy extracted ${tracksToProcess.length} tracks${listId ? ` for ${listId}` : ''}`);
        } catch (err) {
            fallbackToLegacy = true;
            console.log(`[BRIDGE SERVICE] danzy API unavailable/failed, switching to legacy extractor. Error: ${err.message}`);
        }


        if (fallbackToLegacy && !listId) {
            try {
                const sxtreamData = await extractYouTubeWithSxtream(url);
                playlistName = sxtreamData.playlistName;
                tracksToProcess = sxtreamData.tracks;
                extractionMethod = 'sxtream-ytmp3';
                fallbackToLegacy = false;
                console.log('[BRIDGE SERVICE] using sxtream ytmp3 fallback for direct YouTube URL');
            } catch (err) {
                fallbackToLegacy = true;
                console.log(`[BRIDGE SERVICE] sxtream fallback failed: ${err.message}`);
            }
        }

        if (fallbackToLegacy && listId && listId.startsWith('PL')) {
            try {
                extractionMethod = 'youtube-sr';
                const ytPlaylist = await YouTube.getPlaylist(url, { fetchAll: true });
                if (!ytPlaylist || !ytPlaylist.videos || ytPlaylist.videos.length === 0) {
                    throw new Error('youtube-sr returned empty or null');
                }
                playlistName = ytPlaylist.title || 'YouTube Import';
                tracksToProcess = ytPlaylist.videos.map(v => ({
                    name: v.title,
                    artist: v.channel?.name || 'Unknown Artist',
                    image: v.thumbnail?.url
                }));
                fallbackToLegacy = false;
            } catch (err) {
                console.log(`[BRIDGE SERVICE] youtube-sr failed for ${listId}, falling back to yt-search. Error: ${err.message}`);
                fallbackToLegacy = true;
            }
        }

        // yt-search fallback for mixes or when danzy/youtube-sr fail
        if (fallbackToLegacy) {
            extractionMethod = 'yt-search';
            const ytData = listId ? await yts({ listId }) : await yts(url);

            if (!ytData || !ytData.videos || ytData.videos.length === 0) {
                throw new Error('Could not extract playlist data from YouTube. It might be private or invalid.');
            }

            playlistName = ytData.title || 'YouTube Import';
            tracksToProcess = ytData.videos.map(v => {
                const meta = parseYouTubeMetadata(v.title, v.author?.name || '');
                return {
                    name: meta.title,
                    artist: meta.artists.length > 0 ? meta.artists : [v.author?.name || 'Unknown Artist'],
                    rawTitle: meta.rawTitle,
                    allParts: meta.allParts,
                    image: v.thumbnail || v.image
                };
            });
        }
    }



    console.log(`[BRIDGE SERVICE] Processing ${tracksToProcess.length} tracks in batches...`);
    const results = [];
    const chunks = chunkArray(tracksToProcess, 15); // Process 15 at a time

    for (const chunk of chunks) {
        const batchResults = await Promise.all(chunk.map(async (track) => {
            try {
                let match = null;
                if (extractionMethod === 'yt-search' || extractionMethod === 'danzy-yts' || extractionMethod === 'sxtream-ytmp3') {
                    match = await findJioSaavnMatchForMix(track.name, track.artist, track.rawTitle, track.allParts);
                } else {
                    match = await findJioSaavnMatch(track.name, track.artist);
                }
                return {
                    originalTrack: track,
                    match: match,
                    status: match ? 'found' : 'missing',
                    confidence: match?.confidence || 0
                };
            } catch (error) {
                console.error(`[BRIDGE SERVICE] Error matching track "${track.name}":`, error);
                return {
                    originalTrack: track,
                    match: null,
                    status: 'error',
                    confidence: 0
                };
            }
        }));
        results.push(...batchResults);
    }

    return {
      playlistName,
      tracks: results,
      totalFound: results.filter(t => t.status === 'found').length,
      totalProcessed: results.length
    };
  } catch (error) {
    console.error(`[BRIDGE SERVICE] Critical Error:`, error);
    
    // User-friendly error mapping
    let userMessage = error.message || 'Failed to analyze playlist.';
    if (userMessage.includes('404') || userMessage.toLowerCase().includes('not found')) {
        userMessage = 'This playlist doesn\'t exist or is set to private. Double-check your link!';
    } else if (userMessage.includes('403')) {
        userMessage = 'Access denied. The playlist might be private or restricted.';
    }

    throw new Error(userMessage);
  }
};
