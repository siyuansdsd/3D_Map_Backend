import { MarksPostHandler } from '../marksHandler.js'
import { MarksGetAllHandler } from '../marksHandler.js'
import { MarksDeleteHandler } from '../marksHandler.js'
import { options } from '../marksHandler.js'

exports.marksHandler = async (event) => {
    try {
        switch (event.httpMethod) {
            case "POST":
                return await MarksPostHandler(event)
            case "GET":
                return await MarksGetAllHandler(event)
            case "DELETE":
                return await MarksDeleteHandler(event)
            case "OPTIONS":
                return await options(event)
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "Bad Request",
                    }),
                }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message,
            }),
        }
    }
}