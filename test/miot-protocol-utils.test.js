const assert = require('node:assert/strict');
const test = require('node:test');

const MiotProtocolUtils = require('../lib/utils/MiotProtocolUtils.js');

// MiotProtocolUtils validates the siid/piid/aiid ids and spec id/name shapes used all over the
// protocol layer. isValidMiotId/validateMiotId guard property and action creation.

test('isValidMiotId accepts non-negative integers only', () => {
  assert.equal(MiotProtocolUtils.isValidMiotId(0), true);
  assert.equal(MiotProtocolUtils.isValidMiotId(5), true);
  assert.equal(MiotProtocolUtils.isValidMiotId(-1), false);
  assert.equal(MiotProtocolUtils.isValidMiotId(1.5), false);
  assert.equal(MiotProtocolUtils.isValidMiotId(undefined), false);
  assert.equal(MiotProtocolUtils.isValidMiotId(null), false);
  assert.equal(MiotProtocolUtils.isValidMiotId('2'), false); // string is not an integer
});

test('validateMiotId parses numeric strings then validates, else null', () => {
  assert.equal(MiotProtocolUtils.validateMiotId('2'), 2);
  assert.equal(MiotProtocolUtils.validateMiotId(3), 3);
  assert.equal(MiotProtocolUtils.validateMiotId(0), 0);
  assert.equal(MiotProtocolUtils.validateMiotId('-1'), null);
  assert.equal(MiotProtocolUtils.validateMiotId('abc'), null);
  assert.equal(MiotProtocolUtils.validateMiotId(undefined), null);
});

test('isSpecId matches exactly two dot-separated segments', () => {
  assert.equal(MiotProtocolUtils.isSpecId('2.1'), true);
  assert.equal(MiotProtocolUtils.isSpecId('2'), false);
  assert.equal(MiotProtocolUtils.isSpecId('2.1.3'), false);
  assert.equal(MiotProtocolUtils.isSpecId('fan:on'), false);
});

test('isSpecName matches exactly two colon-separated segments', () => {
  assert.equal(MiotProtocolUtils.isSpecName('fan:on'), true);
  assert.equal(MiotProtocolUtils.isSpecName('fan'), false);
  assert.equal(MiotProtocolUtils.isSpecName('a:b:c'), false);
  assert.equal(MiotProtocolUtils.isSpecName('2.1'), false);
});
