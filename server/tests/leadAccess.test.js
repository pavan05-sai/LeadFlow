const test = require('node:test');
const assert = require('node:assert/strict');
const { canAccessLead } = require('../utils/leadAccess');

test('agents can access leads assigned to them', () => {
  assert.equal(
    canAccessLead({ assignedTo: { toString: () => 'agent-1' } }, { role: 'agent', _id: 'agent-1' }),
    true,
  );
});

test('agents cannot access unassigned or other agents leads', () => {
  assert.equal(canAccessLead({ assignedTo: null }, { role: 'agent', _id: 'agent-1' }), false);
  assert.equal(canAccessLead({ assignedTo: 'agent-2' }, { role: 'agent', _id: 'agent-1' }), false);
});

test('administrators can access any lead', () => {
  assert.equal(canAccessLead({ assignedTo: 'agent-1' }, { role: 'admin', _id: 'admin-1' }), true);
});
