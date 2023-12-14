const assert = require("assert");
const sinon = require("sinon");
const once = require("../once")

describe("testing once function", function() {
    it("calls the original function", function () {
        var callback = sinon.fake();
        var proxy = once(callback);

        proxy();

        assert(callback.calledOnce);
    });

    it("calls original function with right this and args", function () {
        var callback = sinon.fake();
        var proxy = once(callback);
        var obj = {};

        proxy.call(obj, 1, 2, 3);

        assert(callback.calledOn(obj));
        assert(callback.calledWith(1, 2, 3));
    })
})