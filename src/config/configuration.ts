import {
  AUTHORIZATION,
  CONTENT_TYPE,
  DELETE,
  GET,
  OPTIONS,
  POST,
  PUT,
} from '../constants/configuration';

export default () => ({
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
  cookie: {
    secret: process.env.COOKIE_SECRET,
    configuration: {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    },
  },
  db: {
    name: process.env.DB_NAME,
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
});
