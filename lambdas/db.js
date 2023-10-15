import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb"
import { logger } from "../../../Shared/Utils/logger"

const  client = new DynamoDBClient({})

const dynamo = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    convertEmptyValues: true,
  },
})

export default class DynamoDB {
  async dbPut(props) {
    try {
      const response = await dynamo.send(new PutCommand(props))
      logger.info("[DB] dbPut: " + JSON.stringify(response))
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
      logger.info("[DB] dbDelete: " + JSON.stringify(response))
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
      logger.info("[DB] dbGet: " + JSON.stringify(response))
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
      logger.info("[DB] dbScan: " + JSON.stringify(response))
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
    logger.info("Query params: " + JSON.stringify(props))
    try {
      const response = await dynamo.send(new QueryCommand(props))
      logger.info("[DB] dbQuery: " + JSON.stringify(response))
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
