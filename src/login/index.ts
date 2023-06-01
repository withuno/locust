/* eslint-disable prefer-destructuring */

import { FORM_QUERIES, PASSWORD_FIELD_SPEC, SUBMIT_BUTTON_SPEC, USERNAME_FIELD_SPEC } from './fields';
import { LoginTarget } from './login-target';
import { isFormElement } from '../utils/dom';
import { isVisible } from '../utils/isVisible';
import { resolveElements } from '../utils/resolve-elements';

/**
 * Get the best login (visible) target on the current page.
 *
 * @param queryEl The element to query within
 * @returns A login target or `null` if none found
 * @see getLoginTarget
 */
export function getVisibleLoginTarget(queryEl: Document | HTMLElement = document) {
  const bestTarget = getLoginTarget(queryEl);
  const isTargetVisible = [
    bestTarget?.form,
    bestTarget?.usernameField,
    bestTarget?.passwordField,
    bestTarget?.submitButton,
  ].some((el) => {
    return !!el && isVisible(el);
  });
  return isTargetVisible ? bestTarget : null;
}

/**
 * Get the best login target on the current page.
 *
 * @param queryEl The element to query within
 * @returns A login target or `null` if none found
 * @see getLoginTargets
 */
export function getLoginTarget(queryEl: Document | HTMLElement = document) {
  const targets = getLoginTargets(queryEl);
  let bestScore = -1;
  let bestTarget = null;
  targets.forEach((target) => {
    const score = target.calculateScore();
    if (score > bestScore) {
      bestScore = score;
      bestTarget = target;
    }
  });
  return bestTarget as LoginTarget | null;
}

/**
 * Fetch all login targets.
 *
 * Fetches all detected login targets within some element (defaults to the
 * current document). Returned targets are not sorted or processed in any way
 * that would indicate how likely they are to be the 'correct' login form for
 * the page.
 *
 * @param queryEl The element to query within.
 * @returns An array of login targets.
 */
export function getLoginTargets(queryEl: Document | HTMLElement = document) {
  // Gather a list of all potential submit buttons throughout the document
  // We use these as a fallback when a form is found without submit button(s)
  // NOTE: this array will be mutated as we process forms into `LoginTargets`
  let orphanedSubmitButtons = resolveElements(SUBMIT_BUTTON_SPEC, document);

  const forms = Array.prototype.slice.call(queryEl.querySelectorAll(FORM_QUERIES.join(',')));

  const targets = forms
    .map((formEl) => {
      const form = isFormElement(formEl) ? formEl : null;
      const usernameFields = resolveElements(USERNAME_FIELD_SPEC, formEl);
      const passwordFields = resolveElements(PASSWORD_FIELD_SPEC, formEl);
      const submitButtons = resolveElements(SUBMIT_BUTTON_SPEC, formEl);

      // De-dupe submit buttons found associated to this login
      // target that are present in `orphanedSubmitButtons`.
      if (submitButtons.length) {
        orphanedSubmitButtons = orphanedSubmitButtons.filter((orphan) => !submitButtons.includes(orphan));
      }

      return { form, usernameFields, passwordFields, submitButtons };
    })
    .filter(({ usernameFields, passwordFields }) => {
      return usernameFields.length + passwordFields.length > 0;
    })
    .map(({ form, usernameFields, passwordFields, submitButtons }) => {
      const target = new LoginTarget();

      target.form = form;
      target.usernameField = usernameFields[0] ?? null;
      target.passwordField = passwordFields[0] ?? null;
      target.submitButton = (submitButtons.length ? submitButtons[0] : orphanedSubmitButtons[0]) ?? null;

      if (submitButtons.length > 1) {
        target.baseScore -= 2;
      }
      if (submitButtons.length === 0) {
        target.baseScore -= 1;
      }
      if (usernameFields.length > 1) {
        target.baseScore -= 1;
      }
      if (passwordFields.length > 1) {
        target.baseScore -= 2;
      }

      return target;
    });

  return targets;
}
