class DynamoDbQuery {
    static getUpsertQuery(data, tableName, partitionKeyName) {
        const upsertQuery = {
            TableName: tableName,
            Key: {},
        };

        upsertQuery.Key[partitionKeyName] = data[partitionKeyName];

        upsertQuery.UpdateExpression = 'SET ';
        upsertQuery.ExpressionAttributeValues = {};
        upsertQuery.ReturnValues = 'ALL_NEW';
        upsertQuery.ExpressionAttributeNames = {};
        const updateExpressionPairs = [];
        Object.keys(data).forEach((key) => {
            if (key !== partitionKeyName) {
                updateExpressionPairs.push(`#${key}=:${key}`);
                upsertQuery.ExpressionAttributeNames[`#${key}`] = key;
                upsertQuery.ExpressionAttributeValues[`:${key}`] = data[key];
            }
        });
        upsertQuery.UpdateExpression += updateExpressionPairs.join(',');
        return upsertQuery;
    }
}

module.exports = DynamoDbQuery;
