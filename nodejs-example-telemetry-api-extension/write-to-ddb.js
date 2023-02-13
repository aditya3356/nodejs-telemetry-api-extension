const crypto = require("crypto");
const AWS = require("aws-sdk");

const writeToDDB = async (logs) => {
  await new AWS.DynamoDB.DocumentClient({ region: "ap-south-1" })
    .batchWrite({
      RequestItems: {
        TelemetryLambdaErrors: logs.map((log) => {
          return {
            PutRequest: {
              Item: {
                ...log,
                ID: crypto.randomUUID(),
              },
            },
          };
        }),
      },
    })
    .promise()
    .then((data) => {
      console.log(`[write-to-ddb:writeToDDB] Written data to DDB`, data);
    })
    .catch((err) => {
      console.error(`[write-to-ddb:writeToDDB] Error writing data to DDB`, err);
    });
};

module.exports = {
  writeToDDB,
};
