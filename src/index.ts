import { getSharedObserver } from './UnloadObserver';

// Initialise the DOM unload observer
getSharedObserver();

export { LoginTarget } from './LoginTarget';
export { getLoginTarget, getLoginTargets } from './loginTargets';
