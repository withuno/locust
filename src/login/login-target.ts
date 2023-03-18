import EventEmitter from 'eventemitter3';
import { isVisible } from 'is-visible';

import { setInputValue } from './login-inputs';
import { getSharedObserver } from '../unload-observer';

export const FORCE_SUBMIT_DELAY = 7500;

export type LoginTargetType = 'form' | 'submit' | 'username' | 'password';

function getEventListenerForElement(type: LoginTargetType) {
  switch (type) {
    case 'form':
      return 'submit';
    case 'submit':
      return 'click';
    case 'username':
    case 'password':
    default:
      return 'input';
  }
}

interface ChangeListener {
  input: HTMLElement;
  listener: () => void;
}

type LoginTargetEventEmitter = EventEmitter<{
  formSubmitted: (ctx: { source: 'form' | 'submitButton' }) => void;
  valueChanged: (ctx: { type: 'username' | 'password'; value: string }) => void;
}>;

/**
 * The LoginTarget class which represents a 'target' for logging in
 * with some credentials
 * @class LoginTarget
 */
export class LoginTarget {
  public baseScore = 0;
  public events = new EventEmitter() as LoginTargetEventEmitter;

  private _form: HTMLFormElement | null = null;
  private _usernameField: HTMLInputElement | null = null;
  private _passwordField: HTMLInputElement | null = null;
  private _submitButton: HTMLElement | null = null;
  private _forceSubmitDelay: number = FORCE_SUBMIT_DELAY;
  private _changeListeners: Record<LoginTargetType, ChangeListener | null> = {
    username: null,
    password: null,
    submit: null,
    form: null,
  };

  /**
   * Delay in milliseconds that the library should wait before force
   * submitting the form.
   */
  get forceSubmitDelay() {
    return this._forceSubmitDelay;
  }
  set forceSubmitDelay(delay) {
    this._forceSubmitDelay = delay;
  }

  /**
   * The target login form.
   */
  get form() {
    return this._form;
  }
  set form(form) {
    if (form) {
      this._form = form;
      this._listenForUpdates('form', form);
    }
  }

  /**
   * The password input element.
   */
  get passwordField() {
    return this._passwordField;
  }
  set passwordField(field) {
    if (field) {
      this._passwordField = field;
      this._listenForUpdates('password', field);
    }
  }

  /**
   * The submit button element.
   */
  get submitButton() {
    return this._submitButton;
  }
  set submitButton(button) {
    if (button) {
      this._submitButton = button;
      this._listenForUpdates('submit', button);
    }
  }

  /**
   * The username input element.
   */
  get usernameField() {
    return this._usernameField;
  }
  set usernameField(field) {
    if (field) {
      this._usernameField = field;
      this._listenForUpdates('username', field);
    }
  }

  /**
   * Calculate the score of the login target.
   * This can be used to compare LoginTargets by their likelihood of being
   * the correct login form. Higher number is better.
   *
   * @returns The calculated score.
   */
  calculateScore() {
    let score = this.baseScore;
    score += this.usernameField ? 10 : 0;
    score += this.passwordField ? 10 : 0;
    score += this.submitButton ? 10 : 0;
    if (isVisible(this.form)) {
      score += 10;
    }
    return score;
  }

  /**
   * Fill username into the username field.
   *
   * @param username The username to enter.
   *
   * @returns A promise that resolves once the data has been entered.
   */
  fillUsername(username: string): Promise<void> {
    if (this.usernameField) {
      setInputValue(this.usernameField, username);
    }
    return Promise.resolve();
  }

  /**
   * Fill password into the password field.
   *
   * @param password The password to enter.
   *
   * @returns A promise that resolves once the data has been entered.
   */
  fillPassword(password: string) {
    if (this.passwordField) {
      setInputValue(this.passwordField, password);
    }
    return Promise.resolve();
  }

  /**
   * Enter credentials into the form without logging in.
   *
   * @param username The username to enter
   * @param password The password to enter
   *
   * @returns A promise that resolves once the data has been entered
   *
   * @example
   * ```ts
   * loginTarget.enterDetails("myUsername", "myPassword");
   * ```
   */
  enterDetails(username: string, password: string) {
    return Promise.all([this.fillUsername(username), this.fillPassword(password)]);
  }

  /**
   * Login using the form.
   *
   * Enters the credentials into the form and logs in by either pressing the
   * login button or by submitting the form. The `force` option allows for
   * trying both methods: first by clicking the button and second by calling
   * `form.submit()`. When using `force=true`, if clicking the button doesn't
   * unload the page in `target.forceSubmitDelay` milliseconds,
   * `form.submit()` is called. If no form submit button is present, `force`
   * does nothing as `form.submit()` is called immediately.
   *
   * @param username The username to login with.
   * @param password The password to login with.
   * @param force Whether or not to force the login (defaults to false).
   *
   * @returns A promise that resolves once the login procedure has
   * completed. Let's be honest: there's probably no point to listen to the
   * return value of this function.
   *
   * @example
   * ```ts
   * loginTarget.login("myUsername", "myPassword");
   * ```
   */
  login(username: string, password: string, force = false) {
    return this.enterDetails(username, password).then(() => this.submit(force));
  }

  /**
   * Submit the associated form.
   *
   * You probably don't want this function. `login` or `enterDetails` are way
   * better.
   *
   * @param force Force the submission (defaults to false).
   */
  submit(force = false) {
    if (!this.submitButton) {
      // No button, just try submitting
      this.form?.submit();
      return Promise.resolve();
    }
    // Click button
    this.submitButton.click();
    return force ? this._waitForNoUnload() : Promise.resolve();
  }

  /**
   * Attach an event listener to listen for input changes
   * Attaches listeners for username/password input changes and emits an event
   * when a change is detected.
   *
   * @param type The type of input (username/password).
   * @param input The target element.
   *
   * @fires LoginTarget#valueChanged
   * @fires LoginTarget#formSubmitted
   */
  private _listenForUpdates<El extends HTMLElement>(type: LoginTargetType, input: El) {
    if (/username|password|submit|form/.test(type) !== true) {
      throw new Error(`Failed listening for field changes: Unrecognised type: ${type}`);
    }
    // Detect the necessary event listener name
    const eventListenerName = getEventListenerForElement(type);
    // Check if a listener exists already, and clear it if it does
    if (this._changeListeners[type]) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { input, listener } = this._changeListeners[type]!;
      input.removeEventListener(eventListenerName, listener, false);
    }
    // Emit a value change event
    let handleEvent;
    if (type === 'submit' || type === 'form') {
      // Listener function for the submission of the form
      const source = type === 'form' ? 'form' : 'submitButton';
      handleEvent = () => this.events.emit('formSubmitted', { source });
    } else {
      const emit = (value: any) => {
        this.events.emit('valueChanged', {
          type,
          value,
        });
      };
      // Listener function for the input element
      handleEvent = function (this: HTMLInputElement) {
        emit(this.value);
      };
    }
    // Store the listener information
    this._changeListeners[type] = {
      input,
      listener: handleEvent,
    };
    // Attach the listener
    input.addEventListener(eventListenerName, handleEvent, false);
  }

  /**
   * Wait for either the unload event to fire or the delay to time out.
   *
   * @returns A promise that resolves once either the delay has
   * expired for the page has begun unloading.
   */
  private _waitForNoUnload() {
    const unloadObserver = getSharedObserver();
    return Promise.race([
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(false);
        }, this.forceSubmitDelay);
      }),
      new Promise((resolve) => {
        if (unloadObserver.willUnload) {
          resolve(true);
          return;
        }
        unloadObserver.once('unloading', () => {
          resolve(true);
        });
      }),
    ]).then((hasUnloaded) => {
      if (!hasUnloaded) {
        // No unload events detected, so we need for force submit
        this.form?.submit();
      }
    });
  }
}
