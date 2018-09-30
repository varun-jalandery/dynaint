const aws4 = require('aws4');
const https = require('https');

class AwsSign {

    static async request(api, method = 'POST', body = null, headers = {}) {
        const opts = {
            host: `${process.env.API_BASE_URL}`,
            path: `/${process.env.API_ENV}${process.env[api]}`,
            method
        };
        if (body) {
            opts.body = JSON.stringify(body);
        }
        if (Object.keys(headers).length) {
            opts.headers = headers;
        } else {
            opts.headers = { 'Content-Type' : 'application/json' };
        }
        aws4.sign(opts);
        return new Promise((resolve) => {
            https.request(
                opts,
                res => res.on('data', data => {
                    try {
                        const body = JSON.parse(data.toString());
                        return resolve(body);
                    } catch(err) {
                        return reject(err);
                    }
                })
            ).end(opts.body || {});
        });
    }
}

module.exports = AwsSign;