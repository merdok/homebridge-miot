const assert = require('node:assert/strict');
const test = require('node:test');

const MiotDevice = require('../lib/protocol/MiotDevice.js');

const noopLogger = { info() {}, warn() {}, error() {}, debug() {}, deepDebug() {}, table() {} };

// Issue #773: slower devices return -30012 "busy." when the plugin sends all property chunks at
// once. requestAllProperties must request chunks sequentially (one in flight at a time) so such
// devices are not overwhelmed.
function makeDevice(chunkSize) {
  const md = new MiotDevice('127.0.0.1', 'token', 'did', 'test.x.y', 'Device', noopLogger);
  md.localConnected = true;
  md.isConnectedToCloud = () => false;
  for (const [name, siid, piid] of [['a:a', 2, 1], ['a:b', 2, 2], ['a:c', 2, 3], ['a:d', 2, 4]]) {
    md.addPropertyByString(name, JSON.stringify({ siid, piid, type: 'urn:x:property:x:1:x:1', description: name, format: 'bool', access: ['read'] }));
  }
  md.setAllPropRequestChunkSize(chunkSize);
  return md;
}

test('property chunks are requested sequentially, not all at once', async () => {
  const md = makeDevice(1); // 4 props, chunk size 1 => 4 chunks
  let inFlight = 0;
  let maxConcurrent = 0;
  const order = [];
  md.getMiotProperties = async (params) => {
    inFlight += 1;
    maxConcurrent = Math.max(maxConcurrent, inFlight);
    order.push(params[0].piid);
    await new Promise(resolve => setTimeout(resolve, 5));
    inFlight -= 1;
    return params.map(p => ({ did: 'did', siid: p.siid, piid: p.piid, code: 0, value: 1 }));
  };

  await md.requestAllProperties();

  assert.equal(maxConcurrent, 1, 'only one property request should be in flight at a time');
  assert.deepEqual(order, [1, 2, 3, 4], 'chunks are requested in order');
});
