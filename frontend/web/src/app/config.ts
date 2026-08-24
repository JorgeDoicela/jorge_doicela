const isClient = typeof window !== 'undefined';

const isLocalhost =
  isClient &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.localhost') ||
    window.location.port === '3001');

const defaultApiUrl = isLocalhost ? 'http://localhost:3000' : '';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl;

