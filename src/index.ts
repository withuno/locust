import { getSharedObserver } from './unload-observer';

// Initialise the DOM unload observer
getSharedObserver();

export { LoginTarget, LoginTargetType } from './login/login-target';
export { getVisibleLoginTarget, getLoginTarget, getLoginTargets } from './login';
