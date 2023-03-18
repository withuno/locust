import { isVisible } from 'is-visible';

import { FORM_QUERIES, PASSWORD_QUERIES, SUBMIT_BUTTON_QUERIES, USERNAME_QUERIES } from './input-patterns.js';

const FORM_ELEMENT_SCORING = {
  username: [
    { test: /type="text"/, value: 2 },
    { test: /type="email"/, value: 6 },
    { test: /placeholder="[^"]*username/i, value: 9 },
    { test: /placeholder="[^"]*e-?mail/i, value: 4 },
    { test: /name="username"/, value: 10 },
    { test: /id="username"/, value: 10 },
    { test: /id="usr/, value: 4 },
    { test: /(name|id)="(username|login)/, value: 8 },
    { test: /id="user/, value: 5 },
    { test: /name="user/, value: 5 },
    { test: /autocomplete="username"/, value: 6 },
    { test: /autocomplete="[^"]*user/, value: 1 },
    { test: /autocorrect="off"/, value: 1 },
    { test: /autocapitalize="off"/, value: 1 },
    { test: /class="([^"]*\b|)((uname|usr)\b)/, value: 1 },
    { test: /class="([^"]*\b|)((username|user|email)\b)/, value: 3 },
    { test: /formcontrolname="[^"]*user/i, value: 1 },
  ],
  password: [
    { test: /type="password"/, value: 10 },
    { test: /name="pass/, value: 8 },
    { test: /id="pwd/, value: 4 },
    { test: /title="pass/, value: 6 },
    { test: /id="password"/, value: 10 },
    { test: /(name|id)="pass/, value: 7 },
    { test: /placeholder="[^"]*password/i, value: 9 },
  ],
  submit: [
    { test: /type="submit"/, value: 5 },
    { test: /(name|id|title)="(login|log[ _-]in|signin|sign[ _-]in)"/i, value: 10 },
    { test: /<input.+data-uno-haslogintext="yes"/, value: 8 },
    { test: /<button.+data-uno-haslogintext="yes"/, value: 8 },
    { test: /<a .*data-uno-haslogintext="yes"/, value: 2 },
  ],
};

const VISIBILE_SCORE_INCREMENT = 8;

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;

function findForms(queryEl: Document | HTMLElement = document) {
  return Array.prototype.slice.call(queryEl.querySelectorAll(FORM_QUERIES.join(',')));
}

export function findFormsWithInputs(queryEl: Document | HTMLElement = document) {
  return findForms(queryEl)
    .map((formEl) => {
      const form = {
        form: formEl,
        usernameFields: findUsernameInputs(formEl),
        passwordFields: findPasswordInputs(formEl),
        submitButtons: findSubmitButtons(formEl),
      };
      if (form.usernameFields.length <= 0) {
        const input = guessUsernameInput(formEl);
        if (input) {
          form.usernameFields.push(input);
        }
      }
      return form;
    })
    .filter((form) => form.passwordFields.length + form.usernameFields.length > 0);
}

function findPasswordInputs(queryEl = document) {
  const megaQuery = PASSWORD_QUERIES.join(', ');
  const inputs = Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery));
  return sortFormElements(inputs, 'password');
}

function findSubmitButtons(queryEl = document) {
  const megaQuery = SUBMIT_BUTTON_QUERIES.join(', ');
  const inputs = Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery));
  return sortFormElements(inputs, 'submit');
}

function findUsernameInputs(queryEl = document) {
  const megaQuery = USERNAME_QUERIES.join(', ');
  const inputs = Array.prototype.slice.call(queryEl.querySelectorAll(megaQuery));
  return sortFormElements(inputs, 'username');
}

function guessUsernameInput(formEl: HTMLFormElement) {
  const elements = /^form$/i.test(formEl.tagName) ? [...formEl.elements] : [...formEl.querySelectorAll('input')];
  const possibleInputs = elements.filter((el) => {
    if (el.tagName.toLowerCase() !== 'input') return false;
    if (['email', 'text'].indexOf(el.getAttribute('type')!) === -1) return false;
    if (/pass(word)?/.test(el.outerHTML)) return false;
    return true;
  });
  return possibleInputs.length > 0 ? possibleInputs[0] : null;
}

export function setInputValue(input: HTMLInputElement, value: string) {
  nativeInputValueSetter.call(input, value);
  input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true }));
  input.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true, cancelable: true }));
  input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true }));
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
}

export function sortFormElements<Elements extends HTMLElement[]>(
  elements: Elements,
  type: keyof typeof FORM_ELEMENT_SCORING,
) {
  const tests = FORM_ELEMENT_SCORING[type];

  if (!tests) {
    throw new Error(`Failed sorting form elements: Type is invalid: ${type}`);
  }

  const getInputScore = (input: HTMLElement) => {
    const html = input.outerHTML;
    let score = tests.reduce((current, check) => {
      const value = check.test.test(html) ? check.value : 0;
      return current + value;
    }, 0);
    if (isVisible(input)) {
      score += VISIBILE_SCORE_INCREMENT;
    }
    input.setAttribute('data-uno-score', String(score));
    return score;
  };

  return elements.sort((elA, elB) => {
    const scoreA = getInputScore(elA);
    const scoreB = getInputScore(elB);
    if (scoreA > scoreB) {
      return -1;
    }
    if (scoreB > scoreA) {
      return 1;
    }
    return 0;
  });
}
