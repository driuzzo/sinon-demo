const sinon = require('sinon');
const referee = require('@sinonjs/referee');
const assert = referee.assert;

it('should be able to be used instead of spies', function () {
    const foo = {
        bar: () => 'baz',
    };
    //wrap existing method without changing its behaviour
    const fake = sinon.replace(foo, 'bar', sinon.fake(foo.bar));

    assert.equals(fake(), 'baz'); // behaviour is the same
    assert.equals(fake.callCount, 1); // calling information is saved
});

it('should be able to be used instead of stubs', function () {
    const foo = {
        bar: () => 'baz',
    };
    //replace method with a fake one
    const fake = sinon.replace(foo, 'bar', sinon.fake.returns('fake value'));

    assert.equals(fake(), 'fake value');
    assert.equals(fake.callCount, 1);
});

it('should create a fake without behaviour', function () {
    //create a basic fake, with no behaviour
    const fake = sinon.fake();

    assert.isUndefined(fake()); // by default returns undefined
    assert.equals(fake.callCount, 1);
});

it('should create a fake with custom behaviour', function () {
    // create a fake that returns the text "foo"
    const fake = sinon.fake.returns('foo');
    
    assert.equals(fake(), 'foo');
});

it('should create a fake that "returns"', function () {
    const fake = sinon.fake.returns('apple pie');

    assert.equals(fake(), 'apple pie');
});

it('should create a fake that "throws"', function () {
    const fake = sinon.fake.throws(new Error('not apple pie'));

    // expect to throw an error with message 'not apple pie'
    assert.exception(fake, {name: 'Error', message: 'not apple pie'});
})

