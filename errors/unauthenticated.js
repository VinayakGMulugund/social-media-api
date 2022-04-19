const {StatusCodes} = require('http-status-codes');
const customApiError = require('./customapi');

class Unauthenticated extends customApiError {
    constructor(message) {
        super(message)
        this.statuscode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = Unauthenticated