

const aws = require('aws-sdk');

const dynamoDb = new aws.DynamoDB.DocumentClient();

class UpsertUser {
    static async handler(event) {
        try {
            return await UpsertUser.upsert(UpsertUser.getUserFromEvent(event));
        } catch (err) {
            return err.stack;
        }
    }

    static getUserFromEvent(event) {
        const user = {};
        UpsertUser.getValidKeys(['updated_at']).forEach((key) => {
            if (event[key]) {
                user[key] = event[key];
            }
        });
        UpsertUser.updated_at = new Date().getTime();
        return user;
    }

    static async upsert(user) {
        return new Promise((resolve, reject) => {
            dynamoDb.update(UpsertUser.getUpsertQuery(user), (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }

    static getUpsertQuery(user) {
        const upsertQuery = {
            TableName: 'users',
            Key: {
                mobile: user.mobile,
            },
        };
        const nonPartitionKeys = UpsertUser.getValidKeys(['mobile']);

        upsertQuery.UpdateExpression = 'SET ';
        upsertQuery.ExpressionAttributeValues = {};
        upsertQuery.ReturnValues = 'ALL_NEW';
        upsertQuery.ExpressionAttributeNames = {};
        const updateExpressionPairs = [];
        Object.keys(user).forEach((key) => {
            if (nonPartitionKeys.indexOf(key) !== -1) {
                updateExpressionPairs.push(`#${key}=:${key}`);
                upsertQuery.ExpressionAttributeNames[`#${key}`] = key;
                upsertQuery.ExpressionAttributeValues[`:${key}`] = user[key];
            }
        });
        upsertQuery.UpdateExpression += updateExpressionPairs.join(',');
        return upsertQuery;
    }

    static getValidKeys(excludeKeys = []) {
        const keys = [
            'name',
            'email',
            'mobile',
            'address',
            'company',
            'title',
            'updated_at',
        ];
        if (excludeKeys.length === 0) {
            return keys;
        }
        return keys.filter(key => excludeKeys.indexOf(key) === -1);
    }
}

exports.handler = UpsertUser.handler;
