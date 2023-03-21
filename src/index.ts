import { getSharedObserver } from './utils/unload-observer';

// Initialise the DOM unload observer
getSharedObserver();

export { LoginTarget, LoginTargetFieldType } from './login/login-target';
export { getVisibleLoginTarget, getLoginTarget, getLoginTargets } from './login';
