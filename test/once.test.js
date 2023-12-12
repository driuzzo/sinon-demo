const assert = require('assert');
const sinon = require('sinon');
const once = require('../once')

describe('testing once function', function() {
    it('calls the original function', function () {
        var callback = sinon.fake();
        var proxy = once(callback);

        proxy();

        assert(callback.calledOnce);
    });
})