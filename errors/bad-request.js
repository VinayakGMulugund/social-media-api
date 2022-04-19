const {StatusCodes} = require('http-status-codes');
const customApiError = require('./customapi');


class BadRequestError extends customApiError {
    constructor(message) {
        super(message)
        this.statuscode = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequestError