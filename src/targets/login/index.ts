import { SUBMIT_BUTTON_SPEC, FORM_QUERIES, USERNAME_FIELD_SPEC, PASSWORD_FIELD_SPEC } from './fields';
import { isFormElement, isElementVisible } from '../../utils/dom';
import { resolveElements } from '../../utils/resolve-elements';
import { BaseTarget } from '../base-target';

/**
 * The LoginTarget class which represents a 'target' for logging in
 * with some credentials.
 */
export class LoginTarget extends BaseTarget<{
  form: HTMLFormElement | null;
  username: HTMLInputElement | null;
  password: HTMLInputElement | null;
  submit: HTMLElement | null;
}> {
  /**
   * Get the best login target on the current page.
   *
   * @param queryEl The element to query within
   * @returns A login target or `null` if none found
   * @see getLoginTargets
   */
  public static find(
    queryEl: Document | ShadowRoot | HTMLElement = document,
    options: { visible?: boolean } = {},
  ): LoginTarget | null {
    const { visible = false } = options;

    const targets = LoginTarget.findAll(queryEl);
    let bestScore = -1;
    let bestTarget = null as LoginTarget | null;
    targets.forEach((target) => {
      const { score } = target;
      if (score > bestScore) {
        bestScore = score;
        bestTarget = target;
      }
    });

    if (visible) {
      const isTargetVisible = [
        bestTarget?.get('form'),
        bestTarget?.get('username'),
        bestTarget?.get('password'),
        bestTarget?.get('submit'),
      ].some((el) => {
        return !!el && isElementVisible(el);
      });
      return isTargetVisible ? bestTarget : null;
    }

    return bestTarget;
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
  public static findAll(queryEl: Document | ShadowRoot | HTMLElement = document): LoginTarget[] {
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
        let baseScore = 0;

        if (submitButtons.length > 1) {
          baseScore -= 2;
        }
        if (submitButtons.length === 0) {
          baseScore -= 1;
        }
        if (usernameFields.length > 1) {
          baseScore -= 1;
        }
        if (passwordFields.length > 1) {
          baseScore -= 2;
        }

        const target = new LoginTarget(baseScore);

        target.set('form', form);
        target.set('username', usernameFields[0]);
        target.set('password', passwordFields[0]);
        target.set('submit', submitButtons.length ? submitButtons[0] : orphanedSubmitButtons[0]);

        return target;
      });

    return targets;
  }

  protected calculateScore() {
    let score = 0;

    score += this.get('form') ? 10 : 0;
    score += this.get('username') ? 10 : 0;
    score += this.get('password') ? 10 : 0;
    score += this.get('submit') ? 10 : 0;

    if (isElementVisible(this.get('form'))) {
      score += 10;
    }

    return score;
  }
}
