const sinon = require("sinon");
const PubSub = require("pubsub-js");
const referee = require("@sinonjs/referee");
const assert = referee.assert;
const jsdom = require("jsdom");
const JSDOM = jsdom.JSDOM;
const window = new JSDOM().window;
const document = new JSDOM("").window;
const jQuery = require("jquery")(window);
global.document = document;

describe("Spies", function () {
    it("should call subscribers on publish", function () {
        const callback = sinon.spy();

        PubSub.subscribe("message", callback);
        PubSub.publishSync("message");

        assert(callback.called);
    });

    // this is just an example of an external library you might require()
    const myExternalLibrary = {
        getJSON(url) {
            return this._doNetworkCall({ url: url, dataType: "json"});
        },
        _doNetworkCall(httpParams) {
            console.log("Simulating fetching stuff from the network: ", httpParams);
            return { result: 42 };
        },
    };

    describe("Wrap all objects methods", function () {
        const sandbox = sinon.createSandbox();

        beforeEach(function () {
            sandbox.spy(myExternalLibrary);
        });

        afterEach(function () {
            sandbox.restore();
        });

        it("should inspect the external lib's usage of its internal methods", function () {
            const url = "https://jsonplaceholder.typicode.com/todos/1";
            myExternalLibrary.getJSON(url);

            assert(myExternalLibrary.getJSON.calledOnce);
            assert(myExternalLibrary._doNetworkCall.calledOnce);
            assert.equals(
                url,
                myExternalLibrary._doNetworkCall.getCall(0).args[0].url,
            );
            assert.equals(
                "json",
                myExternalLibrary._doNetworkCall.getCall(0).args[0].dataType,
            );
        });
    });

    describe("Wrap existing method", function () {
        const sandbox = sinon.createSandbox();

        beforeEach(function () {
            sandbox.spy(jQuery, "ajax");
        });

        afterEach(function () {
            sandbox.restore();
        });

        it("should inspect jQuery.getJSON's usage of jQuery.ajax", function () {
            const url = "https://jsonplaceholder.typicode.com/todos/1";
            jQuery.getJSON(url);

            assert(jQuery.ajax.calledOnce);
            assert.equals(url, jQuery.ajax.getCall(0).args[0].url);
            assert.equals("json", jQuery.ajax.getCall(0).args[0].dataType);
        });        
    });

    it('getter setter', function () {
        var object = {
            get test() {
                return this.property;
            },
            set test(value) {
                this.property = value * 2;
            },
        };
        var spy = sinon.spy(object, "test", ["get", "set"]);
        object.test = 42;
        assert(spy.set.calledOnce);
        assert.equals(object.test, 84);
        assert(spy.get.calledOnce);
    });
});

describe("PubSub", function (){
    it("should call subscribers with message as first argument", function () {
        const message = "an example message";
        const spy = sinon.spy();

        PubSub.subscribe(message, spy);
        PubSub.publishSync(message, "some payload");

        //all assertions is the same thing. second and third are more specific        
        assert(spy.calledWith(message));

        assert.equals(message, spy.args[0][0]);

        assert.equals(message, spy.getCall(0).args[0]);
    });
});

describe("WithArgs", function () {
    it("should call method once with each argument", function () {
        const object = { method() {} };
        const spy = sinon.spy(object, "method");

        object.method(42);
        object.method(1);

        assert(spy.withArgs(42).calledOnce);
        assert(spy.withArgs(1).calledOnce);
    });
});

describe("Return nth call", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
        sandbox.spy(jQuery, "ajax");
    });

    afterEach(function () {
        sandbox.restore();
    });

    it("should inspect jQuery.getJSON's usage of jQuery.ajax", function () {
        const url = "https://jsonplaceholder.typicode.com/todos/1";
        jQuery.ajax(url);
        const spyCall = jQuery.ajax.getCall(0);

        assert.equals(url, spyCall.args[0]);
    });
});