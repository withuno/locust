export function isVisible(el: HTMLElement | null): boolean {
  if (el === null) return false;

  // https://github.com/jquery/jquery/blob/a684e6ba836f7c553968d7d026ed7941e1a612d8/src/css/hiddenVisibleSelectors.js
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}
