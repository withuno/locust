const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;

/**
 * Sets `value` on the given `input` element,
 * then emits the relevant native event types.
 *
 * @param input The input element to modify.
 * @param value A value to apply.
 */
export function setInputValue(input: HTMLInputElement, value: string) {
  nativeInputValueSetter.call(input, value);
  input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true }));
  input.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true, cancelable: true }));
  input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true }));
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}

export function isFormElement(el: Element): el is HTMLFormElement {
  return /^form$/i.test(el.tagName);
}

export function isInputElement(el: Element): el is HTMLInputElement {
  return /^input$/i.test(el.tagName);
}
