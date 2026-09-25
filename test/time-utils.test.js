const assert = require('node:assert/strict');
const test = require('node:test');

const { formatLocalTime, getSessionLoginTime } = require('../lib/utils/TimeUtils.js');

// TimeUtils formats MiCloud session timestamps for the UI. A regression here shows wrong or
// crashing "logged in at" info.

test('formatLocalTime returns unknown for an invalid timestamp', () => {
  assert.equal(formatLocalTime(NaN), 'unknown');
  assert.equal(formatLocalTime('not-a-date'), 'unknown');
});

test('formatLocalTime produces a GMT-offset formatted string for a valid timestamp', () => {
  const out = formatLocalTime(0);
  // shape: YYYY-MM-DD HH:MM:SS GMT+HH:MM  (exact local values depend on the runner's timezone)
  assert.match(out, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} GMT[+-]\d{2}:\d{2}$/);
});

test('getSessionLoginTime uses numeric timestamp when present', () => {
  const out = getSessionLoginTime({ timestamp: 0 });
  assert.match(out, /GMT[+-]\d{2}:\d{2}$/);
});

test('getSessionLoginTime falls back to loggedInAt then unknown', () => {
  assert.equal(getSessionLoginTime({ loggedInAt: '2026-01-01' }), '2026-01-01');
  assert.equal(getSessionLoginTime({}), 'unknown');
  assert.equal(getSessionLoginTime(null), 'unknown');
});
