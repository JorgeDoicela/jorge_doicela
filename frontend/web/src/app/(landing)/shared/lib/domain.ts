export function getSubdomainUrl(subdomain: string, isLocal: boolean, protocol = 'https:', port = ''): string {
  return isLocal
    ? `${protocol}//${subdomain}.localhost${port}`
    : `https://${subdomain}.jorgedoicela.com`;
}
