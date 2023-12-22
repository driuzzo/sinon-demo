const sinon = require("sinon");
const PubSub = require("pubsub-js");
const referee = require("@sinonjs/referee");
const assert = referee.assert;
const bluebird = require("bluebird");
const jsdom = require("jsdom");
const JSDOM = jsdom.JSDOM;
const window = new JSDOM().window;
const jQuery = require("jquery")(window);


describe("PubSub", function () {
    it("should call all subscribers, even if there are exceptions", function () {
        const message = "an example message";
        const stub = sinon.stub().throws();
        const spy1 = sinon.spy();
        const spy2 = sinon.spy();
        const clock = sinon.useFakeTimers();

        PubSub.subscribe(message, stub);
        PubSub.subscribe(message, spy1);
        PubSub.subscribe(message, spy2);

        assert.exception(() => {
            PubSub.publishSync(message, "some data");

            // PubSubJS reschedules exceptions using setTimeout(fn,0)
            // We have faked the clock, so just tick the clock to throw!
            clock.tick(1);
        });

        assert.exception(stub);
        assert(spy1.called);
        assert(spy2.called);
        assert(stub.calledBefore(spy1));

        clock.restore();
    });
});

describe("stubbed callback", function () {
    it("should behave differently based on arguments", function () {
        const callback = sinon.stub();
        callback.withArgs(42).returns(1);
        callback.withArgs(1).throws("name");

        assert.isUndefined(callback()); // No return value, no exception
        assert.equals(callback(42), 1); // Returns 1
        assert.equals(callback.withArgs(42).callCount, 1); // Use withArgs in assertion

        assert.exception(() => {
            callback(1);
        }); // Throws Error("name")        
    });
    it("should behave differently on consecutive calls", function () {
        const callback = sinon.stub();
        callback.onCall(0).returns(1);
        callback.onCall(1).returns(2);
        callback.returns(3);

        assert.equals(callback(), 1); // Returns 1
        assert.equals(callback(), 2); // Returns 2
        assert.equals(callback(), 3); // All following calls returns 3
        assert.equals(callback(), 3);
    });

    it("should behave differently on consecutive calls with certain argument", function () {
        const callback = sinon.stub();

        callback
            .withArgs(42)
            .onFirstCall()
            .returns(1)
            .onSecondCall()
            .returns(2);

        callback.returns(0);

        assert.equals(callback(1), 0);
        assert.equals(callback(42), 1);
        assert.equals(callback(1), 0);
        assert.equals(callback(42), 2);
        assert.equals(callback(1), 0);
        assert.equals(callback(42), 0);
    });
});

describe("reset", function () {
    it("should reset behaviour", function () {
        const stub = sinon.stub();

        stub.returns(54);

        assert.equals(stub(), 54);

        stub.resetBehavior();

        assert.isUndefined(stub());
    });

    it("should reset history", function () {
        const stub = sinon.stub();

        assert.isFalse(stub.called);

        stub();

        assert.isTrue(stub.called);

        stub.resetHistory();

        assert.isFalse(stub.called);
    });
});

const myObj = {};
myObj.prop = function propFn() {
    return "foo";
};

describe("stub callfake", function () {
    it("should call fake", function () {
        sinon.stub(myObj, "prop").callsFake(function fakeFn() {
            return "bar";
        });

        assert.equals(myObj.prop(), "bar");
    });
});

const obj2 = {};
obj2.sum = function sum(a, b) {
    return a + b;
};

describe("stub callThrough", function () {
    it("should callThrough", function () {
        sinon
            .stub(obj2, "sum")
            .withArgs(2, 2)
            .callsFake(function f00() {
                return "bar"
            });

        obj2.sum.callThrough();

        assert.equals(obj2.sum(2, 2), "bar");
        assert.equals(obj2.sum(1, 2), 3);
    });
});

const obj3 = {};

obj3.Sum = function MyConstructor(a, b) {
    this.result = a + b;
};

describe("stub callThroughWithNew", function () {
    it("should call through with new operator", function () {
        sinon
            .stub(obj3, "Sum")
            .callThroughWithNew()
            .withArgs(1, 2)
            .returns({ result: 9000 });

        assert.equals(new obj3.Sum(2, 2).result, 4);
        assert.equals(new obj3.Sum(1, 2).result, 9000);
    });
});

const myObj2 = {
    saveSomething: sinon.stub().usingPromise(bluebird.Promise).resolves("baz"),
};

describe("stub promise", function () {
    it("should resolve using specific Promise library", function () {
        myObj2.saveSomething().tap(function (actual) {
            assert.equals(actual, "baz");
        });
    });
});

describe("fake ajax request", function () {
    it("test should fake successfull ajax request", function () {
        sinon.stub(jQuery, "ajax").yieldsTo("success", [1, 2, 3]);
    
        jQuery.ajax({
            success: function(data) {
                assert.equals([1, 2, 3], data);
            }
        });
    });
});

describe("stub specified callback", function () {
    it("should call specified callback", function () {
        let actual;
        const callback = sinon.stub();
        callback({
            sucess() {
                actual = "Success!";
            },
            failure() {
                actual = "Oh noes!";
            },
        });

        callback.yieldTo("failure");

        assert.equals(actual, "Oh noes!");
    });
});








