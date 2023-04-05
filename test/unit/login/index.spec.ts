import { expect } from 'chai';
import sinon from 'sinon';

import { getLoginTargets } from '@src/login';
import { FORM_QUERIES } from '@src/login/fields';
import { setInputValue } from '@src/utils/dom';

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
      getLoginTargets(this.queryEl as any);
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
      getLoginTargets(this.queryEl as any);
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
      const forms = getLoginTargets(this.queryEl as any);
      expect(forms).to.have.lengthOf(0);
    });
  });

  describe('setInputValue', function () {
    interface SetInputValueContext extends Mocha.Context {
      input: HTMLInputElement;
    }

    beforeEach(function (this: SetInputValueContext) {
      this.input = document.createElement('input');
      document.body.appendChild(this.input);
    });

    afterEach(function (this: SetInputValueContext) {
      document.body.removeChild(this.input);
    });

    it("sets the input's value", function (this: SetInputValueContext) {
      expect(this.input.value).to.equal('');
      setInputValue(this.input, 'new value');
      expect(this.input.value).to.equal('new value');
    });

    it("fires the input's 'input' event", function (this: SetInputValueContext) {
      return new Promise<void>((resolve) => {
        this.input.addEventListener(
          'input',
          (event) => {
            expect((event.target as HTMLInputElement).value).to.equal('123');
            resolve();
          },
          false,
        );
        setInputValue(this.input, '123');
      });
    });

    it("fires the input's 'change' event", function (this: SetInputValueContext) {
      return new Promise<void>((resolve) => {
        this.input.addEventListener(
          'change',
          (event) => {
            expect((event.target as HTMLInputElement).value).to.equal('456');
            resolve();
          },
          false,
        );
        setInputValue(this.input, '456');
      });
    });
  });
});
