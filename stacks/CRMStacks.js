import * as Cdk from 'aws-cdk-lib'
import createDynamoDB from './DBStack.js'
import dotenv from 'dotenv';

dotenv.config();

export class unitedCoder extends Cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props)

        const marksDBName = process.env.MARKS_DB_TABLE_NAME
        const usersDBName = process.env.USERS_DB_TABLE_NAME

        createDynamoDB(this, marksDBName, usersDBName)
    }
}
export default unitedCoder;