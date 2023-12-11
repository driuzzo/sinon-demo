const assert = require('assert')
const greeter = require('../greeter')
const sinon = require('sinon')

describe('testing the greeter', function() {
    it('checks the greet function', function() {
        var clock = sinon.useFakeTimers(new Date(2023, 11, 2))
        assert.equal(greeter.greet('Clarice'), 
        'Hello, Clarice! Today is sábado, 2 de dezembro de 2023.')
        clock.restore()
    })
})