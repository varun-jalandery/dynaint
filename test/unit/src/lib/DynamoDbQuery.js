const { expect, } = require('chai');
const DynamoDbQuery = require('src/lib/DynamoDbQuery');


describe('src/lib/DynamoDbQuery', () => {
    it('getUpsertQuery() : should return query with expected properties', () => {
        const upsertQuery = DynamoDbQuery.getUpsertQuery(
            {
                mobile: '88776655',
                name: 'Henry',
                email: 'henry@ford.com',
                company: 'Ford Motors',
            },
            'users', // table name
            'mobile' // partition key
        );
        const expectedProps = [
            'TableName',
            'Key',
            'UpdateExpression',
            'ExpressionAttributeValues',
            'ReturnValues',
            'ExpressionAttributeNames',
        ];
        expectedProps.forEach((prop) => {
            expect(upsertQuery).to.have.a.property(prop);
        });
    });

    it('getUpsertQuery() : should return query with expected values', () => {
        const upsertQuery = DynamoDbQuery.getUpsertQuery(
            {
                mobile: '88776655',
                name: 'Henry',
                email: 'henry@ford.com',
                company: 'Ford Motors',
            },
            'users', // table name
            'mobile' // partition key
        );
        expect(upsertQuery).to.deep.include(
            { TableName: 'users', },
            'TableName should be users'
        );
        expect(upsertQuery).to.deep.include(
            { Key: { mobile: '88776655', }, },
            'Key property should have property named mobile equal to 88776655'
        );

        expect(upsertQuery).to.deep.include(
            { UpdateExpression: 'SET #name=:name,#email=:email,#company=:company', },
            'UpdateExpression should be correct'
        );
        expect(upsertQuery).to.deep.include(
            {
                ExpressionAttributeValues:
                    {
                        ':name': 'Henry',
                        ':email': 'henry@ford.com',
                        ':company': 'Ford Motors',
                    },
            },
            'ExpressionAttributeValues should be correct'
        );
        expect(upsertQuery).to.deep.include(
            {
                ExpressionAttributeNames:
                    {
                        '#name': 'name',
                        '#email': 'email',
                        '#company': 'company',
                    },
            },
            'ExpressionAttributeValues should be correct'
        );

        expect(upsertQuery).to.deep.include(
            {
                ReturnValues: 'ALL_NEW',
            },
            'ReturnValues should be equal to ALL_NEW'
        );
    });
});
