const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');
const mongoose = require('mongoose');

test('health endpoint reports database readiness under Express 5', async (t) => {
  const server = app.listen(0);
  t.after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  });

  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/health`);
  const body = await response.json();

  assert.equal(response.status, mongoose.connection.readyState === 1 ? 200 : 503);
  assert.equal(body.status, mongoose.connection.readyState === 1 ? 'ok' : 'unavailable');
  assert.ok(['connected', 'disconnected'].includes(body.database));
  assert.equal('routes' in body, false);
});
