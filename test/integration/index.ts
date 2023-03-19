/* eslint-disable @typescript-eslint/no-shadow */

import { start } from 'flik';

import { loginCommand } from './login';

start({
  binaryName: 'test:integration',
  version: '0.0.0',
  commands: [loginCommand],
});
