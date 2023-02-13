const { DDB_TABLE_NAME, FUNCTION_ACCOUNT_ID, FUNCTION_NAME } = require("./constants");
const { fetchFromDDB } = require("./ddbdoc_query_item");

const homePage = (req, res) => {
    return res.json({message: "Welcome to DDB Query App!"});
};

const getLogs = async (req, res) => {
    const functionAccountID = req.query.account;
    const functionName = req.query.function;
    const limit = req.query.limit;
    const filters = [];

    if (functionAccountID) {
        filters.push("#functionAccountID = :functionAccountID")
    }
    if (functionName) {
        filters.push("#functionName = :functionName");
    }

    const expressionAttributeNames = {
        ...(functionAccountID && {"#functionAccountID": FUNCTION_ACCOUNT_ID}),
        ...(functionName && {"#functionName": FUNCTION_NAME})
    }

    const expressionAttributeValues = {
        ...(functionAccountID && {":functionAccountID": functionAccountID}),
        ...(functionName && {":functionName": functionName}),
    }

    const params = {
        TableName: DDB_TABLE_NAME,
        ...(filters.length>0 && {FilterExpression : filters.join(" AND ")}),
        ...(filters.length>0 && {ExpressionAttributeValues: expressionAttributeValues}),
        ...(filters.length>0 && {ExpressionAttributeNames: expressionAttributeNames}),
        ...(limit && {Limit: Number(limit)}),
    };

    return res.json(await fetchFromDDB(params, req.query.sort));
};

module.exports = { homePage, getLogs };