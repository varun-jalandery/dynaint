const aws = require('aws-sdk');

const dynamoDb = new aws.DynamoDB.DocumentClient();
const DynamoDbQuery = require('./DynamoDbQuery');
const LambdaFy = require('./LambdaFy');

class UpsertUser {
    static async handler(event) {
        try {
            const payload = event.body ? JSON.parse(event.body) : event;
            const body = await UpsertUser.upsert(UpsertUser.getUserFromEvent(payload));
            return LambdaFy.response(body, 200);
        } catch (err) {
            return LambdaFy.response(err, 500);
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
            dynamoDb.update(
                DynamoDbQuery.getUpsertQuery(user, 'users', 'mobile'),
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                }
            );
        });
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
