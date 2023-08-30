# Locust

> Login form location utility forked from [`@buttercup/locust`](https://github.com/buttercup/locust).

[![Run Unit & Integration Tests](https://github.com/withuno/locust/actions/workflows/test.yml/badge.svg)](https://github.com/withuno/locust/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/@withuno/locust?color=blue)](https://www.npmjs.com/package/@withuno/locust)

## About

Locust helps find **login forms** by searching the DOM for common login form elements. It processes a page and returns _targets_ which can be used for automating logins.

## Installation

`npm install @withuno/locust`

## Usage

```ts
import { LoginTarget } from "@withuno/locust";

const target = LoginTarget.find();

if (target) {
  const form = target.get("form");
  const usernameInput = target.get("username");
  const passwordInput = target.get("password");
  const submitButton = target.get("submit");

  usernameInput.value = "myUsername";
  passwordInput.value = "myPassword";
  submitButton.click();
}
```

The example above enters the username and password in the **best** form found on the page and then proceeds to submit that form (logging the user in).

_To find all forms on a page, use the `LoginTarget.findAll()` method instead, which returns an array of login targets. You can then sort through these to find all the different login forms that may exist._

> [!NOTE]
> `LoginTarget.find()` may return `null` if no form is found.

---

## Development

### Environment Setup

1. First, download all dependencies using NPM:

   ```zsh
   npm install
   ```

2. You can start serving a hot-reloading development server with the following command:

   ```zsh
   npm run dev
   ```

### Testing

**Unit tests:**

```zsh
npm run test:unit
```

**Integration tests:**

```zsh
npm run test:integration
```

**On-demand integration test:**

```zsh
npm run test:integration <url>

# for example:
npm run test:integration https://github.com/login
```

### VSCode Workspace Setup _(optional)_

#### Recommended Extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

#### Optimal Settings:

```js
{
  // A listing of language IDs which should be validated by ESLint.
  // NOTE: If not installed, ESLint will show an error.
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],

  // ESLint rules that should be executed when computing `codeActionsOnSave`.
  // You can ignore rules using glob patterns (e.g.: "!@typescript-eslint/no-unsafe-assignment").
  "eslint.codeActionsOnSave.rules": [
    "*"
  ],

  // Code actions to be executed upon save.
  //
  // NOTE: To improve performance, code actions
  // should be "opt-in" on a per-extension basis.
  "editor.codeActionsOnSave": {
    "source.fixAll": false,
    "source.organizeImports": false,
    "source.fixAll.eslint": true,
  },
}
```
