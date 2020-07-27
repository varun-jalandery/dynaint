require('dotenv').config();
const aws = require('aws-sdk');

class Lambda {
    constructor() {
        this.lambda = new aws.Lambda(
            {
                region: process.env.AWS_REGION, // aws region
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        );
    }

    async invoke(fnName, payload) {
        return new Promise((resolve, reject) => {
            this.lambda.invoke(
                {
                    FunctionName: fnName,
                    LogType: 'Tail',
                    Payload: JSON.stringify(payload),
                },
                (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    try {
                        const jsonObj = JSON.parse(data.Payload);
                        return resolve(jsonObj);
                    } catch (ex) {
                        return reject(ex);
                    }
                }
            );
        });
    }
}
module.exports = Lambda;
