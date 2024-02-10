import { config as configDotEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import {
  AUTHORIZATION,
  CONTENT_TYPE,
  DELETE,
  GET,
  OPTIONS,
  POST,
  PUT,
} from '../constants/configuration';

configDotEnv({ path: `.env.${process.env.NODE_ENV}` });

export default function config() {
  return {
    api: {
      port: process.env.API_PORT,
      version: process.env.API_VERSION,
      corsOptions: {
        origin: true,
        method: [GET, POST, PUT, DELETE, OPTIONS],
        allowedHeaders: [CONTENT_TYPE, AUTHORIZATION],
        optionsSuccessStatus: 204,
      },
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expired: process.env.JWT_EXPIRED,
    },
    cookie: {
      secret: process.env.COOKIE_SECRET,
      configuration: {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      },
    },
    db: {
      url: process.env.DB_URL,
      type: process.env.DB_TYPE,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity{.js,.ts}'],
      migrations: ['dist/migrations/*{.js,.ts}'],
      autoLoadEntities: true,
      synchronize: false,
      ssl: { rejectUnauthorized: false },
    },
    session: {
      secret: process.env.SESSION_SECRET,
    },
  };
}

export const connectionSource = new DataSource(
  config().db as DataSourceOptions,
);
