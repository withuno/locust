# Locust

> Login form location utility forked from [`@buttercup/locust`](https://github.com/buttercup/locust).

## About

Locust helps find **login forms** by searching the DOM for common login form elements. It processes a page and returns _targets_ which can be used for automating logins.

## Installation

`npm install @withuno/locust`

## Usage

```ts
import { getLoginTarget } from "@withuno/locust";
const { getLoginTarget } = Locust;

getLoginTarget().login("myUsername", "myPassword");
```

The example above enters the username and password in the **best** form found on the page and then proceeds to submit that form (logging the user in).

_To find all forms on a page, use the `getLoginTargets` method instead, which returns an array of login targets. You can then sort through these to find all the different login forms that may exist._

In the case that you don't want to automatically log in, but still enter the details, you can use the following example:

> **Note**
> `getLoginTarget` may return `null` if no form is found.

```ts
getLoginTarget().enterDetails("myUsername", "myPassword");
```


### Events

Locust login targets will emit events when certain things happen. To listen for changes to the values of usernames and passwords on forms simply attach event listeners:

```ts
const target = getLoginTarget();
target.on("valueChanged", info => {
    if (info.type === "username") {
        console.log("New username:", info.value);
    }
});
// `type` can be "username" or "password"
```

> **Note**
> Login targets inherit from [`EventEmitter`](https://github.com/primus/eventemitter3), so you can use all other methods provided by their implementation.

You can also listen to form submissions:

```ts
const target = getLoginTarget();
target.once("formSubmitted", ({ source }) => {
    // `source` will either be "submitButton" or "form"
});
```

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

**Ad-hoc integration test:**

```zsh
npm run test:integration <url>

# for example:
npm run test:integration https://github.com/login
```
