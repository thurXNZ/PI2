const { Prisma } = require('@prisma/client');

function exceptionHandler(e, response) {
    console.log(e);
    let error = {
        code: 500,
        message: "Internal Server Error"
    }
    if (
        e instanceof Prisma.PrismaClientKnownRequestError ||
        e instanceof Prisma.PrismaClientValidationError
    ) {
        error.code = 400;
        error.message = e.message;
    }
    // return error;

    response.status(error.code).json({
        error: error.message,
    });
}

module.exports = { exceptionHandler };