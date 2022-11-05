const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 7000;

const {
  LOG_LEVEL,
  MONGO_URL,
  JWT_SECRET_KEY,
  APP_URL,
  APP_ENV,
  AWS_REGION,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  DESTINATION_EMAIL,
  AWS_FROM_EMAIL,
} = process.env;

module.exports = {
  PORT,
  LOG_LEVEL,
  MONGO_URL,
  JWT_SECRET_KEY,
  APP_URL,
  APP_ENV,
  AWS_REGION,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  DESTINATION_EMAIL,
  AWS_FROM_EMAIL,
};
