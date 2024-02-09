import * as Crypto from 'crypto';
import * as Joi from 'joi';

export const configValidationAppSchema = Joi.object({
  API_PORT: Joi.number().default(3000).required(),
  API_VERSION: Joi.string().default('api/v1').required(),
  NODE_ENV: Joi.string()
    .valid('development', 'uat', 'test', 'production')
    .default('development')
    .required(),
});

export const configValidationDbSchema = Joi.object({
  DB_NAME: Joi.string().required(),
});

// * To handle default the jwt secret
// * If it doesn't define the JWT secret from .env file
let defaultJwtSecret: string = '';
Crypto.randomBytes(100, (_err, buf) => {
  defaultJwtSecret = buf.toString('hex');
});
export const configValidateJwtSchema = Joi.object({
  JWT_SECRET: Joi.string().default(defaultJwtSecret).required(),
  JWT_EXPIRED: Joi.string().default('5m').required(),
});
