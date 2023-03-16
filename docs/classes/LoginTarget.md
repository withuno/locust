[@withuno/locust](../README.md) / [Exports](../modules.md) / LoginTarget

# Class: LoginTarget

The LoginTarget class which represents a 'target' for logging in
with some credentials

## Hierarchy

- `EventEmitter`

  ↳ **`LoginTarget`**

## Table of contents

### Constructors

- [constructor](LoginTarget.md#constructor)

### Properties

- [\_changeListeners](LoginTarget.md#_changelisteners)
- [\_forceSubmitDelay](LoginTarget.md#_forcesubmitdelay)
- [\_form](LoginTarget.md#_form)
- [\_passwordField](LoginTarget.md#_passwordfield)
- [\_submitButton](LoginTarget.md#_submitbutton)
- [\_usernameField](LoginTarget.md#_usernamefield)
- [baseScore](LoginTarget.md#basescore)
- [prefixed](LoginTarget.md#prefixed)

### Accessors

- [forceSubmitDelay](LoginTarget.md#forcesubmitdelay)
- [form](LoginTarget.md#form)
- [passwordField](LoginTarget.md#passwordfield)
- [submitButton](LoginTarget.md#submitbutton)
- [usernameField](LoginTarget.md#usernamefield)

### Methods

- [\_listenForUpdates](LoginTarget.md#_listenforupdates)
- [\_waitForNoUnload](LoginTarget.md#_waitfornounload)
- [addListener](LoginTarget.md#addlistener)
- [calculateScore](LoginTarget.md#calculatescore)
- [emit](LoginTarget.md#emit)
- [enterDetails](LoginTarget.md#enterdetails)
- [eventNames](LoginTarget.md#eventnames)
- [fillPassword](LoginTarget.md#fillpassword)
- [fillUsername](LoginTarget.md#fillusername)
- [listenerCount](LoginTarget.md#listenercount)
- [listeners](LoginTarget.md#listeners)
- [login](LoginTarget.md#login)
- [off](LoginTarget.md#off)
- [on](LoginTarget.md#on)
- [once](LoginTarget.md#once)
- [removeAllListeners](LoginTarget.md#removealllisteners)
- [removeListener](LoginTarget.md#removelistener)
- [submit](LoginTarget.md#submit)

## Constructors

### constructor

• **new LoginTarget**()

#### Inherited from

EventEmitter.constructor

## Properties

### \_changeListeners

• `Private` **\_changeListeners**: `Record`<`LoginTargetType`, ``null`` \| `ChangeListener`\>

#### Defined in

[src/LoginTarget.ts:42](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L42)

___

### \_forceSubmitDelay

• `Private` **\_forceSubmitDelay**: `number` = `FORCE_SUBMIT_DELAY`

#### Defined in

[src/LoginTarget.ts:41](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L41)

___

### \_form

• `Private` **\_form**: ``null`` \| `HTMLFormElement` = `null`

#### Defined in

[src/LoginTarget.ts:37](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L37)

___

### \_passwordField

• `Private` **\_passwordField**: ``null`` \| `HTMLInputElement` = `null`

#### Defined in

[src/LoginTarget.ts:39](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L39)

___

### \_submitButton

• `Private` **\_submitButton**: ``null`` \| `HTMLElement` = `null`

#### Defined in

[src/LoginTarget.ts:40](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L40)

___

### \_usernameField

• `Private` **\_usernameField**: ``null`` \| `HTMLInputElement` = `null`

#### Defined in

[src/LoginTarget.ts:38](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L38)

___

### baseScore

• **baseScore**: `number` = `0`

#### Defined in

[src/LoginTarget.ts:35](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L35)

___

### prefixed

▪ `Static` **prefixed**: `string` \| `boolean`

#### Inherited from

EventEmitter.prefixed

#### Defined in

node_modules/eventemitter3/index.d.ts:9

## Accessors

### forceSubmitDelay

• `get` **forceSubmitDelay**(): `number`

Delay in milliseconds that the library should wait before force
submitting the form.

#### Returns

`number`

#### Defined in

[src/LoginTarget.ts:53](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L53)

• `set` **forceSubmitDelay**(`delay`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `delay` | `number` |

#### Returns

`void`

#### Defined in

[src/LoginTarget.ts:56](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L56)

___

### form

• `get` **form**(): ``null`` \| `HTMLFormElement`

The target login form.

#### Returns

``null`` \| `HTMLFormElement`

#### Defined in

[src/LoginTarget.ts:63](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L63)

• `set` **form**(`form`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `form` | ``null`` \| `HTMLFormElement` |

#### Returns

`void`

#### Defined in

[src/LoginTarget.ts:66](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L66)

___

### passwordField

• `get` **passwordField**(): ``null`` \| `HTMLInputElement`

The password input element.

#### Returns

``null`` \| `HTMLInputElement`

#### Defined in

[src/LoginTarget.ts:76](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L76)

• `set` **passwordField**(`field`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | ``null`` \| `HTMLInputElement` |

#### Returns

`void`

#### Defined in

[src/LoginTarget.ts:79](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L79)

___

### submitButton

• `get` **submitButton**(): ``null`` \| `HTMLElement`

The submit button element.

#### Returns

``null`` \| `HTMLElement`

#### Defined in

[src/LoginTarget.ts:89](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L89)

• `set` **submitButton**(`button`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `button` | ``null`` \| `HTMLElement` |

#### Returns

`void`

#### Defined in

[src/LoginTarget.ts:92](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L92)

___

### usernameField

• `get` **usernameField**(): ``null`` \| `HTMLInputElement`

The username input element.

#### Returns

``null`` \| `HTMLInputElement`

#### Defined in

[src/LoginTarget.ts:102](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L102)

• `set` **usernameField**(`field`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | ``null`` \| `HTMLInputElement` |

#### Returns

`void`

#### Defined in

[src/LoginTarget.ts:105](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L105)

## Methods

### \_listenForUpdates

▸ **_listenForUpdates**<`El`\>(`type`, `input`): `void`

Attach an event listener to listen for input changes
Attaches listeners for username/password input changes and emits an event
when a change is detected.

**`Fires`**

LoginTarget#valueChanged

**`Fires`**

LoginTarget#formSubmitted

#### Type parameters

| Name | Type |
| :------ | :------ |
| `El` | extends `HTMLElement`<`El`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `LoginTargetType` | The type of input (username/password). |
| `input` | `El` | The target element. |

#### Returns

`void`

#### Defined in

[src/LoginTarget.ts:233](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L233)

___

### \_waitForNoUnload

▸ **_waitForNoUnload**(): `Promise`<`void`\>

Wait for either the unload event to fire or the delay to time out.

#### Returns

`Promise`<`void`\>

A promise that resolves once either the delay has
expired for the page has begun unloading.

#### Defined in

[src/LoginTarget.ts:278](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L278)

___

### addListener

▸ **addListener**<`T`\>(`event`, `fn`, `context?`): [`LoginTarget`](LoginTarget.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `T` |
| `fn` | (...`args`: `any`[]) => `void` |
| `context?` | `any` |

#### Returns

[`LoginTarget`](LoginTarget.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/eventemitter3/index.d.ts:45

___

### calculateScore

▸ **calculateScore**(): `number`

Calculate the score of the login target.
This can be used to compare LoginTargets by their likelihood of being
the correct login form. Higher number is better.

#### Returns

`number`

The calculated score.

#### Defined in

[src/LoginTarget.ts:119](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L119)

___

### emit

▸ **emit**<`T`\>(`event`, `...args`): `boolean`

Calls each of the listeners registered for a given event.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `T` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/eventemitter3/index.d.ts:32

___

### enterDetails

▸ **enterDetails**(`username`, `password`): `Promise`<[`void`, `void`]\>

Enter credentials into the form without logging in.

**`Example`**

```ts
loginTarget.enterDetails("myUsername", "myPassword");
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `username` | `string` | The username to enter |
| `password` | `string` | The password to enter |

#### Returns

`Promise`<[`void`, `void`]\>

A promise that resolves once the data has been entered

#### Defined in

[src/LoginTarget.ts:171](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L171)

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

Return an array listing the events for which the emitter has registered
listeners.

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/eventemitter3/index.d.ts:15

___

### fillPassword

▸ **fillPassword**(`password`): `Promise`<`void`\>

Fill password into the password field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `password` | `string` | The password to enter. |

#### Returns

`Promise`<`void`\>

A promise that resolves once the data has been entered.

#### Defined in

[src/LoginTarget.ts:151](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L151)

___

### fillUsername

▸ **fillUsername**(`username`): `Promise`<`void`\>

Fill username into the username field.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `username` | `string` | The username to enter. |

#### Returns

`Promise`<`void`\>

A promise that resolves once the data has been entered.

#### Defined in

[src/LoginTarget.ts:137](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L137)

___

### listenerCount

▸ **listenerCount**(`event`): `number`

Return the number of listeners listening to a given event.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/eventemitter3/index.d.ts:27

___

### listeners

▸ **listeners**<`T`\>(`event`): (...`args`: `any`[]) => `void`[]

Return the listeners registered for a given event.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `T` |

#### Returns

(...`args`: `any`[]) => `void`[]

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/eventemitter3/index.d.ts:20

___

### login

▸ **login**(`username`, `password`, `force?`): `Promise`<`void`\>

Login using the form.

Enters the credentials into the form and logs in by either pressing the
login button or by submitting the form. The `force` option allows for
trying both methods: first by clicking the button and second by calling
`form.submit()`. When using `force=true`, if clicking the button doesn't
unload the page in `target.forceSubmitDelay` milliseconds,
`form.submit()` is called. If no form submit button is present, `force`
does nothing as `form.submit()` is called immediately.

**`Example`**

```ts
loginTarget.login("myUsername", "myPassword");
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `username` | `string` | `undefined` | The username to login with. |
| `password` | `string` | `undefined` | The password to login with. |
| `force` | `boolean` | `false` | Whether or not to force the login (defaults to false). |

#### Returns

`Promise`<`void`\>

A promise that resolves once the login procedure has
completed. Let's be honest: there's probably no point to listen to the
return value of this function.

#### Defined in

[src/LoginTarget.ts:199](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L199)

___

### off

▸ **off**<`T`\>(`event`, `fn?`, `context?`, `once?`): [`LoginTarget`](LoginTarget.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `T` |
| `fn?` | (...`args`: `any`[]) => `void` |
| `context?` | `any` |
| `once?` | `boolean` |

#### Returns

[`LoginTarget`](LoginTarget.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/eventemitter3/index.d.ts:69

___

### on

▸ **on**<`T`\>(`event`, `fn`, `context?`): [`LoginTarget`](LoginTarget.md)

Add a listener for a given event.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `T` |
| `fn` | (...`args`: `any`[]) => `void` |
| `context?` | `any` |

#### Returns

[`LoginTarget`](LoginTarget.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/eventemitter3/index.d.ts:40

___

### once

▸ **once**<`T`\>(`event`, `fn`, `context?`): [`LoginTarget`](LoginTarget.md)

Add a one-time listener for a given event.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `T` |
| `fn` | (...`args`: `any`[]) => `void` |
| `context?` | `any` |

#### Returns

[`LoginTarget`](LoginTarget.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/eventemitter3/index.d.ts:54

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`LoginTarget`](LoginTarget.md)

Remove all listeners, or those of the specified event.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`LoginTarget`](LoginTarget.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/eventemitter3/index.d.ts:79

___

### removeListener

▸ **removeListener**<`T`\>(`event`, `fn?`, `context?`, `once?`): [`LoginTarget`](LoginTarget.md)

Remove the listeners of a given event.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `T` |
| `fn?` | (...`args`: `any`[]) => `void` |
| `context?` | `any` |
| `once?` | `boolean` |

#### Returns

[`LoginTarget`](LoginTarget.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/eventemitter3/index.d.ts:63

___

### submit

▸ **submit**(`force?`): `Promise`<`void`\>

Submit the associated form.

You probably don't want this function. `login` or `enterDetails` are way
better.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `force` | `boolean` | `false` | Force the submission (defaults to false). |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/LoginTarget.ts:211](https://github.com/withuno/locust/blob/cd9b4e5/src/LoginTarget.ts#L211)
