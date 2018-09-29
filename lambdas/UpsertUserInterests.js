const aws = require('aws-sdk');

const dynamoDb = new aws.DynamoDB.DocumentClient();
const DynamoDbQuery = require('./DynamoDbQuery');

class UpsertUserInterests {
    static async handler(event) {
        try {
            return await UpsertUserInterests.update(UpsertUserInterests.getInterests(event), event);
        } catch (err) {
            return 'Unable to update user interests';
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
}

exports.handler = UpsertUserInterests.handler;
