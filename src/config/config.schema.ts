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
