import { expect } from 'chai';
import sinon from 'sinon';

import { USERNAME_FIELD_SPEC } from '@src/targets/login/fields';
import { resolveElements } from '@src/utils/resolve-elements';

describe('resolveElements', function () {
  interface SetFormElementsContext extends Mocha.Context {
    username1: HTMLInputElement;
    username2: HTMLInputElement;
    usernames: HTMLInputElement[];
  }

  beforeEach(function (this: SetFormElementsContext) {
    this.username1 = document.createElement('input');
    this.username2 = document.createElement('input');
    this.username2.setAttribute('type', 'email');
    this.usernames = [this.username1, this.username2];

    const qsaStub = sinon.stub();
    qsaStub.onCall(0).returns([]);
    qsaStub.onCall(1).returns(this.usernames);
    this.queryEl = {
      querySelectorAll: qsaStub,
    };
  });

  it('sorts username inputs correctly', function (this: SetFormElementsContext) {
    const sorted = resolveElements(USERNAME_FIELD_SPEC, this.queryEl);
    expect(sorted[0]).to.equal(this.username2);
    expect(sorted[1]).to.equal(this.username1);
  });
});
