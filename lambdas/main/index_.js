import { UsersPostHandler, usersOptions, UsersGetOneHandler  } from '../userHandler.js'

exports.UsersHandler = async (event) => {
    try {
    switch (event.httpMethod) {
        case "POST":
            return await UsersPostHandler(event)
        case "GET":
            return await UsersGetOneHandler(event)
        case "OPTIONS":
            return await usersOptions(event)
        default:
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Bad Request",
                }),
            }
    }
}catch (error) {
    return {
        statusCode: 500,
        body: JSON.stringify({
            message: error.message,
        }),
    }
}}

