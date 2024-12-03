const serverlessExpress = require('@vendia/serverless-express');
const app = require('./app');

// Export the handler for AWS Lambda
exports.handler = async (event, context) => {
    console.log("Event:", JSON.stringify(event, null, 2));
    return serverlessExpress({ app })(event, context);
};
