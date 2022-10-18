module.exports = class MissingMiCloudCredentialsError extends Error {
  constructor() {
    super(`Missing information required to connect to the MiCloud! Please specify a MiCloud username and password!`);
  }
}
