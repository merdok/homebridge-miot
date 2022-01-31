const MiioProtocol = require('../protocol/MiioProtocol');
const Logger = require("../utils/Logger");


class MiioProtocolHelper {
  constructor() {
    this.miioProtocol = new MiioProtocol(new Logger());
  }


  /*----------========== PUBLIC ==========----------*/

  async connect(ip, token) {
    if (!ip) {
      throw new Error(`Device ip must be specified!`);
    }

    if (!token) {
      throw new Error(`Device token must be specified!`);
    }

    this.miioProtocol.updateDevice(ip, {
      token: token
    })

    await this.miioProtocol.handshake(ip);
  }

  async send(ip, command, params) {
    return this.miioProtocol.send(ip, command, params, {
      retries: 1,
      timeout: 5000
    });
  }

}

module.exports = new MiioProtocolHelper();
