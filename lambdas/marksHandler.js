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
    const prop = {
        TableName: process.env.MARKS_DB_TABLE_NAME,
        Item: {
            marks: mark_type,
            ...item,
        },
    }

}