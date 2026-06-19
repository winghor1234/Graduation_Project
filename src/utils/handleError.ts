import { BadRequestError, errorResponse, ForbiddenError, NotFoundError, UnauthorizedError } from "./response"

export const handleError = (error: unknown) => {
    if (
        error instanceof BadRequestError ||
        error instanceof NotFoundError ||
        error instanceof ForbiddenError ||
        error instanceof UnauthorizedError
    ) {
        return errorResponse(error.message, error.statusCode)
    }
    console.error(error)
    return errorResponse("Internal Server Error", 500)
}