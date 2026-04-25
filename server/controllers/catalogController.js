import axios from 'axios';

const getCatalogBaseUrl = () => process.env.VITE_JIOSAAVN_API_URL || 'https://www.jiosaavn.com/api.php';

const buildCatalogUrl = (req) => {
  const base = getCatalogBaseUrl().replace(/\/+$/, '');
  const pathSuffix = (req.params[0] || '').replace(/^\/+/, '');
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

export const proxyCatalogRequest = async (req, res, next) => {
  try {
    const url = buildCatalogUrl(req);
    const response = await axios.get(url, {
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('[CATALOG PROXY] Request failed:', {
      path: req.originalUrl,
      status: error?.response?.status,
      message: error?.message,
    });

    const status = error?.response?.status || 502;
    res.status(status);
    next(new Error('Failed to fetch catalog data from upstream provider.'));
  }
};
