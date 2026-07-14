const isClient = typeof window !== 'undefined';

const defaultApiUrl = isClient
  ? (window.location.port === '3001' ? 'http://localhost:3000' : '')
  : 'http://localhost:3000';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl;
