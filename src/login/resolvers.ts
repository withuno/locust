import { FORM_QUERIES, PASSWORD_FIELD_SPEC, SUBMIT_BUTTON_SPEC, USERNAME_FIELD_SPEC } from './field-specs';
import { isFormElement, isInputElement } from '../utils/dom';
import { resolveElements } from '../utils/resolve-elements';

function findForms(queryEl: Document | HTMLElement = document): Array<HTMLFormElement | HTMLDivElement> {
  return Array.prototype.slice.call(queryEl.querySelectorAll(FORM_QUERIES.join(',')));
}

export function findFormsWithInputs(queryEl: Document | HTMLElement = document) {
  return findForms(queryEl)
    .map((formEl) => {
      const form = {
        form: isFormElement(formEl) ? formEl : null,
        usernameFields: resolveElements(USERNAME_FIELD_SPEC, formEl),
        passwordFields: resolveElements(PASSWORD_FIELD_SPEC, formEl),
        submitButtons: resolveElements(SUBMIT_BUTTON_SPEC, formEl),
      };
      if (!form.usernameFields.length) {
        const input = guessUsernameInput(formEl);
        if (input) {
          form.usernameFields.push(input);
        }
      }
      return form;
    })
    .filter((form) => form.passwordFields.length + form.usernameFields.length > 0);
}

function guessUsernameInput(formEl: HTMLFormElement | HTMLDivElement) {
  const elements = isFormElement(formEl) ? [...formEl.elements] : [...formEl.querySelectorAll('input')];
  const possibleInputs = elements.filter((el) => {
    if (!isInputElement(el)) return false;
    if (['email', 'text'].indexOf(el.getAttribute('type')!) === -1) return false;
    if (/pass(word)?/.test(el.outerHTML)) return false;
    return true;
  });
  return (possibleInputs[0] as HTMLInputElement) ?? null;
}
