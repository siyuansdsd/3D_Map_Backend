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

function createApiStack(Stack, MarksTable, MarksDbArn ){
    const MarksLambda = new NodejsFunction(Stack, "MarksLambda", {
        runtime: Lambda.Runtime.NODEJS_16_X,
        handler: "marksHandler",
        entry: join(__dirname, "../dist/build.js"),
        environment: {
            TABLE_NAME: MarksTable,
        },
        tracing: Tracing.ACTIVE,
        timeout: Duration.minutes(1),
    })

    MarksLambda.addToRolePolicy(
        new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["dynamodb:*"],
            resources: [MarksDbArn],
        })
    )

    const api = new Apigateway.RestApi(Stack, "MarksApi", {
        restApiName: "Marks Service",
        description: "This service serves Marks.",
    })

    const marks = api.root.addResource("marks")
    const marksId = marks.addResource("{id}")

    const marksMethod = ["POST", "GET", "PUT"]
    const marksIdMethod = ["POST", "GET", "DELETE", "PUT"]

    marksMethod.forEach((method) => {
        marks.addMethod(method, new Apigateway.LambdaIntegration(MarksLambda))
    })

    marksIdMethod.forEach((method) => {
        marksId.addMethod(method, new Apigateway.LambdaIntegration(MarksLambda))
    })

    new Cdk.CfnOutput(Stack, "Marks API URL", {
        value: api.url,
        description: "Marks API URL",
    })

    return api
}

export default createApiStack;