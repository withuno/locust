import { expect } from 'chai';
import sinon from 'sinon';

import { LoginTarget } from '@src/targets/login';
import { FORM_QUERIES } from '@src/targets/login/fields';

describe('inputs', function () {
  describe('fetchFormsWithInputs', function () {
    interface FetchFormsWithInputsContext extends Mocha.Context {
      forms: Partial<HTMLFormElement>[];
      queryEl: { querySelectorAll: sinon.SinonStub };
    }

    beforeEach(function (this: FetchFormsWithInputsContext) {
      this.forms = [];
      const qsaStub = sinon.stub();
      qsaStub.returns([]).onFirstCall().returns(this.forms);
      this.queryEl = {
        querySelectorAll: qsaStub,
      };
    });

    it('fetches forms by name', function (this: FetchFormsWithInputsContext) {
      LoginTarget.findAll(this.queryEl as any);
      expect(this.queryEl.querySelectorAll.calledWithExactly(FORM_QUERIES.join(','))).to.be.true;
      expect(this.queryEl.querySelectorAll.calledOnce).to.be.true;
    });

    it('fetches elements under form', function (this: FetchFormsWithInputsContext) {
      const fakeForm = {
        elements: [] as any,
        querySelectorAll: sinon.stub().returns([]),
        tagName: 'form',
      };
      this.forms.push(fakeForm);
      LoginTarget.findAll(this.queryEl as any);
      expect(fakeForm.querySelectorAll.callCount).to.equal(5);
    });

    it('filters forms without password fields', function (this: FetchFormsWithInputsContext) {
      const fakeForm = {
        elements: [] as any,
        querySelectorAll: sinon.stub().callsFake(function (query) {
          if (/username/.test(query)) {
            return {};
          }
          return [];
        }),
        tagName: 'form',
      };
      this.forms.push(fakeForm);
      const forms = LoginTarget.findAll(this.queryEl as any);
      expect(forms).to.have.lengthOf(0);
    });
  });
});
