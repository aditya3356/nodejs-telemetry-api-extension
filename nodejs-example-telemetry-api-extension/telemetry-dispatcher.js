// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const { publishToSNSTopic } = require("./publish-to-sns");
const { writeToDDB } = require("./write-to-ddb");

const dispatchMinBatchSize = parseInt(process.env.DISPATCH_MIN_BATCH_SIZE || 1);
const EXECUTION_TIME = "ExecutionTime";
const ERROR_TIMESTAMP = "ErrorTimestamp";

async function dispatch(queue, force) {
  const platformReport = queue.filter(
    (event) => event.type === "platform.report"
  )[0];
  if (platformReport) {
    const lambdaExecutionTime = platformReport.record.metrics.durationMs;
    const errorLogs = [];
    queue.forEach((event) => {
      if (event.type === "function") {
        const parsedLog = event.record.split("\t");
        const logType = parsedLog[2];
        if (logType === "ERROR") {
          errorLogs.push({
            [EXECUTION_TIME]: lambdaExecutionTime,
            [ERROR_TIMESTAMP]: event.time,
            ...JSON.parse(parsedLog[3]),
          });
        }
      }
    });

    if (
      errorLogs.length !== 0 &&
      (force || errorLogs.length >= dispatchMinBatchSize)
    ) {
      if (errorLogs.length > 0) {
        console.log(
          "[telemetry-dispatcher:dispatch] Error logs are: ",
          JSON.stringify(errorLogs)
        );
        console.log(
          `[telemetry-dispatcher:dispatch] Sending SNS Notifications for ${errorLogs.length} Error logs`
        );
        for (const log of errorLogs) {
          console.log(
            `[telemetry-dispatcher:dispatch] Publishing notification for error log: `,
            JSON.stringify(log)
          );
          try {
            await publishToSNSTopic(log);
          } catch (err) {
            console.log(
              `[telemetry-dispatcher:dispatch] Error in publishing notification`,
              err
            );
          }
        }
        console.log("[telemetry-dispatcher:dispatch] SNS Notifications sent");
        console.log(
          `[telemetry-dispatcher:dispatch] Writing ${errorLogs.length} Error Logs to DDB`
        );
        await writeToDDB(errorLogs);
        console.log(
          "[telemetry-dispatcher:dispatch] Error Logs written to DDB"
        );
        queue.splice(0);
      }
    }
  }
}

module.exports = {
  dispatch,
};
