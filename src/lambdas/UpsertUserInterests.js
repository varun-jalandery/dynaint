const aws = require('aws-sdk');

const dynamoDb = new aws.DynamoDB.DocumentClient();
const DynamoDbQuery = require('../lib/DynamoDbQuery');
const LambdaFy = require('../lib/LambdaFy');

class UpsertUserInterests {
    static async handler(event) {
        try {
            const payload = event.body ? JSON.parse(event.body) : event;
            const errors = UpsertUserInterests.checkErrors(payload);
            if (errors.length) {
                return LambdaFy.response({ errors, }, 400);
            }
            const body = await UpsertUserInterests.update(
                UpsertUserInterests.getInterests(payload)
            );
            return LambdaFy.response(body, 200);
        } catch (err) {
            return LambdaFy.response({ errors: err, }, 500);
        }
    }

    static getInterests(event) {
        const interests = {};
        UpsertUserInterests.getAllowedInterestTypes().forEach((interestType) => {
            if (event.interests[interestType] && Array.isArray(event.interests[interestType])) {
                interests[interestType] = event.interests[interestType];
            }
        });

        return { interests, mobile: event.mobile, };
    }

    static async update(data) {
        return new Promise((resolve, reject) => {
            dynamoDb.update(
                DynamoDbQuery.getUpsertQuery(data, 'users', 'mobile'),
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                }
            );
        });
    }

    static getAllowedInterestTypes() {
        return [
            'sports',
            'movies',
            'music',
            'technology',
            'arts',
            'politics',
            'health',
            'science',
        ];
    }

    static checkErrors(data) {
        const errors = [];
        if (!data.mobile) {
            errors.push('mobile cannot be empty');
            return errors;
        }

        if (!/^[0-9]{3,10}$/.test(data.mobile)) {
            errors.push(`mobile[${data.mobile}] is not valid, it should contain 3 to 10 digits only`);
        }

        if (!data.interests) {
            errors.push('interests cannot be empty');
            return errors;
        }

        if (typeof data.interests !== 'object') {
            errors.push(`interests should be object, ${typeof data.interests} given`);
        }
        return errors;
    }
}

exports.handler = UpsertUserInterests.handler;
