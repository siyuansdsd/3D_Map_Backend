import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})

const dynamo = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    convertEmptyValues: true,
  },
})

export default class DynamoDB {
  async dbPut(props) {
    try {
      const response = await dynamo.send(new PutCommand(props))
      console.info("[DB] dbPut: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error).stack,
      }
    }
  }

  async dbDelete(props) {
    try {
      const response = await dynamo.send(new DeleteCommand(props))
      console.info("[DB] dbDelete: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error).stack,
      }
    }
  }

  async dbGet(props) {
    try {
      const response = await dynamo.send(new GetCommand(props))
      console.info("[DB] dbGet: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
        data: [response.Item],
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error).stack,
      }
    }
  }

  // TODO: pagination
  async dbScan(props) {
    try {
      const response = await dynamo.send(new ScanCommand(props))
      console.info("[DB] dbScan: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
        data: response.Items,
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error).stack,
      }
    }
  }

  async dbQuery(props) {
    console.info("Query params: " + JSON.stringify(props))
    try {
      const response = await dynamo.send(new QueryCommand(props))
      console.info("[DB] dbQuery: " + JSON.stringify(response))
      return {
        statusCode: response.$metadata.httpStatusCode || 200,
        data: response.Items,
        id: response.$metadata.requestId,
      }
    } catch (error) {
      return {
        statusCode: 500,
        errorMessage: (error).stack,
      }
    }
  }
}
