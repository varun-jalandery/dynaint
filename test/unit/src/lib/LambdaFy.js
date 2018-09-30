const { expect, } = require('chai');
const LambdaFy = require('src/lib/LambdaFy');


describe('src/lib/LambdaFy', () => {
    let response = null;
    before(() => {
        response = LambdaFy.response(
            { foo: 'bar', },
            200,
            { 'x-foo-val': 'bar', },
            false
        );
    });

    it('response() : should contain body property', () => {
        expect(response).to.have.a.property('body');
    });

    it('response() : should contain statusCode property', () => {
        expect(response).to.have.a.property('statusCode');
    });

    it('response() : should contain headers property', () => {
        expect(response).to.have.a.property('headers');
    });

    it('response() : should contain isBase64Encoded property', () => {
        expect(response).to.have.a.property('isBase64Encoded');
    });

    it('response() : should have body equal to { "foo" : "bar" }', () => {
        expect(response).to.deep.include(
            { body: { foo: 'bar', }, }
        );
    });

    it('response() : should have statusCode equal to 200', () => {
        expect(response.statusCode).to.equal(200);
    });

    it('response() : should have headers equal to { "x-foo-val": "bar" }', () => {
        expect(response).to.deep.include(
            { headers: { 'x-foo-val': 'bar', }, }
        );
    });

    it('response() : should contain isBase64Encoded property', () => {
        expect(response.isBase64Encoded).to.equal(false);
    });
});
