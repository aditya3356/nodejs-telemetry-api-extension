const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const publishToSNSTopic = async (errorInfo) => {
  const snsClient = new SNSClient({ region: "ap-south-1" });

  const params = {
    Message: JSON.stringify(errorInfo),
    TopicArn: "arn:aws:sns:ap-south-1:119247788525:telemetry-lambda-errors",
  };

  try {
    console.log("Sending message now: ", JSON.stringify(params));
    const data = await snsClient.send(new PublishCommand(params));
    console.log(
      `[publish-to-sns:publishToSNSTopic] Message ${params.Message} sent to the topic ${params.TopicArn}`
    );
    console.log(
      "[publish-to-sns:publishToSNSTopic] MessageID is " + data.MessageId
    );
  } catch (err) {
    console.error(
      `[publish-to-sns:publishToSNSTopic] Error publishing to SNS topic, Message ${params.Message}`,
      err
    );
  }
};

module.exports = {
  publishToSNSTopic,
};
