const isClient = typeof window !== 'undefined';

const getApiUrl = (): string => {
  if (isClient) {
    const hostname = window.location.hostname;
    const isLocal =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.localhost') ||
      window.location.port === '3001';

    if (isLocal) {
      return 'http://localhost:3000';
    }
  }

  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

export const API_URL = isClient
  ? getApiUrl()
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getSandboxTunnelUrl = (): string => {
  if (isClient) {
    const hostname = window.location.hostname;
    const isLocal =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.localhost') ||
      window.location.port === '3001';

    if (isLocal) {
      return 'http://localhost:3000';
    }
  }

  return (
    process.env.NEXT_PUBLIC_SANDBOX_TUNNEL_URL ||
    'https://tunnel.jorgedoicela.com'
  );
};

export const SANDBOX_TUNNEL_URL = isClient
  ? getSandboxTunnelUrl()
  : process.env.NEXT_PUBLIC_SANDBOX_TUNNEL_URL ||
    'https://tunnel.jorgedoicela.com';


