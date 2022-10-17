const fs = require('fs');
const env = process.env.NODE_ENV || 'dev';
const dir = (fs.existsSync('./.env')) ? '.env' : '.env_ci';
const envVars = require(`../${dir}/env.${env}`);

const config = {
    ENV: process.env.NODE_ENV || envVars.NODE_ENV || 'dev',
    PROTOCOL: process.env.PROTOCOL || envVars.PROTOCOL || 'http',
    MONGO: process.env.MONGO || envVars.MONGO || 'mongodb://localhost:27017/your-db',
    SWAGGER: process.env.SWAGGER || envVars.SWAGGER || 'localhost:3000',
    REPLICA: process.env.REPLICA || envVars.REPLICA || 'rs0',
    CORE_EOS_ISSUER: process.env.CORE_EOS_ISSUER || envVars.CORE_EOS_ISSUER,
    CORE_EOS_PLATFORM_ID: process.env.CORE_EOS_PLATFORM_ID || envVars.CORE_EOS_PLATFORM_ID,
    CORE_THIS_SERVICE_CC_AUTHORITY: process.env.CORE_THIS_SERVICE_CC_AUTHORITY || envVars.CORE_THIS_SERVICE_CC_AUTHORITY,
    CORE_THIS_SERVICE_CLIENT_ID: process.env.CORE_THIS_SERVICE_CLIENT_ID || envVars.CORE_THIS_SERVICE_CLIENT_ID,
    CORE_THIS_SERVICE_CLIENT_SECRET: process.env.CORE_THIS_SERVICE_CLIENT_SECRET || envVars.CORE_THIS_SERVICE_CLIENT_SECRET,
    CORE_ASSOCIATED_PRODUCT_ID: process.env.CORE_ASSOCIATED_PRODUCT_ID || envVars.CORE_ASSOCIATED_PRODUCT_ID,
    // deprecating the below
    PERSIST_HTTP_ERRORS: false,
    WRITE_LOGS_TO_DB: false
};

module.exports = config;