import DynamoDB from "./db.js"

const dynamoDB = new DynamoDB()

export const MarksPostHandler = async (event) => {
    let body
    try {
        body = event.body ? JSON.parse(event.body) : {}
    }catch (error) {
        throw new Error("Invalid JSON Body")
    }
    const item = body
    const mark_type = item.type
    const mark_id = item.ID
    const params = {
        TableName: 'marks-DB-20231015',
        Item: {
            marks: 'mark',
            ...item,
        },
    }

    const response = await dynamoDB.dbPut(params)
    if (response.statusCode !== 200) {
        throw new Error(response.errorMessage)
    } else {
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: `Successfully added ${mark_type} with id ${mark_id}`,
                property: item,
            }),
        }
    }
}

export const MarksGetAllHandler = async () => {
    const params = {
        TableName: 'marks-DB-20231015',
    }

    const response = await dynamoDB.dbScan(params)
    if (response.statusCode !== 200) {
        throw new Error(response.errorMessage)
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Successfully retrieved all marks",
                property: response.data,
            }),
        }
    }
}

export const MarksDeleteHandler = async (event) => {
    const mark_id = event.pathParameters.id
    const params = {
        TableName: 'marks-DB-20231015',
        Key: {
            marks: "mark",
            id: mark_id,
        },
    }

    const response = await dynamoDB.dbDelete(params)
    if (response.statusCode !== 200) {
        throw new Error("fail to delete")
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully deleted mark with id ${mark_id}`,
            }),
        }
    }
}