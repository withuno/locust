import { expect } from 'chai';
import sinon from 'sinon';

import { FORM_QUERIES } from '@src/login/input-patterns';
import { findFormsWithInputs, setInputValue, sortFormElements } from '@src/login/login-inputs';

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
      findFormsWithInputs(this.queryEl as any);
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
      findFormsWithInputs(this.queryEl as any);
      expect(fakeForm.querySelectorAll.calledThrice).to.be.true;
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
      const forms = findFormsWithInputs(this.queryEl as any);
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

  describe('sortFormElements', function () {
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
    });

    it('throws if no type is provided', function (this: SetFormElementsContext) {
      expect(() => {
        // @ts-expect-error
        sortFormElements(this.usernames);
      }).to.throw(/Type is invalid/i);
    });

    it('sorts username inputs correctly', function (this: SetFormElementsContext) {
      const sorted = sortFormElements(this.usernames, 'username');
      expect(sorted[0]).to.equal(this.username2);
      expect(sorted[1]).to.equal(this.username1);
    });
  });
});
