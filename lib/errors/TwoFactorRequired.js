module.exports = class TwoFactorRequired extends Error {
  constructor(notificationUrl) {
    super('Two factor authentication required, please use visit below url and retry login. ' + notificationUrl);

    this.notificationUrl = notificationUrl;
  }
}
