const assert = require('node:assert/strict');
const test = require('node:test');

const MiCloudUtils = require('../lib/utils/MiCloudUtils.js');
const ErrorUtils = require('../lib/utils/ErrorUtils.js');
const Errors = require('../lib/utils/Errors.js');

// MiCloudUtils.compareErrorCode decodes MiCloud -70xxx response codes; the offline check drives
// reconnect behavior. ErrorUtils.isNonRecoverableError decides whether to stop retrying.

test('compareErrorCode matches -70-prefixed codes by their last three digits', () => {
  // DEVICE_OFFLINE = '011'
  assert.equal(MiCloudUtils.compareErrorCode(-704011, '011'), true);
  assert.equal(MiCloudUtils.compareErrorCode('-704011', '011'), true);
  assert.equal(MiCloudUtils.compareErrorCode(-704011, '013'), false); // different suffix
  assert.equal(MiCloudUtils.compareErrorCode(-999011, '011'), false); // wrong prefix
});

test('isDeviceOfflineResponseCode detects the offline code', () => {
  assert.equal(MiCloudUtils.isDeviceOfflineResponseCode(-704011), true);
  assert.equal(MiCloudUtils.isDeviceOfflineResponseCode(-704013), false);
});

test('isNonRecoverableError is true for the non-recoverable error types', () => {
  assert.equal(ErrorUtils.isNonRecoverableError(new Errors.MissingDeviceId('dev')), true);
  assert.equal(ErrorUtils.isNonRecoverableError(new Errors.DeviceNotFound('id', 'cn')), true);
  assert.equal(ErrorUtils.isNonRecoverableError(new Errors.UnknownDeviceModel()), true);
  assert.equal(ErrorUtils.isNonRecoverableError(new Errors.MissingMiCloudCredentials()), true);
});

test('isNonRecoverableError is false for recoverable / generic errors', () => {
  assert.equal(ErrorUtils.isNonRecoverableError(new Errors.DeviceNotOnline('id')), false);
  assert.equal(ErrorUtils.isNonRecoverableError(new Errors.TwoFactorRequired('http://x')), false);
  assert.equal(ErrorUtils.isNonRecoverableError(new Error('generic')), false);
});
