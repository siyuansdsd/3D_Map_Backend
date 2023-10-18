import DynamoDB from "./db.js"

const dynamoDB = new DynamoDB()
const UsertableName = 'users-DB-20231015'

const makeId = (email, code) => {
    const ID = email + code
    return ID
}

export const UsersPostHandler = async (event) => {
    let body
    try {
        body = event.body ? JSON.parse(event.body) : {}
    }catch (error) {
        throw new Error("Invalid JSON Body")
    }
    const item = body
    const params = {
        TableName: UsertableName,
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
        Item: {
            users: 'user',
            id: makeId(item.email, item.code),  
            ...item,
        },
    }

    const response = await dynamoDB.dbPut(params)
    if (response.statusCode !== 200) {
        throw new Error(response.errorMessage)
    } else {
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': "*",
            },
            body: JSON.stringify({
                message: `Successfully added user ${item.name}`
            }),
        }
    }
}

export const usersOptions = async (event) => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    }
}

export const UsersGetOneHandler = async (event) => {
    let body
    try {
        body = event.body ? JSON.parse(event.body) : {}
    }catch (error) {
        throw new Error("Invalid JSON Body")
    }
    const item = body
    const params = {
        TableName: UsertableName,
        Key: {
            users: 'user',
            id: makeId(item.email, item.code),
        },
    }

    const response = await dynamoDB.dbGet(params)
    if (response.statusCode !== 200) {
        throw new Error(response.errorMessage)
    } else {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': "*",
            },
            body: JSON.stringify({
                message: "Successfully retrieved user",
                property: response.data,
            }),
        }
    }
}