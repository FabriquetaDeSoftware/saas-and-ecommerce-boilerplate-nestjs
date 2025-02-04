export const stripeConstants = {
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  success_url: 'http://localhost:8080/api',
  cancel_url: 'http://localhost:8080/',
};
