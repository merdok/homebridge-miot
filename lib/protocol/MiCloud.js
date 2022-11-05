const crypto = require('crypto');
const fetch = require('node-fetch');
const randomstring = require('randomstring');
const querystring = require('querystring');
const Errors = require("../utils/Errors.js");
const CustomCryptRC4 = require("../utils/CustomCryptRC4.js");

const DEFAULT_EQUEST_TIMEOUT = 5000;

class MiCloud {
  constructor(logger) {
    this.logger = logger;

    this.username = null;
    this.password = null;
    this.ssecurity = null;
    this.userId = null;
    this.serviceToken = null;

    this.country = 'cn';
    this.requestTimeout = DEFAULT_EQUEST_TIMEOUT;
    this.useUnencryptedRequests = false;

    this.availableCountries = ['ru', 'us', 'tw', 'sg', 'cn', 'de', 'in', 'i2'];
    this.locale = 'en';

    // constants
    this.AGENT_ID = randomstring.generate({
      length: 13,
      charset: 'ABCDEF',
    });
    this.USERAGENT = `Android-7.1.1-1.0.0-ONEPLUS A3010-136-${this.AGENT_ID} APP/xiaomi.smarthome APPV/62830`;
    this.CLIENT_ID = randomstring.generate({
      length: 6,
      charset: 'alphabetic',
      capitalization: 'uppercase',
    });
  }

  isLoggedIn() {
    return !!this.serviceToken;
  }

  setCountry(country = 'cn') {
    if (!this.availableCountries.includes(country)) {
      throw new Error(`The country ${country} is not supported, list of supported countries is ${this.availableCountries.join(', ')}`);
    }
    this.country = country;
  }

  setRequestTimeout(timeout = DEFAULT_EQUEST_TIMEOUT) {
    if (!timeout || timeout < 2000) {
      timeout = 2000; // make sure we stay above 2000ms since those requests might take some time
    }
    this.requestTimeout = timeout;
  }

  setUseUnencryptedRequests(unencrypted = false) {
    this.useUnencryptedRequests = unencrypted;
  }


  getServiceToken() {
    if (this.isLoggedIn()) {
      return {
        ssecurity: this.ssecurity,
        userId: this.userId,
        serviceToken: this.serviceToken
      };
    }
  }

  setServiceToken(tokenJson) {
    if (tokenJson) {
      const {
        ssecurity,
        userId,
        serviceToken
      } = tokenJson;

      if (ssecurity && userId && serviceToken) {
        this.ssecurity = ssecurity;
        this.userId = userId;
        this.serviceToken = serviceToken;
      }
    }
  }

  async login(username, password) {
    this.logger.debug(`(MiCloud) Log in to MiCloud with username ${username}. Request timeout: ${this.requestTimeout} milliseconds.`);
    if (this.isLoggedIn()) {
      throw new Error(`You are already logged in with username ${this.username}. Login not required!`);
    }
    const {
      sign
    } = await this._loginStep1();
    const {
      ssecurity,
      userId,
      location
    } = await this._loginStep2(username, password, sign);
    const {
      serviceToken
    } = await this._loginStep3(sign.indexOf('http') === -1 ? location : sign);
    this.logger.debug(`(MiCloud) Login successful!`);
    this.username = username;
    this.password = password;
    this.ssecurity = ssecurity;
    this.userId = userId;
    this.serviceToken = serviceToken;
  }

  logout() {
    if (!this.isLoggedIn()) {
      throw new Error('You are not logged in! Cannot log out!');
    }
    this.logger.debug(`(MiCloud) Logout from MiCloud for username ${this.username}`);
    this.username = null;
    this.password = null;
    this.ssecurity = null;
    this.userId = null;
    this.serviceToken = null;
    this.setCountry('cn');
  }

  refreshServiceToken() {
    this.logger.debug(`(MiCloud) Refreshing MiCloud service token for username ${this.username}`);
    this.ssecurity = null;
    this.userId = null;
    this.serviceToken = null;
    this.login(this.username, this.password);
  }

  async request(path, data) {
    if (this.useUnencryptedRequests) {
      return await this._requestUnencrypted(path, data);
    } else {
      return await this._requestEncrypted(path, data);
    }
  }

  async getDevices(deviceIds) {
    const req = deviceIds ? {
      dids: deviceIds,
    } : {
      getVirtualModel: false,
      getHuamiDevices: 0,
    };
    //  {"getVirtualModel":true,"getHuamiDevices":1,"get_split_device":false,"support_smart_home":true}
    const data = await this.request('/home/device_list', req);

    return data.result.list;
  }

  async getDevice(deviceId) {
    const req = {
      dids: [String(deviceId)]
    };
    const data = await this.request('/home/device_list', req);

    return data.result.list[0];
  }

  // this passes the commands to the device 1:1
  async miioCall(deviceId, method, params) {
    const req = {
      method,
      params
    };
    const data = await this.request(`/home/rpc/${deviceId}`, req);
    return data.result;
  }

  // the below methods always use miot protocol even for old device which does not support them locally
  async miotGetProps(params) {
    const req = {
      params
    };
    const data = await this.request(`/miotspec/prop/get`, req);
    return data.result;
  }

  async miotSetProps(params) {
    const req = {
      params
    };
    const data = await this.request(`/miotspec/prop/set`, req);
    return data.result;
  }

  async miotAction(params) {
    const req = {
      params
    };
    const data = await this.request(`/miotspec/action`, req);
    return data.result;
  }

  // private stuff
  async _requestUnencrypted(path, data) {
    if (!this.isLoggedIn()) {
      throw new Error('You are not logged in! Cannot make a request!');
    }
    const url = this._getApiUrl(this.country) + path;
    const params = {
      data: JSON.stringify(data),
    };
    const nonce = this._generateNonce();
    const signedNonce = this._signedNonce(this.ssecurity, nonce);
    const signature = this._generateSignature(path, signedNonce, nonce, params);
    const body = {
      _nonce: nonce,
      data: params.data,
      signature,
    };
    this.logger.deepDebug(`(MiCloud) Unencrypted request ${url} - ${JSON.stringify(body)}`);
    const res = await fetch(url, {
      method: 'POST',
      timeout: this.requestTimeout,
      headers: {
        'User-Agent': this.USERAGENT,
        'x-xiaomi-protocal-flag-cli': 'PROTOCAL-HTTP2',
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: [
          'sdkVersion=accountsdk-18.8.15',
          `deviceId=${this.CLIENT_ID}`,
          `userId=${this.userId}`,
          `yetAnotherServiceToken=${this.serviceToken}`,
          `serviceToken=${this.serviceToken}`,
          `locale=${this.locale}`,
          'channel=MI_APP_STORE'
        ].join('; '),
      },
      body: querystring.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Request error with status ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    if (json && !json.result && json.message && json.message.length > 0) {
      this.logger.debug(`(MiCloud) No result in response from MiCloud! Message: ${json.message}`);
    }

    return json;
  }

  async _requestEncrypted(path, data) {
    if (!this.isLoggedIn()) {
      throw new Error('You are not logged in! Cannot make a request!');
    }
    const url = this._getApiUrl(this.country) + path;
    const params = {
      data: JSON.stringify(data),
    };
    const nonce = this._generateNonce();
    const signedNonce = this._signedNonce(this.ssecurity, nonce);
    const body = this._generateRc4Body(url, signedNonce, nonce, params, this.ssecurity);
    this.logger.deepDebug(`(MiCloud) Encrypted request ${url} - ${JSON.stringify(data)}`);
    const res = await fetch(url, {
      method: 'POST',
      timeout: this.requestTimeout,
      headers: {
        'User-Agent': this.USERAGENT,
        'x-xiaomi-protocal-flag-cli': 'PROTOCAL-HTTP2',
        'Accept-Encoding': 'identity',
        'Content-Type': 'application/x-www-form-urlencoded',
        'MIOT-ENCRYPT-ALGORITHM': 'ENCRYPT-RC4',
        Cookie: [
          'sdkVersion=accountsdk-18.8.15',
          `deviceId=${this.CLIENT_ID}`,
          `userId=${this.userId}`,
          `yetAnotherServiceToken=${this.serviceToken}`,
          `serviceToken=${this.serviceToken}`,
          `locale=${this.locale}`,
          'channel=MI_APP_STORE'
        ].join('; '),
      },
      body: querystring.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`Request error with status ${res.status} ${res.statusText}`);
    }

    const responseText = await res.text();
    const decryptedText = this._decryptRc4(signedNonce, responseText);
    const json = JSON.parse(decryptedText);

    if (json && !json.result && json.message && json.message.length > 0) {
      this.logger.debug(`(MiCloud) No result in response from MiCloud! Message: ${json.message}`);
    }

    return json;
  }

  _getApiUrl(country) {
    country = country.trim().toLowerCase();
    return `https://${country === 'cn' ? '' : `${country}.`}api.io.mi.com/app`;
  }

  _parseJson(str) {
    if (str.indexOf('&&&START&&&') === 0) {
      str = str.replace('&&&START&&&', '');
    }
    return JSON.parse(str);
  }

  _generateSignature(path, _signedNonce, nonce, params) {
    const exps = [];
    exps.push(path);
    exps.push(_signedNonce);
    exps.push(nonce);

    const paramKeys = Object.keys(params);
    paramKeys.sort();
    for (let i = 0, {
        length
      } = paramKeys; i < length; i++) {
      const key = paramKeys[i];
      exps.push(`${key}=${params[key]}`);
    }

    return crypto
      .createHmac('sha256', Buffer.from(_signedNonce, 'base64'))
      .update(exps.join('&'))
      .digest('base64');
  }

  _generateNonce() {
    const buf = Buffer.allocUnsafe(12);
    buf.write(crypto.randomBytes(8).toString('hex'), 0, 'hex');
    buf.writeInt32BE(parseInt(Date.now() / 60000, 10), 8);
    return buf.toString('base64');
  }

  _signedNonce(ssecret, nonce) {
    const s = Buffer.from(ssecret, 'base64');
    const n = Buffer.from(nonce, 'base64');
    return crypto.createHash('sha256').update(s).update(n).digest('base64');
  }

  _generateRc4Body(url, signedNonce, nonce, params, ssecurity) {
    params['rc4_hash__'] = this._generateEncSignature(url, 'POST', signedNonce, params);
    for (const [key, value] of Object.entries(params)) {
      params[key] = this._encryptRc4(signedNonce, value);
    }
    params['signature'] = this._generateEncSignature(url, 'POST', signedNonce, params);
    params['ssecurity'] = ssecurity;
    params['_nonce'] = nonce;
    return params;
  }

  _generateEncSignature(url, method, signedNonce, params) {
    const signatureArr = [];
    signatureArr.push(method.toUpperCase());
    signatureArr.push(url.split('com')[1].replace('/app/', '/'));
    const paramKeys = Object.keys(params);
    paramKeys.sort();
    for (let i = 0, {
        length
      } = paramKeys; i < length; i++) {
      const key = paramKeys[i];
      signatureArr.push(`${key}=${params[key]}`);
    }
    signatureArr.push(signedNonce);
    const signatureStr = signatureArr.join('&');
    return crypto.createHash('sha1').update(signatureStr).digest('base64');
  }

  _encryptRc4(password, payload) {
    let k = Buffer.from(password, 'base64');
    //----------## crypto rc4 ##----------
    //Since nodejs v18.x.x, rc4 seems deaprecated in crypto? due to a new openssl?
    //let cipher = crypto.createCipheriv('rc4', k, '');
    //cipher.update(new Buffer(1024));
    //return cipher.update(payload).toString('base64');
    //----------## crypto end ##----------
    // for now lets use a custom rc4 implementation
    let cipher = CustomCryptRC4.create(k, 1024);
    return cipher.encode(payload);
  }

  _decryptRc4(password, payload) {
    let k = Buffer.from(password, 'base64');
    let p = Buffer.from(payload, 'base64');
    //----------## crypto rc4 ##----------
    //Since nodejs v18.x.x, rc4 seems deaprecated in crypto? due to a new openssl?
    //let decipher = crypto.createDecipheriv('rc4', k, '');
    //decipher.update(new Buffer(1024));
    //return decipher.update(p).toString();
    //----------## crypto end ##----------
    // for now lets use a custom rc4 implementation
    let decipher = CustomCryptRC4.create(k, 1024);
    return decipher.decode(p);
  }

  async _loginStep1() {
    const url = 'https://account.xiaomi.com/pass/serviceLogin?sid=xiaomiio&_json=true';
    const res = await fetch(url);

    const content = await res.text();
    const {
      statusText
    } = res;
    this.logger.debug(`(MiCloud) Login step 1`);
    this.logger.deepDebug(`(MiCloud) Login step 1 result: ${statusText} - ${content}`);

    if (!res.ok) {
      throw new Error(`Response step 1 error with status ${statusText}`);
    }

    const data = this._parseJson(content);

    if (!data._sign) {
      throw new Error('Login step 1 failed');
    }

    return {
      sign: data._sign,
    };
  }

  async _loginStep2(username, password, sign) {
    const formData = querystring.stringify({
      hash: crypto
        .createHash('md5')
        .update(password)
        .digest('hex')
        .toUpperCase(),
      _json: 'true',
      sid: 'xiaomiio',
      callback: 'https://sts.api.io.mi.com/sts',
      qs: '%3Fsid%3Dxiaomiio%26_json%3Dtrue',
      _sign: sign,
      user: username,
    });

    const url = 'https://account.xiaomi.com/pass/serviceLoginAuth2';
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'User-Agent': this.USERAGENT,
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: [
          'sdkVersion=accountsdk-18.8.15',
          `deviceId=${this.CLIENT_ID};`
        ].join('; '),
      },
    });

    const content = await res.text();
    const {
      statusText
    } = res;
    this.logger.debug(`(MiCloud) Login step 2`);
    this.logger.deepDebug(`(MiCloud) Login step 2 result: ${statusText} - ${content}`);

    if (!res.ok) {
      throw new Error(`Response step 2 error with status ${statusText}`);
    }

    const {
      ssecurity,
      userId,
      location,
      notificationUrl,
    } = this._parseJson(content);

    if (!ssecurity && notificationUrl) {
      throw new Errors.TwoFactorRequired(notificationUrl);
    }

    if (!ssecurity || !userId || !location) {
      throw new Error('Login step 2 failed');
    }

    this.ssecurity = ssecurity; // Buffer.from(data.ssecurity, 'base64').toString('hex');
    this.userId = userId;
    return {
      ssecurity,
      userId,
      location,
    };
  }

  async _loginStep3(location) {
    const url = location;
    const res = await fetch(url);

    const content = await res.text();
    const {
      statusText
    } = res;
    this.logger.debug(`(MiCloud) Login step 3`);
    this.logger.deepDebug(`(MiCloud) Login step 3 result: ${statusText} - ${content}`);

    if (!res.ok) {
      throw new Error(`Response step 3 error with status ${statusText}`);
    }

    const headers = res.headers.raw();
    const cookies = headers['set-cookie'];
    let serviceToken;
    cookies.forEach(cookieStr => {
      const cookie = cookieStr.split('; ')[0];
      const idx = cookie.indexOf('=');
      const key = cookie.substr(0, idx);
      const value = cookie.substr(idx + 1, cookie.length).trim();
      if (key === 'serviceToken') {
        serviceToken = value;
      }
    });
    if (!serviceToken) {
      throw new Error('Login step 3 failed');
    }
    return {
      serviceToken,
    };
  }

}

module.exports = MiCloud;
