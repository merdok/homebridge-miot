const assert = require('node:assert/strict');
const fs = require('node:fs').promises;
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  MiotNameResolver,
  resolveConfiguredCountry,
  resolveConfiguredNameLanguage,
  resolveLanguageFromCountry,
  resolveUrn,
} = require('../lib/utils/MiotNameResolver.js');
const AbstractPropertyWrapper = require('../lib/wrappers/AbstractPropertyWrapper.js');
const PropValueListWrapper = require('../lib/wrappers/PropValueListWrapper.js');
const MiotAction = require('../lib/protocol/MiotAction.js');
const MiotProperty = require('../lib/protocol/MiotProperty.js');

for (const serviceModule of ['OutletService.js', 'LightService.js']) {
  const filename = require.resolve(`../lib/services/${serviceModule}`);
  require.cache[filename] = {id: filename, filename, loaded: true, exports: class {}};
}
const AbstractAccessory = require('../lib/base/AbstractAccessory.js');

const URN = 'urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-ma2:1';
const INDICATOR_SERVICE = 'urn:miot-spec-v2:service:indicator-light:00007803:zhimi-ma2:1';
const BATH_HEATER_SERVICE = 'urn:miot-spec-v2:service:ptc-bath-heater:0000783B:yeelink-v2:1';

async function makeTempDir(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'homebridge-miot-localization-'));
  t.after(() => fs.rm(dir, {recursive: true, force: true}));
  return dir;
}

function translatedResponse() {
  return {
    ok: true,
    json: async () => ({
      data: {
        zh_cn: {
          'service:002': '空气净化器',
          'service:002:property:003': '官方模式',
          'service:002:property:003:valuelist:000': '官方自动',
          'service:002:action:004': '开始清扫',
        },
      },
    }),
  };
}

test('maps an explicitly configured MiCloud country to a display language', () => {
  assert.equal(resolveLanguageFromCountry('cn'), 'zh-Hans');
  assert.equal(resolveLanguageFromCountry('TW'), 'zh-Hant');
  assert.equal(resolveLanguageFromCountry('de'), 'de');
  assert.equal(resolveLanguageFromCountry('ru'), 'ru');
  assert.equal(resolveLanguageFromCountry('us'), 'en');
  assert.equal(resolveLanguageFromCountry(undefined), null);
});

test('uses an explicit per-device country before the explicit global country', () => {
  assert.equal(resolveConfiguredCountry({country: 'tw'}, {country: 'cn'}), 'tw');
  assert.equal(resolveConfiguredCountry(undefined, {country: 'cn'}), 'cn');
  assert.equal(resolveConfiguredCountry({}, {}), null);
});

test('only enables generated-name localization through nameLanguage', () => {
  assert.equal(resolveConfiguredNameLanguage({
    deviceMiCloudConfig: {country: 'cn'},
    globalMiCloudConfig: {country: 'de'},
  }), null);
  assert.equal(resolveConfiguredNameLanguage({
    globalNameLanguage: 'auto',
    deviceMiCloudConfig: {country: 'tw'},
    globalMiCloudConfig: {country: 'cn'},
  }), 'zh-Hant');
  assert.equal(resolveConfiguredNameLanguage({
    deviceNameLanguage: 'ru',
    globalNameLanguage: 'auto',
    deviceMiCloudConfig: {country: 'cn'},
  }), 'ru');
  assert.equal(resolveConfiguredNameLanguage({
    deviceNameLanguage: 'auto',
    globalNameLanguage: 'de',
    deviceMiCloudConfig: {country: 'cn'},
  }), 'zh-Hans');
  assert.equal(resolveConfiguredNameLanguage({
    globalNameLanguage: 'en',
    globalMiCloudConfig: {country: 'cn'},
  }), 'en');
});

test('gets the localization URN from a loaded spec or a device spec URL', () => {
  assert.equal(resolveUrn({type: URN}, null), URN);
  assert.equal(resolveUrn(null, `https://miot-spec.org/miot-spec-v2/instance?type=${URN}`), URN);
  assert.equal(resolveUrn(null, null), null);
});

test('keeps the original behavior when nameLanguage is not configured', async (t) => {
  const cacheDir = await makeTempDir(t);
  let fetchCalls = 0;

  const resolver = await MiotNameResolver.create({
    cacheDir,
    urn: URN,
    loadStandardValues: false,
    fetchImpl: async () => {
      fetchCalls += 1;
      return translatedResponse();
    },
  });

  assert.equal(fetchCalls, 0);
  assert.equal(resolver.resolve('Mode', {kind: 'property', siid: 2, piid: 3}), 'Mode');
  assert.deepEqual(await fs.readdir(cacheDir), []);
});

test('keeps upstream names and avoids translation fetches for explicit English', async (t) => {
  const cacheDir = await makeTempDir(t);
  let fetchCalls = 0;
  const resolver = await MiotNameResolver.create({
    language: 'en',
    cacheDir,
    urn: URN,
    loadStandardValues: false,
    fetchImpl: async () => {
      fetchCalls += 1;
      return translatedResponse();
    },
  });

  assert.equal(fetchCalls, 0);
  assert.equal(resolver.resolve('Mode', {kind: 'property', siid: 2, piid: 3}), 'Mode');
  assert.equal(resolver.formatValueListName('Mode', 'Sleep', {propertyType: 'mode'}), 'Mode - Sleep');
  assert.deepEqual(await fs.readdir(cacheDir), []);
});

test('loads official per-URN translations and caches only the selected language', async (t) => {
  const cacheDir = await makeTempDir(t);
  let fetchCalls = 0;
  const fetchImpl = async (url) => {
    fetchCalls += 1;
    assert.match(url, /multiLanguage\?urn=/);
    return translatedResponse();
  };

  const resolver = await MiotNameResolver.create({
    language: 'zh-Hans', cacheDir, urn: URN, fetchImpl, loadStandardValues: false,
  });

  assert.equal(resolver.resolve('Air Purifier', {kind: 'service', siid: 2}), '空气净化器');
  assert.equal(resolver.resolve('Mode', {kind: 'property', siid: 2, piid: 3}), '官方模式');
  assert.equal(resolver.resolve('Auto', {kind: 'value', siid: 2, piid: 3, valueIndex: 0}), '官方自动');
  assert.equal(resolver.resolve('Start', {kind: 'action', siid: 2, aiid: 4}), '开始清扫');
  assert.equal(fetchCalls, 1);

  const files = await fs.readdir(cacheDir);
  assert.equal(files.length, 1);
  const cached = JSON.parse(await fs.readFile(path.join(cacheDir, files[0]), 'utf8'));
  assert.equal(cached.language, 'zh-Hans');
  assert.deepEqual(cached.translations, {
    'service:002': '空气净化器',
    'service:002:property:003': '官方模式',
    'service:002:property:003:valuelist:000': '官方自动',
    'service:002:action:004': '开始清扫',
  });

  const cachedResolver = await MiotNameResolver.create({
    language: 'zh-Hans',
    cacheDir,
    urn: URN,
    loadStandardValues: false,
    fetchImpl: async () => {
      throw new Error('fresh cache must avoid network access');
    },
  });
  assert.equal(cachedResolver.resolve('Mode', {kind: 'property', siid: 2, piid: 3}), '官方模式');
});

test('limits localization network loading to four concurrent requests', async (t) => {
  const cacheDir = await makeTempDir(t);
  let activeRequests = 0;
  let maximumActiveRequests = 0;

  const fetchImpl = async () => {
    activeRequests += 1;
    maximumActiveRequests = Math.max(maximumActiveRequests, activeRequests);
    await new Promise(resolve => setTimeout(resolve, 15));
    activeRequests -= 1;
    return translatedResponse();
  };

  await Promise.all(Array.from({length: 8}, (_, index) => MiotNameResolver.create({
    language: 'zh-Hans',
    cacheDir,
    urn: `${URN}:concurrency-${index}`,
    loadStandardValues: false,
    fetchImpl,
  })));

  assert.equal(maximumActiveRequests, 4);
});

test('uses stale cached translations when refresh fails', async (t) => {
  const cacheDir = await makeTempDir(t);
  const oldNow = Date.UTC(2025, 0, 1);
  await MiotNameResolver.create({
    language: 'zh-Hans',
    cacheDir,
    urn: URN,
    now: () => oldNow,
    loadStandardValues: false,
    fetchImpl: async () => translatedResponse(),
  });

  const resolver = await MiotNameResolver.create({
    language: 'zh-Hans',
    cacheDir,
    urn: URN,
    now: () => oldNow + 31 * 24 * 60 * 60 * 1000,
    loadStandardValues: false,
    fetchImpl: async () => {
      throw new Error('offline');
    },
  });

  assert.equal(resolver.resolve('Mode', {kind: 'property', siid: 2, piid: 3}), '官方模式');
});

test('uses freshly fetched translations even when the cache cannot be written', async (t) => {
  const dir = await makeTempDir(t);
  const invalidCacheDir = path.join(dir, 'not-a-directory');
  await fs.writeFile(invalidCacheDir, 'occupied', 'utf8');

  const resolver = await MiotNameResolver.create({
    language: 'zh-Hans',
    cacheDir: invalidCacheDir,
    urn: URN,
    loadStandardValues: false,
    fetchImpl: async () => translatedResponse(),
  });

  assert.equal(resolver.resolve('Mode', {kind: 'property', siid: 2, piid: 3}), '官方模式');
});

test('preserves explicit user names and falls back to a compact local dictionary', () => {
  const resolver = new MiotNameResolver({language: 'zh-Hans'});

  assert.equal(resolver.resolve('My Mode', {explicit: true, kind: 'property', siid: 2, piid: 3}), 'My Mode');
  assert.equal(resolver.resolve('Buzzer'), '蜂鸣器');
  assert.equal(resolver.resolve('Example Device Light'), 'Example Device 灯');
  assert.equal(resolver.resolve('Unknown Name'), 'Unknown Name');
});

test('preserves the configured accessory name in generic service helpers', () => {
  const resolver = new MiotNameResolver({language: 'zh-Hans'});
  const accessory = Object.create(AbstractAccessory.prototype);
  accessory.name = 'Kitchen Light';
  accessory.device = {resolveHomeKitName: resolver.resolve.bind(resolver)};

  assert.equal(accessory.localizeName('Kitchen Light'), 'Kitchen Light');
  assert.equal(accessory.localizeName('Kitchen Light Play'), 'Kitchen Light 播放');
});

test('marks an exact configured accessory name as explicit for property wrappers', () => {
  class TestWrapper {
    constructor() {
      this.nameIsExplicit = false;
    }
    setNameIsExplicit(value) {
      this.nameIsExplicit = value;
    }
  }

  const accessory = Object.create(AbstractAccessory.prototype);
  accessory.name = 'Kitchen Light';
  accessory.device = {};
  accessory.api = {};
  accessory.logger = {debug() {}};
  accessory.getAccessory = () => ({});

  assert.equal(accessory.createWrapper(TestWrapper, 'Kitchen Light', {}).nameIsExplicit, true);
  assert.equal(accessory.createWrapper(TestWrapper, 'Mode', {}).nameIsExplicit, false);
});

test('routes directly constructed generated services through localization helpers', async () => {
  const speakerSource = await fs.readFile(
    path.join(__dirname, '../lib/modules/speaker/SpeakerAccessory.js'), 'utf8',
  );
  const airFryerSource = await fs.readFile(
    path.join(__dirname, '../lib/modules/airfryer/AirFryerAccessory.js'), 'utf8',
  );

  assert.match(speakerSource, /new Service\.Lightbulb\(this\.sanitizeName\(volumeServiceName\), 'volumeService'\)/);
  assert.match(speakerSource, /setServiceConfiguredName\(this\.volumeService, volumeServiceName\)/);
  assert.match(airFryerSource, /new Service\.Lightbulb\(this\.sanitizeName\('Target Time'\), 'targetTimeService'\)/);
  assert.match(airFryerSource, /setServiceConfiguredName\(this\.targetTimeService, 'Target Time'\)/);
});

test('localizes property wrapper names by stable MIoT ids without changing explicit names', () => {
  class TestWrapper extends AbstractPropertyWrapper {}
  const resolver = new MiotNameResolver({
    language: 'zh-Hans',
    translations: {
      'service:002:property:003': '官方模式',
      'service:002:property:003:valuelist:000': '官方自动',
    },
  });
  const device = {resolveHomeKitName: resolver.resolve.bind(resolver)};
  const prop = {getName: () => 'mode', getServiceId: () => 2, getId: () => 3};
  const logger = {deepDebug() {}, warn() {}};
  const wrapper = new TestWrapper('Mode', prop, device, {}, {hap: {}}, logger);

  assert.equal(wrapper.localizeName('Mode'), '官方模式');
  assert.equal(wrapper.localizeName('Mode - Auto'), '官方模式 - 自动');
  assert.equal(wrapper.localizeValueName('Auto', 0), '官方自动');
  wrapper.setNameIsExplicit(true);
  assert.equal(wrapper.localizeName('My Mode'), 'My Mode');
});

test('exposes the parent MIoT service id on properties for localization lookups', () => {
  const prop = new MiotProperty('mode', 2, 3);
  assert.equal(prop.getServiceId(), 2);
});

test('exposes the parent MIoT service id on actions for localization lookups', () => {
  const action = new MiotAction('start', 2, 4);
  assert.equal(action.getServiceId(), 2);
});

test('localizes value-list property and value names using their MIoT ids', () => {
  class TestWrapper extends AbstractPropertyWrapper {}
  const resolver = new MiotNameResolver({
    language: 'zh-Hans',
    translations: {
      'service:002:property:003': '官方模式',
      'service:002:property:003:valuelist:000': '官方自动',
    },
  });
  const device = {resolveHomeKitName: resolver.resolve.bind(resolver)};
  const prop = {getName: () => 'mode', getServiceId: () => 2, getId: () => 3};
  const wrapper = new TestWrapper('Mode', prop, device, {}, {hap: {}}, {deepDebug() {}, warn() {}});

  assert.equal(wrapper.localizeValueListName('Mode', 'Auto', 0), '官方模式 - 官方自动');
});

test('keeps a wrapper semantic name distinct from its underlying MIoT property', () => {
  const resolver = new MiotNameResolver({
    language: 'zh-Hans',
    translations: {'service:005:property:001': '开关'},
  });
  const context = {
    kind: 'property',
    nameSource: 'wrapper',
    siid: 5,
    piid: 1,
    sourceDescription: 'Switch Status',
    propertyType: 'on',
    serviceType: INDICATOR_SERVICE,
  };

  assert.equal(resolver.resolve('Led', context), '指示灯');
  assert.equal(resolver.resolve('Switch Status', {...context, nameSource: 'miot'}), '开关');
});

test('uses official standard values when a device has no localized value list', () => {
  const resolver = new MiotNameResolver({
    language: 'zh-Hans',
    standardValues: {
      'urn:miot-spec-v2:service:ptc-bath-heater:0000783B|mode|Heat': '制热',
      'urn:miot-spec-v2:service:ptc-bath-heater:0000783B|mode|Ventilate': '换气',
    },
  });

  assert.equal(resolver.resolve('Heat', {
    kind: 'value',
    siid: 2,
    piid: 3,
    valueIndex: 1,
    propertyType: 'mode',
    serviceType: BATH_HEATER_SERVICE,
  }), '制热');
  assert.equal(resolver.resolve('Ventilate', {
    kind: 'value',
    siid: 2,
    piid: 3,
    valueIndex: 2,
    propertyType: 'mode',
    serviceType: BATH_HEATER_SERVICE,
  }), '换气');
});

test('loads and shares one compact official standard value cache', async (t) => {
  const cacheDir = await makeTempDir(t);
  const requestedUrls = [];
  const fetchImpl = async (url) => {
    requestedUrls.push(url);
    if (url.includes('/normalization/list/property_value')) {
      return {
        ok: true,
        json: async () => ({
          result: [
            {
              urn: 'urn:miot-spec-v2:service:ptc-bath-heater:0000783B',
              proName: 'mode',
              normalization: 'Heat',
              description: '制热',
            },
            {invalid: true},
          ],
        }),
      };
    }
    return translatedResponse();
  };

  const resolver = await MiotNameResolver.create({language: 'zh-Hans', cacheDir, urn: URN, fetchImpl});
  assert.equal(resolver.resolve('Heat', {
    kind: 'value', siid: 2, piid: 3, valueIndex: 1,
    propertyType: 'mode', serviceType: BATH_HEATER_SERVICE,
  }), '制热');
  assert.equal(requestedUrls.filter(url => url.includes('/normalization/list/property_value')).length, 1);

  const files = await fs.readdir(cacheDir);
  assert.equal(files.filter(file => file.startsWith('miot-standard-values-')).length, 1);

  await MiotNameResolver.create({
    language: 'zh-Hans', cacheDir, urn: 'urn:miot-spec-v2:device:heater:0000A01A:example-v1:1',
    fetchImpl,
  });
  assert.equal(requestedUrls.filter(url => url.includes('/normalization/list/property_value')).length, 1);
});

test('cleans a shared localization cache directory only once per process', async (t) => {
  const cacheDir = await makeTempDir(t);
  const originalReaddir = fs.readdir;
  let cleanupReads = 0;
  fs.readdir = async (...args) => {
    if (args[0] === cacheDir) cleanupReads += 1;
    return originalReaddir(...args);
  };
  t.after(() => { fs.readdir = originalReaddir; });

  await Promise.all([
    MiotNameResolver.create({
      language: 'zh-Hans', cacheDir, urn: `${URN}:cleanup-a`,
      loadStandardValues: false, fetchImpl: async () => translatedResponse(),
    }),
    MiotNameResolver.create({
      language: 'zh-Hans', cacheDir, urn: `${URN}:cleanup-b`,
      loadStandardValues: false, fetchImpl: async () => translatedResponse(),
    }),
  ]);

  assert.equal(cleanupReads, 1);
});

test('prefers per-device value translations over standard MIoT values', () => {
  const resolver = new MiotNameResolver({
    language: 'zh-Hans',
    translations: {'service:002:property:003:valuelist:001': '设备专用制热'},
    standardValues: {'urn:miot-spec-v2:service:ptc-bath-heater:0000783B|mode|Heat': '制热'},
  });

  assert.equal(resolver.resolve('Heat', {
    kind: 'value',
    siid: 2,
    piid: 3,
    valueIndex: 1,
    propertyType: 'mode',
    serviceType: BATH_HEATER_SERVICE,
  }), '设备专用制热');
});

test('formats Chinese mode value-list services as value plus mode', () => {
  const resolver = new MiotNameResolver({language: 'zh-Hans'});

  assert.equal(resolver.formatValueListName('Mode', '睡眠', {propertyType: 'mode'}), '睡眠模式');
  assert.equal(resolver.formatValueListName('Heater Mode', '制热', {propertyType: 'mode'}), '制热模式');
  assert.equal(resolver.formatValueListName('Mode', '睡眠模式', {propertyType: 'mode'}), '睡眠模式');
  assert.equal(resolver.formatValueListName('暖风模式', 'Unknown', {
    propertyType: 'mode', originalValueName: 'Unknown',
  }), '暖风模式 Unknown');

  const englishResolver = new MiotNameResolver({language: 'en'});
  assert.equal(englishResolver.formatValueListName('Mode', 'Sleep', {propertyType: 'mode'}), 'Mode Sleep');
});

test('passes stable service and property context through the wrapper call chain', () => {
  class TestWrapper extends AbstractPropertyWrapper {}
  const resolver = new MiotNameResolver({
    language: 'zh-Hans',
    translations: {'service:002:property:003': '暖风模式'},
    standardValues: {
      'urn:miot-spec-v2:service:ptc-bath-heater:0000783B|mode|Heat': '制热',
    },
  });
  const service = {getRawType: () => BATH_HEATER_SERVICE};
  const device = {
    getServiceById: () => service,
    resolveHomeKitName: resolver.resolve.bind(resolver),
    formatHomeKitValueListName: resolver.formatValueListName.bind(resolver),
  };
  const prop = {
    getName: () => 'mode',
    getServiceId: () => 2,
    getId: () => 3,
    getDescription: () => 'Mode',
    getType: () => 'mode',
  };
  const wrapper = new TestWrapper('Heater Mode', prop, device, {}, {hap: {}}, {deepDebug() {}, warn() {}});

  assert.equal(wrapper.localizeValueListName('Heater Mode', 'Heat', 1), '制热模式');
});

test('avoids mixed-language value-list names and unsafe separator whitespace', () => {
  const chineseResolver = new MiotNameResolver({
    language: 'zh-Hans',
    translations: {'service:002:property:003': '模式'},
  });
  const propertyName = chineseResolver.resolve('Mode', {kind: 'property', siid: 2, piid: 3});
  const valueName = chineseResolver.resolve('Unknown', {
    kind: 'value', siid: 2, piid: 3, valueIndex: 0,
  });
  assert.equal(chineseResolver.formatValueListName(propertyName, valueName, {
    propertyType: 'mode', originalPropertyName: 'Mode', originalValueName: 'Unknown',
  }), 'Mode Unknown');

  const germanResolver = new MiotNameResolver({language: 'de'});
  assert.equal(germanResolver.formatValueListName('Modus', 'Schlaf', {
    propertyType: 'mode', originalPropertyName: 'Mode', originalValueName: 'Sleep',
  }), 'Modus Schlaf');
  assert.equal(germanResolver.formatValueListName('Mode ', ' Sleep  Mode ', {
    propertyType: 'mode', originalPropertyName: 'Mode ', originalValueName: ' Sleep  Mode ',
  }), 'Mode Sleep Mode');

  const upstreamResolver = new MiotNameResolver();
  assert.equal(upstreamResolver.formatValueListName('Mode', 'Sleep', {
    propertyType: 'mode', originalPropertyName: 'Mode', originalValueName: 'Sleep',
  }), 'Mode - Sleep');
  assert.equal(chineseResolver.formatValueListName('My Mode', 'Sleep', {
    explicit: true, propertyType: 'mode', originalPropertyName: 'My Mode', originalValueName: 'Sleep',
  }), 'My Mode - Sleep');
});

test('localizes plugin semantic names for every non-English configured language', () => {
  const expected = {
    'zh-Hans': {
      Led: '指示灯', 'Heater Mode': '暖风模式', 'Move left': '向左',
      'Cooking Complete': '烹饪完成', 'Fragrance Delivery': '释放香氛', Play: '播放',
    },
    'zh-Hant': {
      Led: '指示燈', 'Heater Mode': '暖風模式', 'Move left': '向左',
      'Cooking Complete': '烹飪完成', 'Fragrance Delivery': '釋放香氛', Play: '播放',
    },
    de: {
      Led: 'LED', 'Heater Mode': 'Heizmodus', 'Move left': 'Nach links',
      'Cooking Complete': 'Kochen beendet', 'Fragrance Delivery': 'Duft abgeben', Play: 'Wiedergabe',
    },
    ru: {
      Led: 'Индикатор', 'Heater Mode': 'Режим обогрева', 'Move left': 'Влево',
      'Cooking Complete': 'Приготовление завершено', 'Fragrance Delivery': 'Подача аромата', Play: 'Воспроизвести',
    },
  };
  const wrapperContext = {
    kind: 'property', nameSource: 'wrapper', siid: 5, piid: 1,
    sourceDescription: 'Switch Status', propertyType: 'on',
  };

  for (const [language, translations] of Object.entries(expected)) {
    const resolver = new MiotNameResolver({language});
    for (const [source, translated] of Object.entries(translations)) {
      assert.equal(resolver.resolve(source, wrapperContext), translated, `${language}: ${source}`);
    }
    assert.equal(resolver.resolve('Example Device Play'), `Example Device ${translations.Play}`);
  }
});

test('uses numeric fallbacks and disambiguates duplicate value-list display names', () => {
  class FakeSwitch {
    constructor(name, id) {
      this.displayName = name;
      this.id = id;
    }
    addOptionalCharacteristic() { return this; }
    setCharacteristic() { return this; }
    getCharacteristic() {
      return {
        onGet() { return this; },
        onSet() { return this; },
        updateValue() { return this; },
      };
    }
  }

  const resolver = new MiotNameResolver({language: 'zh-Hans'});
  const services = [];
  const accessory = {
    addService(service) { services.push(service); },
    getService() { return null; },
  };
  const prop = {
    getName: () => 'air-purifier:mode',
    getServiceId: () => 2,
    getId: () => 3,
    getDescription: () => 'Mode',
    getType: () => 'mode',
    hasValueList: () => true,
    getValueList: () => [
      {value: 0, description: ''},
      {value: 1, description: ''},
      {value: 2, description: 'Sleep'},
      {value: 3, description: 'Sleep'},
    ],
    isWriteOnly: () => false,
  };
  const device = {
    getServiceById: () => null,
    resolveHomeKitName: resolver.resolve.bind(resolver),
    formatHomeKitValueListName: resolver.formatValueListName.bind(resolver),
  };
  const api = {
    hap: {
      Service: {Switch: FakeSwitch},
      Characteristic: {ConfiguredName: 'ConfiguredName', On: 'On'},
      HapStatusError: class {},
      HAPStatus: {},
    },
    platformAccessory: class {},
  };
  const wrapper = new PropValueListWrapper('Mode', prop, device, accessory, api, {
    deepDebug() {}, warn() {}, debug() {},
  });

  assert.equal(wrapper.prepareWrapper(), true);
  assert.deepEqual(services.map(service => service.displayName), [
    '模式 0', '模式 1', '睡眠模式', '睡眠模式 4',
  ]);
  assert.deepEqual(services.map(service => service.id), [
    'air-purifier:modeControlService0',
    'air-purifier:modeControlService1',
    'air-purifier:modeControlService2',
    'air-purifier:modeControlService3',
  ]);
});

test('keeps incrementing a duplicate suffix until the display name is unique', () => {
  class TestWrapper extends AbstractPropertyWrapper {}
  const wrapper = new TestWrapper(
    'Mode', {getName: () => 'mode'}, {}, {}, {hap: {}}, {deepDebug() {}, warn() {}},
  );
  const usedNames = new Set();

  assert.equal(wrapper.getUniqueLocalizedName('Mode Sleep 3', usedNames, 1), 'Mode Sleep 3');
  assert.equal(wrapper.getUniqueLocalizedName('Mode Sleep', usedNames, 1), 'Mode Sleep');
  assert.equal(wrapper.getUniqueLocalizedName('Mode Sleep', usedNames, 3), 'Mode Sleep 4');
});
