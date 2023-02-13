const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { ddbDocClient } = require("./ddbDocClient");

const fetchFromDDB = async (params, sort) => {
  try {
    console.log(params);
    if (sort && ["asc", "desc", "ASC", "DESC"].includes(sort)) {
      const limit = params.Limit;
      delete params.Limit;
      const { Items } = await ddbDocClient.send(new ScanCommand(params));
      Items.sort((item1, item2) => {
        return new Date(item1.ErrorTimestamp) - new Date(item2.ErrorTimestamp);
      });
      if (sort.toLowerCase() === "desc") {
        Items.reverse();
      }
      console.log("Success. Item details: ", Items);
      if (limit) {
        return { success: true, data: Items.slice(0, limit) };
      }
      return { success: true, data: Items };
    } else {
      const { Items } = await ddbDocClient.send(new ScanCommand(params));
      console.log("Success. Item details: ", Items);
      return { success: true, data: Items };
    }
  } catch (err) {
    console.log("Error", err);
    return { success: false, data: [], error: err };
  }
};

module.exports = {
  fetchFromDDB,
};
