module.exports = class TwoFactorRequired extends Error {
  constructor(notificationUrl) {
    super('Two factor authentication required, please visit the following url and retry login: ' + notificationUrl);
    this.notificationUrl = notificationUrl;
  }
}
