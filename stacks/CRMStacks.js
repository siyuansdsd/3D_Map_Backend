import * as Cdk from 'aws-cdk-lib'
import createDynamoDB from './DBStack.js'
import createApiStack from './ApiStack.js'
import createUsersApi from './UserApiStack.js';
import dotenv from 'dotenv';

dotenv.config();

export class unitedCoder extends Cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props)

        const marksDBName = process.env.MARKS_DB_TABLE_NAME
        const usersDBName = process.env.USERS_DB_TABLE_NAME
        const marksDBArn = process.env.MARKS_DB_ARN
        const usersDBArn = process.env.USERS_DB_ARN
        console.log(marksDBArn)

        createDynamoDB(this, marksDBName, usersDBName)
        createApiStack(this, marksDBName, marksDBArn)
        createUsersApi(this, usersDBName, usersDBArn)
    }
}
export default unitedCoder;