require('dotenv').config();
const { expect, } = require('chai');
const AwsSign = require('src/lib/AwsSign');


describe('Lambda - Upsert User Interest :: POST : /user', async () => {
    const body = {
        mobile: '12345678',
        interests:
            {
                sports: ['soccer', 'baseball', 'cricket', 'ice hockey'],
                movies: ['titanic', 'interstellar', 'gravity'],
            },
    };
    let data = null;

    before(async () => {
        // eslint-disable-next-line no-unused-expressions
        data = await AwsSign.request('API_UPSERT_INTERESTS', 'POST', body);
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

    it('Attributes should contain interests property', async () => {
        expect(data.body.Attributes).to.have.a.property('interests');
    });

    it('interests should contain user interests as saved', async () => {
        expect(data.body.Attributes.interests).to.deep.include(
            {
                sports: ['soccer', 'baseball', 'cricket', 'ice hockey'],
                movies: ['titanic', 'interstellar', 'gravity'],
            },
        );
    });
});
