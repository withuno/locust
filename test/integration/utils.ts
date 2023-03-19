export function isValidUrl(urlParam: string | null) {
  try {
    if (!urlParam) {
      return false;
    }
    // eslint-disable-next-line no-new
    new URL(urlParam);
    return true;
  } catch {
    return false;
  }
}
