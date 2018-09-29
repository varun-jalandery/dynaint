class LambdaFy {
    static response(
        body,
        statusCode = 200,
        headers = {},
        isBase64Encoded = false
    ) {
        const response = {
            statusCode,
            isBase64Encoded,
            body: JSON.stringify(body),
        };
        if (Object.keys(headers).length) {
            response.headers = headers;
        }
        return response;
    }
}

module.exports = LambdaFy;
