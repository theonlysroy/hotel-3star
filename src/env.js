const env = {
  domain: process.env.DOMAIN,
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  stripeApiKey: process.env.STRIPE_API_KEY,
  stripeClientKey: process.env.STRIPE_CLIENT_KEY,
};

export default env;
