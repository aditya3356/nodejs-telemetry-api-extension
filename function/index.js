const fs = require("fs");

const FUNCTION_NAME = "FunctionName";
const FUNCTION_REGION = "FunctionRegion";
const FUNCTION_ACCOUNT_ID = "FunctionAccountID";
const EXECUTION_ID = "ExecutionID";
const ERROR_TYPE = "ErrorType";
const ERROR_MESSAGE = "ErrorMessage";
const ERROR_STACK_TRACE = "ErrorStackTrace";
const errorMetaData = {};

const generateErrorMetaData = (context) => {
  errorMetaData[FUNCTION_NAME] = context.functionName;
  errorMetaData[FUNCTION_REGION] = context.invokedFunctionArn.split(":")[3];
  errorMetaData[FUNCTION_ACCOUNT_ID] = context.invokedFunctionArn.split(":")[4];
  errorMetaData[EXECUTION_ID] = context.awsRequestId;
};

const extractErrorInformation = (err) => {
  return {
    [ERROR_TYPE]: err.name,
    [ERROR_MESSAGE]: err.message,
    [ERROR_STACK_TRACE]: err.stack,
  };
};

exports.handler = async (event, context) => {
  console.log("Lambda execution started", { event });
  generateErrorMetaData(context);

  try {
    const data = fs.readFileSync("/Users/Kedar/node.txt");
  } catch (err) {
    const errorInfo = JSON.stringify({
      ...errorMetaData,
      ...extractErrorInformation(err),
    });
    console.error(errorInfo);
  }
  try {
    doFailSomeWay();
  } catch (err) {
    const errorInfo = JSON.stringify({
      ...errorMetaData,
      ...extractErrorInformation(err),
    });
    console.error(errorInfo);
  }
  try {
    doFailAnotherWay();
  } catch (err) {
    const errorInfo = JSON.stringify({
      ...errorMetaData,
      ...extractErrorInformation(err),
    });
    console.error(errorInfo);
  }

  console.log("Lambda Execution ended");
};
