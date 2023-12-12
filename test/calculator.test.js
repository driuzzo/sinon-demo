const expect = require('chai').expect;
const sinon = require('sinon');


const divide = require('../calculator');

describe('Divide', () => {
    const sandbox = sinon.createSandbox();

    const SUT = {};
    SUT.divide = (a, b) => divide(a, b);
    SUT.half = (a) => SUT.divide(a, 2);

    beforeEach(() => {
        sandbox.spy(SUT, 'divide');

    });

    afterEach(() => {
        sandbox.restore();
    });

    it('was called once', () => {
        SUT.half(10, 2);
        expect(SUT.divide.calledOnce).to.be.ok;
    });

    it('second argument is 2', () => {
        SUT.half(10);
        expect(SUT.divide.firstCall.args[1]).to.eq(2);
    });

    it('unexpected error', () => {
        expect(SUT.divide.called).to.be.false;
    });
})