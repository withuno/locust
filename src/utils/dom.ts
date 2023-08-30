export function isFormElement(el: Element): el is HTMLFormElement {
  return /^form$/i.test(el.tagName);
}

export function isInputElement(el: Element): el is HTMLInputElement {
  return /^input$/i.test(el.tagName);
}

export function isElementVisible(element: HTMLElement | null) {
  if (!element) {
    return false;
  }

  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  const xOverlap = Math.max(0, Math.min(rect.x + rect.width, window.innerWidth) - Math.max(rect.x, 0));
  const yOverlap = Math.max(0, Math.min(rect.y + rect.height, window.innerHeight) - Math.max(rect.y, 0));
  const elementArea = rect.width * rect.height;
  const overlapArea = xOverlap * yOverlap;
  const percentInView = overlapArea / elementArea;
  const isInView = percentInView > 0;

  return (
    isInView &&
    style.opacity !== '' &&
    style.opacity !== '0' &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    element.getAttribute('aria-hidden') !== 'true'
  );
}
