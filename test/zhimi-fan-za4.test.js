const assert = require('node:assert/strict');
const test = require('node:test');

const MiotDevice = require('../lib/protocol/MiotDevice.js');
const ZhimiFanZa4 = require('../lib/modules/fan/devices/zhimi.fan.za4.js');

const noopLogger = { info() {}, warn() {}, error() {}, debug() {}, deepDebug() {}, table() {} };

// Regression (issue #756): the za4 exposes its shutdown timer as countdown:countdown-time, not the
// standard fan:off-delay. Without an offDelayProp() override, supportsOffDelay() was false and the
// off-delay control never appeared in HomeKit even with offDelayControl enabled.
function makeZa4() {
  const md = new MiotDevice('127.0.0.1', 'token', 'devid', 'zhimi.fan.za4', 'Fan', noopLogger);
  const d = new ZhimiFanZa4(md, 'Fan', noopLogger);
  d.initDeviceServices();
  d.initDeviceProperties();
  d.initDeviceActions();
  d.initDeviceEvents();
  return d;
}

test('za4 maps the countdown property to the off delay control', () => {
  const d = makeZa4();
  assert.ok(d.offDelayProp(), 'offDelayProp should resolve');
  assert.equal(d.offDelayProp().getName(), 'countdown:countdown-time');
  assert.equal(d.supportsOffDelay(), true);
});

test('za4 monitors the countdown property so its value syncs', () => {
  const d = makeZa4();
  assert.ok(d.propertiesToMonitor().includes('countdown:countdown-time'));
});
