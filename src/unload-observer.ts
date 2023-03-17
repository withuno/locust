import EventEmitter from 'eventemitter3';

let __sharedInstance: UnloadObserver | undefined;

export default class UnloadObserver extends EventEmitter {
  private _willUnload = false;

  constructor() {
    super();
    window.addEventListener('beforeunload', () => {
      this._willUnload = true;
      this.emit('unloading');
    });
  }

  get willUnload() {
    return this._willUnload;
  }
}

export function getSharedObserver() {
  if (!__sharedInstance) {
    __sharedInstance = new UnloadObserver();
  }
  return __sharedInstance;
}
