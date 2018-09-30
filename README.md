# Aws - Lambdas, Api Gateway and DynamoDB
This project is done in node js.
For unit and functional tests mocha and chai libraries are used.

For computing test coverage istanbul library is used.

For making requests to aws api gateways in functional tests, aws4
module is used.

## Project Directory/File Structure
1. **src** - This directory contains the source code.
2. **test** - This directory contains the unit and functional tests.
3. **.env.sample** - This is the sample file for the environment vars.
   It needs to be copied into the file names .env. Then fill in the
   correct values of the environment vars.
4. **.eslintrc.json** -  coding styles are configured in this file
5. **src/lambdas** - Aws Lambdas are defined this directory.
6. **src/lambdas/UpsertUser.js** - Aws lambda for creating the user.
This lambdas is available to the users via Aws Api Gateway.
This lambda connects to DyanmoDB and writes the data to it.
7. **src/lambdas/UpsertUserInterests.js** - Aws lambda for adding
interests to the existing user. This lambdas is also exposed via
Aws Api Gateway and connects to Dynamo db to write the user interests.
8. **src/lib/DynamoDbQuery** - This class is responsible for creating
the DynamoDB Query for upserts. This class is also used by the lambdas
in the aws cloud.
9. **src/lib/LambdaFy.js** - This class is responsible for formatting
the response from the lambdas back to Api Gateway and hence to end user.
This class is also used by lambdas in the aws cloud.
10. **AwsSign** - This class is responsible for creating the signature
for requests to api gateway. This class is not used by lambdas in the
aws cloud. Instead this class is used by functional tests to 
call api gateway.
11. **src/test/unit** - This directory contains the unit tests
12. **src/test/functional** - This directory contains the functional
tests.


## Commands
To install the dependencies
```sh
$ npm install
```
To run the tests
```sh
$ npm test
```
To check code for linting
```sh
$ npm run lint
```
To fix linting
```sh
$ npm run lint:fix
```
To compute coverage
```sh
$ npm run test:coverage
```