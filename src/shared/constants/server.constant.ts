export const serverConstant = {
  port: process.env.PORT,
  host: ['0.0.0.0', 'http://localhost:3000'],
  encrypt_password: process.env.ENCRYPT_PASSWORD,
  encrypt_salt: process.env.ENCRYPT_SALT,
};
