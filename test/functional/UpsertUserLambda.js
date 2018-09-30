require('dotenv').config();
const { expect, } = require('chai');
const AwsSign = require('src/lib/AwsSign');


describe('Lambda - Upsert User :: POST : /user', async () => {
    const body = {
        name: 'Henry Ford V',
        mobile: '12345678',
        email: 'henry@ford.us',
        company: 'Ford US',
    };
    let data = null;

    before(async () => {
        // eslint-disable-next-line no-unused-expressions
        data = await AwsSign.request('API_UPSERT_USER', 'POST', body);
    });

    it('statusCode should be 200', async () => {
        expect(data.statusCode).to.equal(200);
    });

    it('isBaseEncoded should be false', async () => {
        expect(data.isBase64Encoded).to.equal(false);
    });


    it('body should contain body property', async () => {
        expect(data).to.have.a.property('body');
    });

    it('body should contain Attributes property', async () => {
        expect(data.body).to.have.a.property('Attributes');
    });

    it('Attributes should contain document properties', async () => {
        expect(data.body.Attributes).to.deep.include(
            {
                mobile: '12345678',
                email: 'henry@ford.us',
                name: 'Henry Ford V',
                company: 'Ford US',
            },
        );
    });
});
