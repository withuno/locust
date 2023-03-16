[@withuno/locust](README.md) / Exports

# @withuno/locust

## Table of contents

### Classes

- [LoginTarget](classes/LoginTarget.md)

### Functions

- [getLoginTarget](modules.md#getlogintarget)
- [getLoginTargets](modules.md#getlogintargets)

## Functions

### getLoginTarget

▸ **getLoginTarget**(`queryEl?`): ``null`` \| [`LoginTarget`](classes/LoginTarget.md)

Get the best login target on the current page.

**`See`**

getLoginTargets

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `queryEl` | `Document` \| `HTMLElement` | `document` | The element to query within |

#### Returns

``null`` \| [`LoginTarget`](classes/LoginTarget.md)

A login target or `null` if none found

#### Defined in

[src/loginTargets.ts:14](https://github.com/withuno/locust/blob/cd9b4e5/src/loginTargets.ts#L14)

___

### getLoginTargets

▸ **getLoginTargets**(`queryEl?`): [`LoginTarget`](classes/LoginTarget.md)[]

Fetch all login targets.

Fetches all detected login targets within some element (defaults to the
current document). Returned targets are not sorted or processed in any way
that would indicate how likely they are to be the 'correct' login form for
the page.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `queryEl` | `Document` \| `HTMLElement` | `document` | The element to query within. |

#### Returns

[`LoginTarget`](classes/LoginTarget.md)[]

An array of login targets.

#### Defined in

[src/loginTargets.ts:40](https://github.com/withuno/locust/blob/cd9b4e5/src/loginTargets.ts#L40)
