export default () => ({
  api: {
    port: process.env.API_PORT,
    version: process.env.API_VERSION,
  },
  cookie: {
    secret: process.env.COOKIE_SECRET,
  },
  db: {
    name: process.env.DB_NAME,
  },
});
