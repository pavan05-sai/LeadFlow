const test = require('node:test');
const assert = require('node:assert/strict');
const { validateEnvironment } = require('../server');

test('environment validation requires strong secrets and production CORS origins', () => {
  const keys = ['MONGO_URI', 'JWT_SECRET', 'NODE_ENV', 'CORS_ORIGINS'];
  const originalValues = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

  try {
    process.env.MONGO_URI = 'mongodb://localhost:27017/test';
    process.env.JWT_SECRET = 'x'.repeat(32);
    process.env.NODE_ENV = 'test';
    delete process.env.CORS_ORIGINS;
    assert.doesNotThrow(validateEnvironment);

    process.env.JWT_SECRET = 'short';
    assert.throws(validateEnvironment, /at least 32 characters/);

    process.env.JWT_SECRET = 'replace-with-a-long-example-placeholder';
    assert.throws(validateEnvironment, /example placeholder/);

    process.env.JWT_SECRET = 's'.repeat(32);
    process.env.NODE_ENV = 'production';
    process.env.CORS_ORIGINS = '*';
    assert.throws(validateEnvironment, /exact frontend origins/);

    process.env.CORS_ORIGINS = 'https://app.example.com';
    assert.doesNotThrow(validateEnvironment);
  } finally {
    for (const [key, value] of Object.entries(originalValues)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
});
