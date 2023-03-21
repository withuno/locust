import { FORM_QUERIES, PASSWORD_FIELD_SPEC, SUBMIT_BUTTON_SPEC, USERNAME_FIELD_SPEC } from './field-specs';
import { isFormElement } from '../utils/dom';
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
      return form;
    })
    .filter((form) => form.passwordFields.length + form.usernameFields.length > 0);
}
