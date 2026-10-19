const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');

const validateEnvironment = () => {
  const missing = ['MONGO_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  if (/^(replace-with|change-me|your-)/i.test(process.env.JWT_SECRET)) {
    throw new Error('JWT_SECRET must not use the example placeholder');
  }
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.CORS_ORIGINS) {
      throw new Error('CORS_ORIGINS must be configured in production');
    }
    const origins = process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean);
    if (origins.length === 0 || origins.includes('*')) {
      throw new Error('CORS_ORIGINS must list one or more exact frontend origins');
    }
    for (const origin of origins) {
      let parsedOrigin;
      try {
        parsedOrigin = new URL(origin);
      } catch {
        throw new Error('CORS_ORIGINS must contain valid origin URLs');
      }
      if (!['http:', 'https:'].includes(parsedOrigin.protocol) || parsedOrigin.origin !== origin) {
        throw new Error('CORS_ORIGINS must contain exact HTTP or HTTPS origins without paths');
      }
      if (origin.includes('your-frontend.example.com')) {
        throw new Error('CORS_ORIGINS must not use the example placeholder');
      }
    }
  }
};

const startServer = async () => {
  validateEnvironment();
  const port = Number(process.env.PORT || 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid TCP port');
  }

  await connectDB();
  return app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Server startup failed:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { startServer, validateEnvironment };
