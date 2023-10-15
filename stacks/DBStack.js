import * as Cdk from "aws-cdk-lib"
import * as Dynamodb from "aws-cdk-lib/aws-dynamodb"

export function createDynamoDB(stack, marksDBName, usersDBName) {
    const marksTable = new Dynamodb.Table(stack, "marks-Table", {
        tableName: marksDBName,
        partitionKey: { name: "type", type: Dynamodb.AttributeType.STRING },
        sortKey: { name: "id", type: Dynamodb.AttributeType.STRING },
        removalPolicy: Cdk.RemovalPolicy.DESTROY, // Only use destroy this in testing
        stream: Dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
        billingMode: Dynamodb.BillingMode.PAY_PER_REQUEST,
      })

    const usersTable = new Dynamodb.Table(stack, "users-Table", {
        tableName: usersDBName,
        partitionKey: { name: "users", type: Dynamodb.AttributeType.STRING },
        sortKey: { name: "id", type: Dynamodb.AttributeType.STRING },
        removalPolicy: Cdk.RemovalPolicy.DESTROY, // Only use destroy this in testing
        stream: Dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
        billingMode: Dynamodb.BillingMode.PAY_PER_REQUEST,
      })

    const tables = [marksTable, usersTable]

    for (let i = 0; i < tables.length; i++) {
        const table = tables[i]
        const tableName = i === 0 ? marksDBName : usersDBName
        new Cdk.CfnOutput(stack, `${tableName} ARN`, {
            value: table.tableArn,
            description: `ARN of the ${tableName} table`,
        })
    }

    return {marksTable, usersTable}
}

export default createDynamoDB;