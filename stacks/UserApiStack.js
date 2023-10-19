import * as Cdk from "aws-cdk-lib"
import * as Apigateway from "aws-cdk-lib/aws-apigateway"
import * as Lambda from "aws-cdk-lib/aws-lambda"
import { Tracing } from "aws-cdk-lib/aws-lambda"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { Duration } from "aws-cdk-lib"
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
console.log(__dirname)

function createUsersApi (Stack, UsersTable, UsersDbArn) {
    const UsersLambda = new NodejsFunction(Stack, "UsersLambda", {
        runtime: Lambda.Runtime.NODEJS_16_X,
        handler: "UsersHandler",
        entry: join(__dirname, "../dist/build_.js"),
        environment: {
            TABLE_NAME: UsersTable,
        },
        tracing: Tracing.ACTIVE,
        timeout: Duration.minutes(1),
    })

    UsersLambda.addToRolePolicy(
        new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["dynamodb:*"],
            resources: [UsersDbArn],
        })
    )

    const user_api = new Apigateway.RestApi(Stack, "UsersApi", {
        restApiName: "Users Service",
        description: "This service serves Users.",
    })

    const usersMethod = ["POST", "OPTIONS"]
    const usersIdMethod = ["GET", "DELETE", "PUT", "OPTIONS"]

    const users = user_api.root.addResource("users")
    const usersId = users.addResource("{id}")

    usersMethod.forEach((method) => {
        users.addMethod(method, new Apigateway.LambdaIntegration(UsersLambda))
    })

    usersIdMethod.forEach((method) => {
        usersId.addMethod(method, new Apigateway.LambdaIntegration(UsersLambda))
    })

    new Cdk.CfnOutput(Stack, "Users API URL", {
        value: user_api.url,
        description: "Users API URL",
    })

    return user_api
}

export default createUsersApi;