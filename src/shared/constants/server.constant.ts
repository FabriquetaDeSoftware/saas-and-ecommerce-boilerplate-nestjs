export const serverConstants = {
  port_api: process.env.PORT_API,
  port_redis: process.env.MAPPED_PORT_REDIS,
  host: [
    '0.0.0.0',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:3003',
  ],
  encrypt_password: process.env.ENCRYPT_PASSWORD,
  encrypt_salt: process.env.ENCRYPT_SALT,
};
