import axios from 'axios';

const CATALOG_FALLBACK_BASES = [
  process.env.VITE_API_BASE_URL,
  process.env.VITE_JIOSAAVN_API_URL,
  'https://www.jiosaavn.com/api.php',
].filter((value) => Boolean(value) && !String(value).startsWith('/'));

const normalizeBase = (value) => String(value || '').replace(/\/+$/, '');

const buildCatalogUrl = (baseUrl, req) => {
  const base = normalizeBase(baseUrl);
  const rawSplat = req.params?.splat ?? req.params?.[0] ?? '';
  const pathSuffix = (Array.isArray(rawSplat) ? rawSplat.join('/') : rawSplat).replace(/^\/+/, '');

  // Handle both ".../api.php" and REST-style upstreams.
  const target = pathSuffix ? `${base}/${pathSuffix}` : base;
  const url = new URL(target);

  Object.entries(req.query || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, item));
    } else if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const getEmptyPayloadByPath = (path = '') => {
  if (path.includes('/modules')) {
    return { data: { charts: [], playlists: [], albums: [] } };
  }

  if (path.includes('/search/')) {
    return { data: { results: [], total: 0 } };
  }

  if (path.includes('/suggestions')) {
    return { data: [] };
  }

  if (path.includes('/songs')) {
    return { data: [] };
  }

  return { data: {} };
};

export const proxyCatalogRequest = async (req, res) => {
  const errors = [];

  for (const baseUrl of CATALOG_FALLBACK_BASES) {
    const url = buildCatalogUrl(baseUrl, req);
    try {
      const response = await axios.get(url, {
        timeout: 12000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'application/json, text/plain, */*',
        },
      });

      return res.status(200).json(response.data);
    } catch (error) {
      errors.push({
        baseUrl,
        url,
        status: error?.response?.status,
        message: error?.message,
      });
    }
  }

  console.error('[CATALOG PROXY] All upstreams failed:', {
    path: req.originalUrl,
    errors,
  });

  // Fail-open for catalog consumers to avoid hard app crash loops.
  return res.status(200).json(getEmptyPayloadByPath(req.originalUrl));
};
