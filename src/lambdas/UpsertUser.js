const aws = require('aws-sdk');

const dynamoDb = new aws.DynamoDB.DocumentClient();
const DynamoDbQuery = require('../lib/DynamoDbQuery');
const LambdaFy = require('../lib/LambdaFy');

class UpsertUser {
    static async handler(event) {
        try {
            const payload = event.body ? JSON.parse(event.body) : event;
            const errors = UpsertUser.checkErrors(payload);
            if (errors.length) {
                return LambdaFy.response({ errors, }, 400);
            }
            const body = await UpsertUser.upsert(UpsertUser.getUserFromEvent(payload));
            return LambdaFy.response(body, 200);
        } catch (err) {
            return LambdaFy.response({ errors: err, }, 500);
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

    static checkErrors(data) {
        const errors = [];
        UpsertUser.getValidKeys(['updated_at']).forEach((key) => {
            if (data[key] && typeof data[key] !== 'string') {
                errors.push(`${key} should be string, ${typeof data[key]} given`);
            }
        });
        if (errors.length) {
            return errors;
        }
        if (!data.email) {
            errors.push('email cannot be empty');
            return errors;
        }
        if (!UpsertUser.isEmailValid(data.email)) {
            errors.push(`email[${data.email}] is not valid`);
            return errors;
        }

        if (!data.mobile) {
            errors.push('mobile cannot be empty');
            return errors;
        }

        if (!/^[0-9]{3,10}$/.test(data.mobile)) {
            errors.push(`mobile[${data.mobile}] is not valid, it should contain 3 to 10 digits only`);
        }
        return errors;
    }

    static isEmailValid(email) {
        // eslint-disable-next-line no-useless-escape
        const regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regEx.test(email);
    }
}

exports.handler = UpsertUser.handler;
