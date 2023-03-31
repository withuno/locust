import { FieldSpec } from '../utils/resolve-elements';

// These queries are all modified to that they match inputs of type=text as well
// as inputs with no type attribute at all. Each line (query) is turned into 2
// queries, one with "input[type=text]" as the new prefix (replacing "input")
// and one with "input:not([type])".
const USERNAMES_OPTIONAL_TEXT = [
  'input[id^=user]',
  'input[id^=usr]',
  'input[name^=user i]',
  'input[id*=username i]',
  'input[id*=accountname i]',
  'input[title*=username i]',
  'input[placeholder*=username i]',
  'input[placeholder*=email i]',
  'input[autocomplete*=user]',
  'input[name*=email i]',
  'input[name*=login i]',
  'input[id*=email i]',
  'input[id*=login i]',
  'input[formcontrolname*=user i]',
  'input[class*=user i]',
].reduce(
  (queries, next) => [
    ...queries,
    next.replace(/^input/, 'input[type=text]'),
    next.replace(/^input/, 'input:not([type])'),
  ],
  [] as Array<string>,
);

export const USERNAME_FIELD_SPEC: FieldSpec<HTMLInputElement> = {
  prepare(root) {
    const labelAttr = 'data-uno-labelindex';
    const usernameAttr = 'data-uno-hasusernametext';
    const usernameLabelTextRegExp = /(phone|mobile|username|email|login id|customer id)/i;

    const labels = Array.prototype.slice.call(root.querySelectorAll('label')) as HTMLElement[];

    labels
      .filter((label) => {
        const text = label.innerText.trim().toLowerCase();
        return usernameLabelTextRegExp.test(text);
      })
      .forEach((label, i) => {
        // Uniquely identify the label in case
        // we need to query for subsequent inputs.
        label.setAttribute(labelAttr, String(i));

        // 1st case: query for an input identified by `<label for="..."`
        const htmlFor = label.getAttribute('for');
        if (htmlFor) {
          const input = document.getElementById(htmlFor);
          input?.setAttribute(usernameAttr, 'yes');
        } else {
          // 2nd case: query for the first input nested within the label
          const nestedInput = label.querySelector('input') as HTMLInputElement;
          if (nestedInput) {
            nestedInput.setAttribute(usernameAttr, 'yes');
          } else {
            // 3rd case: query for the first subsequent input adjacent to the label
            const subsequentInputQueries = [`[${labelAttr}="${i}"] ~ input`, `[${labelAttr}="${i}"] ~ * input`];
            const subsequentInput = label.parentElement?.querySelector(subsequentInputQueries.join(', '));
            subsequentInput?.setAttribute(usernameAttr, 'yes');

            // If an input cannot be identified by this point, then the website
            // developer has really messed up their form and we can't really
            // help it.
          }
        }
      });
  },

  find: {
    selectors: [
      ...USERNAMES_OPTIONAL_TEXT,
      'input[type=email]',
      'input[aria-label*=username i]',
      'input[aria-label*=email i]',
      '.login input[type=text]',
      '.login input[type=email]',
      'form[id*=login i] input[type=text]',
      'form[name*=login i] input[type=text]',
      '[data-uno-hasusernametext=yes]',
    ],

    sort: [
      { test: /type="text"/, weight: 2 },
      { test: /type="email"/, weight: 6 },
      { test: /placeholder="[^"]*username/i, weight: 9 },
      { test: /placeholder="[^"]*e-?mail/i, weight: 4 },
      { test: /name="username"/, weight: 10 },
      { test: /id="username"/, weight: 10 },
      { test: /id="usr/, weight: 4 },
      { test: /(name|id)="(username|login)/, weight: 8 },
      { test: /id="user/, weight: 5 },
      { test: /name="user/, weight: 5 },
      { test: /autocomplete="username"/, weight: 6 },
      { test: /autocomplete="[^"]*user/, weight: 1 },
      { test: /autocorrect="off"/, weight: 1 },
      { test: /autocapitalize="off"/, weight: 1 },
      { test: /class="([^"]*\b|)((uname|usr)\b)/, weight: 1 },
      { test: /class="([^"]*\b|)((username|user|email)\b)/, weight: 3 },
      { test: /formcontrolname="[^"]*user/i, weight: 1 },
    ],
  },
};

// -------------------------------------------------------------------------- //

export const PASSWORD_FIELD_SPEC: FieldSpec<HTMLInputElement> = {
  find: {
    selectors: [
      'input[type=password]',
      'input[name^=pass]',
      'input[id^=pwd]',
      'input[title*=password i]',
      'input[placeholder*=password i]',
      'input[id*=password i]',
      'input[aria-label*=password i]',
      '.login input[type=password]',
    ],

    sort: [
      { test: /type="password"/, weight: 10 },
      { test: /name="pass/, weight: 8 },
      { test: /id="pwd/, weight: 4 },
      { test: /title="pass/, weight: 6 },
      { test: /id="password"/, weight: 10 },
      { test: /(name|id)="pass/, weight: 7 },
      { test: /placeholder="[^"]*password/i, weight: 9 },
    ],
  },
};

// -------------------------------------------------------------------------- //

export const SUBMIT_BUTTON_SPEC: FieldSpec = {
  prepare(root) {
    const loginButtonAttr = 'data-uno-hassubmittext';
    const loginTextRegExp =
      /^(login|log in|log-in|logon|log on|log-on|signin|sign in|sign-in|confirm|enter|next|continue)$/i;

    const query = [...this.find.selectors, 'button', 'a'].join(', ');
    const buttons = Array.prototype.slice.call(root.querySelectorAll(query)) as HTMLElement[];

    buttons
      .filter((button) => button.hasAttribute(loginButtonAttr) === false)
      .forEach((button) => {
        const text = button.innerText.trim().toLowerCase();
        const hasLoginText = loginTextRegExp.test(text);
        button.setAttribute(loginButtonAttr, hasLoginText ? 'yes' : 'no');
      });
  },

  find: {
    selectors: [
      'input[type=submit]',
      'button[type=submit]',
      'button[id*=login i]',
      'button[id*=signin i]',
      'button[id*=sign-in i]',
      'button[title*=login i]',
      "button[title*='log in' i]",
      'button[title*=signin i]',
      "button[title*='sign in' i]",
      "button[title*='sign-in' i]",
      'div[role=button]',
      'span[role=button]',
      '[data-uno-hassubmittext=yes]',
    ],

    sort: [
      { test: /type="submit"/, weight: 5 },
      { test: /(name|id|title)="(login|log[ _-]in|signin|sign[ _-]in)"/i, weight: 10 },
      { test: /<input .+data-uno-hassubmittext="yes"/, weight: 8 },
      { test: /<button .+data-uno-hassubmittext="yes"/, weight: 8 },
      { test: /<a .*data-uno-hassubmittext="yes"/, weight: 3 },
      { test: /<div .+data-uno-hassubmittext="yes"/, weight: 2 },
      { test: /<span .+data-uno-hassubmittext="yes"/, weight: 2 },
    ],
  },
};

// -------------------------------------------------------------------------- //

export const FORM_QUERIES = ['form', 'div.login', 'div.signin', 'div[role=dialog]'];
