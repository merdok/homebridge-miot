const crypto = require('node:crypto');
const fs = require('node:fs').promises;
const path = require('node:path');

const CACHE_VERSION = 1;
const CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const CACHE_RETENTION_MS = 180 * 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 4000;
const MAX_CONCURRENT_FETCHES = 4;
const MULTI_LANGUAGE_URL = 'https://miot-spec.org/instance/v2/multiLanguage?urn=';
const STANDARD_VALUES_URL = 'https://miot-spec.org/miot-spec-v2/normalization/list/property_value';

const COUNTRY_LANGUAGES = Object.freeze({
  cn: 'zh-Hans',
  tw: 'zh-Hant',
  de: 'de',
  ru: 'ru',
  us: 'en',
  sg: 'en',
  in: 'en',
  i2: 'en',
});

const RESPONSE_LANGUAGE_KEYS = Object.freeze({
  'zh-Hans': ['zh_cn', 'zh_hans'],
  'zh-Hant': ['zh_hk', 'zh_tw', 'zh_hant'],
  de: ['de'],
  ru: ['ru'],
  en: ['en'],
});
const SUPPORTED_NAME_LANGUAGES = Object.freeze(Object.keys(RESPONSE_LANGUAGE_KEYS));

const LOCAL_NAME_LANGUAGES = Object.freeze(['zh-Hans', 'zh-Hant', 'de', 'ru']);
const LOCAL_NAME_ROWS = Object.freeze([
  ['Air Quality', '空气质量', '空氣品質', 'Luftqualität', 'Качество воздуха'],
  ['Ambient Light', '环境灯', '環境燈', 'Umgebungslicht', 'Подсветка'],
  ['Auto', '自动', '自動', 'Automatisch', 'Авто'],
  ['Auto Fragrance', '自动香氛', '自動香氛', 'Automatischer Duft', 'Автоматическая ароматизация'],
  ['Auto Light', '自动灯光', '自動燈光', 'Automatisches Licht', 'Автоматическая подсветка'],
  ['Battery', '电池', '電池', 'Batterie', 'Батарея'],
  ['Buzzer', '蜂鸣器', '蜂鳴器', 'Signalton', 'Звуковой сигнал'],
  ['Carbon Dioxide', '二氧化碳', '二氧化碳', 'Kohlendioxid', 'Углекислый газ'],
  ['Cooking Complete', '烹饪完成', '烹飪完成', 'Kochen beendet', 'Приготовление завершено'],
  ['Diffusing Duration', '扩香时长', '擴香時長', 'Duftdauer', 'Длительность ароматизации'],
  ['Diffusing Interval', '扩香间隔', '擴香間隔', 'Duftintervall', 'Интервал ароматизации'],
  ['Dock', '充电座', '充電座', 'Ladestation', 'Зарядная станция'],
  ['Fan', '风扇', '風扇', 'Ventilator', 'Вентилятор'],
  ['Fan Level', '风速', '風速', 'Lüfterstufe', 'Скорость вентилятора'],
  ['Favorite', '最爱', '最愛', 'Favorit', 'Избранное'],
  ['Filter Maintenance', '滤芯', '濾芯', 'Filterwartung', 'Состояние фильтра'],
  ['Fragrance Delivery', '释放香氛', '釋放香氛', 'Duft abgeben', 'Подача аромата'],
  ['Heat Level', '加热档位', '加熱檔位', 'Heizstufe', 'Уровень нагрева'],
  ['Heater', '加热', '加熱', 'Heizung', 'Обогрев'],
  ['Heater Mode', '暖风模式', '暖風模式', 'Heizmodus', 'Режим обогрева'],
  ['Horizontal Swing', '左右摆风', '左右擺風', 'Horizontale Schwenkbewegung', 'Горизонтальное качание'],
  ['Humidity', '湿度', '濕度', 'Luftfeuchtigkeit', 'Влажность'],
  ['Illumination', '光照度', '照度', 'Beleuchtungsstärke', 'Освещённость'],
  ['Ioniser', '负离子', '負離子', 'Ionisator', 'Ионизатор'],
  ['Led', '指示灯', '指示燈', 'LED', 'Индикатор'],
  ['Left Time', '剩余时间', '剩餘時間', 'Restzeit', 'Оставшееся время'],
  ['Light', '灯', '燈', 'Licht', 'Свет'],
  ['Light Auto Off', '灯光自动关闭', '燈光自動關閉', 'Licht automatisch aus', 'Автовыключение света'],
  ['Light Mode', '灯光模式', '燈光模式', 'Lichtmodus', 'Режим освещения'],
  ['Light off delay', '灯光延时关闭', '燈光延遲關閉', 'Ausschaltverzögerung Licht', 'Задержка выключения света'],
  ['Mode', '模式', '模式', 'Modus', 'Режим'],
  ['Motor Control', '电机控制', '馬達控制', 'Motorsteuerung', 'Управление двигателем'],
  ['Move down', '向下', '向下', 'Nach unten', 'Вниз'],
  ['Move left', '向左', '向左', 'Nach links', 'Влево'],
  ['Move right', '向右', '向右', 'Nach rechts', 'Вправо'],
  ['Move up', '向上', '向上', 'Nach oben', 'Вверх'],
  ['Next', '下一首', '下一首', 'Weiter', 'Следующий'],
  ['Off delay', '延时关闭', '延遲關閉', 'Ausschaltverzögerung', 'Задержка выключения'],
  ['Pause', '暂停', '暫停', 'Pause', 'Пауза'],
  ['Play', '播放', '播放', 'Wiedergabe', 'Воспроизвести'],
  ['Power', '电源', '電源', 'Stromversorgung', 'Питание'],
  ['Previous', '上一首', '上一首', 'Zurück', 'Предыдущий'],
  ['Screen', '屏幕', '螢幕', 'Bildschirm', 'Экран'],
  ['Sleep', '睡眠', '睡眠', 'Schlaf', 'Сон'],
  ['Soil Ec', '土壤电导率', '土壤導電率', 'Bodenleitfähigkeit', 'Проводимость почвы'],
  ['TDS Sensor', 'TDS 传感器', 'TDS 感測器', 'TDS-Sensor', 'Датчик TDS'],
  ['Temperature', '温度', '溫度', 'Temperatur', 'Температура'],
  ['Target Time', '目标时间', '目標時間', 'Zielzeit', 'Целевое время'],
  ['Vertical Swing', '上下摆风', '上下擺風', 'Vertikale Schwenkbewegung', 'Вертикальное качание'],
  ['Volume', '音量', '音量', 'Lautstärke', 'Громкость'],
]);
const LOCAL_NAMES = Object.freeze(Object.fromEntries(LOCAL_NAME_LANGUAGES.map((language, languageIndex) => [
  language,
  Object.freeze(Object.fromEntries(LOCAL_NAME_ROWS.map(row => [row[0], row[languageIndex + 1]]))),
])));

const DEVICE_NAME_SUFFIXES = Object.freeze([
  'Fragrance Delivery',
  'Previous',
  'Volume',
  'Light',
  'Pause',
  'Play',
  'Next',
]);

const pendingLoads = new Map();
const standardValueLoads = new Map();
const cleanupLoads = new Map();
const fetchQueue = [];
let activeFetches = 0;

function resolveLanguageFromCountry(country) {
  if (typeof country !== 'string' || country.trim() === '') return null;
  return COUNTRY_LANGUAGES[country.trim().toLowerCase()] || null;
}

function resolveConfiguredCountry(deviceMiCloudConfig, globalMiCloudConfig) {
  const deviceCountry = deviceMiCloudConfig && deviceMiCloudConfig.country;
  if (typeof deviceCountry === 'string' && deviceCountry.trim() !== '') return deviceCountry.trim();
  const globalCountry = globalMiCloudConfig && globalMiCloudConfig.country;
  if (typeof globalCountry === 'string' && globalCountry.trim() !== '') return globalCountry.trim();
  return null;
}

function normalizeNameLanguage(language) {
  if (typeof language !== 'string' || language.trim() === '') return null;
  const configuredLanguage = language.trim();
  return SUPPORTED_NAME_LANGUAGES.find(
    supportedLanguage => supportedLanguage.toLowerCase() === configuredLanguage.toLowerCase(),
  ) || null;
}

function resolveConfiguredNameLanguage(options = {}) {
  const deviceNameLanguage = typeof options.deviceNameLanguage === 'string'
    ? options.deviceNameLanguage.trim()
    : '';
  const globalNameLanguage = typeof options.globalNameLanguage === 'string'
    ? options.globalNameLanguage.trim()
    : '';
  const configuredLanguage = deviceNameLanguage || globalNameLanguage;
  if (!configuredLanguage) return null;
  if (configuredLanguage.toLowerCase() === 'auto') {
    return resolveLanguageFromCountry(resolveConfiguredCountry(
      options.deviceMiCloudConfig,
      options.globalMiCloudConfig,
    ));
  }
  return normalizeNameLanguage(configuredLanguage);
}

function acquireFetchSlot() {
  if (activeFetches < MAX_CONCURRENT_FETCHES) {
    activeFetches += 1;
    return Promise.resolve();
  }
  return new Promise(resolve => fetchQueue.push(resolve));
}

function releaseFetchSlot() {
  const next = fetchQueue.shift();
  if (next) {
    next();
  } else {
    activeFetches -= 1;
  }
}

async function withFetchSlot(task) {
  await acquireFetchSlot();
  try {
    return await task();
  } finally {
    releaseFetchSlot();
  }
}

function resolveUrn(miotSpec, specUrl) {
  if (miotSpec && typeof miotSpec.type === 'string' && miotSpec.type.startsWith('urn:')) {
    return miotSpec.type;
  }
  if (typeof specUrl !== 'string' || specUrl.trim() === '') return null;

  try {
    const type = new URL(specUrl).searchParams.get('type');
    return type && type.startsWith('urn:') ? type : null;
  } catch (error) {
    return null;
  }
}

function getTranslationKey(context) {
  if (!context || context.siid === undefined || context.siid === null) return null;
  const siid = Number(context.siid);
  if (!Number.isInteger(siid)) return null;

  const serviceKey = `service:${String(siid).padStart(3, '0')}`;
  if (context.kind === 'service') return serviceKey;

  const itemId = context.piid ?? context.aiid ?? context.eiid;
  if (!Number.isInteger(Number(itemId))) return null;

  const itemKey = String(Number(itemId)).padStart(3, '0');
  if (context.kind === 'property') return `${serviceKey}:property:${itemKey}`;
  if (context.kind === 'action') return `${serviceKey}:action:${itemKey}`;
  if (context.kind === 'event') return `${serviceKey}:event:${itemKey}`;
  if (context.kind === 'value' && Number.isInteger(Number(context.valueIndex))) {
    return `${serviceKey}:property:${itemKey}:valuelist:${String(Number(context.valueIndex)).padStart(3, '0')}`;
  }
  return null;
}

function selectTranslations(payload, language) {
  const data = payload && payload.data;
  if (!data || typeof data !== 'object') return {};

  const languageKeys = RESPONSE_LANGUAGE_KEYS[language] || [language.toLowerCase()];
  for (const languageKey of languageKeys) {
    const translations = data[languageKey];
    if (translations && typeof translations === 'object') {
      return Object.fromEntries(Object.entries(translations).filter(([, value]) => typeof value === 'string' && value.trim() !== ''));
    }
  }
  return {};
}

function normalizeServiceType(serviceType) {
  if (typeof serviceType !== 'string') return null;
  const parts = serviceType.split(':');
  return parts.length >= 5 ? parts.slice(0, 5).join(':') : serviceType;
}

function getStandardValueKey(serviceType, propertyType, valueName) {
  const normalizedServiceType = normalizeServiceType(serviceType);
  if (!normalizedServiceType || !propertyType || typeof valueName !== 'string') return null;
  return `${normalizedServiceType}|${propertyType}|${valueName}`;
}

function selectStandardValues(payload, language) {
  if (language !== 'zh-Hans' || !payload || !Array.isArray(payload.result)) return {};

  const values = {};
  payload.result.forEach((item) => {
    if (!item || typeof item !== 'object') return;
    const key = getStandardValueKey(item.urn, item.proName, item.normalization);
    if (key && typeof item.description === 'string' && item.description.trim() !== '') {
      values[key] = item.description;
    }
  });
  return values;
}

function normalizeSemanticName(name) {
  if (typeof name !== 'string') return '';
  return name.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
}

function wrapperNameMatchesProperty(defaultName, context) {
  const normalizedDefault = normalizeSemanticName(defaultName);
  if (!normalizedDefault) return false;

  const propertyTypeName = typeof context.propertyType === 'string'
    ? context.propertyType.replace(/[-_]+/g, ' ')
    : '';
  return [context.sourceDescription, propertyTypeName]
    .some(candidate => normalizeSemanticName(candidate) === normalizedDefault);
}

class MiotNameResolver {
  constructor({language = null, translations = {}, standardValues = {}} = {}) {
    this.language = language;
    this.translations = translations;
    this.standardValues = standardValues;
  }

  static async create(options = {}) {
    const language = normalizeNameLanguage(options.language);
    if (!language) return new MiotNameResolver();
    if (language === 'en') return new MiotNameResolver();

    if (!options.cacheDir) return new MiotNameResolver({language});

    let translationsPromise = Promise.resolve({});
    if (options.urn) {
      const cacheFile = path.join(options.cacheDir, MiotNameResolver.cacheFileName(options.urn, language));
      const loadKey = `${cacheFile}:${language}`;
      if (!pendingLoads.has(loadKey)) {
        const loadPromise = MiotNameResolver._loadTranslations({...options, cacheFile, language})
          .finally(() => pendingLoads.delete(loadKey));
        pendingLoads.set(loadKey, loadPromise);
      }
      translationsPromise = pendingLoads.get(loadKey);
    }

    let standardValuesPromise = Promise.resolve({});
    if (language === 'zh-Hans' && options.loadStandardValues !== false) {
      const cacheFile = path.join(options.cacheDir, MiotNameResolver.standardCacheFileName(language));
      if (!standardValueLoads.has(cacheFile)) {
        standardValueLoads.set(cacheFile, MiotNameResolver._loadStandardValues({...options, cacheFile, language}));
      }
      standardValuesPromise = standardValueLoads.get(cacheFile);
    }

    const [translations, standardValues] = await Promise.all([translationsPromise, standardValuesPromise]);
    return new MiotNameResolver({language, translations, standardValues});
  }

  static cacheFileName(urn, language) {
    const digest = crypto.createHash('sha256').update(urn).digest('hex').slice(0, 16);
    return `miot-name-v${CACHE_VERSION}-${language.toLowerCase()}-${digest}.json`;
  }

  static standardCacheFileName(language) {
    return `miot-standard-values-v${CACHE_VERSION}-${language.toLowerCase()}.json`;
  }

  static async _loadTranslations(options) {
    const now = options.now ? options.now() : Date.now();
    let cached = null;

    try {
      cached = JSON.parse(await fs.readFile(options.cacheFile, 'utf8'));
      if (cached.version === CACHE_VERSION && cached.language === options.language && now - cached.fetchedAt <= CACHE_MAX_AGE_MS) {
        return cached.translations || {};
      }
    } catch (error) {
      cached = null;
    }

    let translations;
    try {
      const fetchImpl = options.fetchImpl || require('node-fetch');
      translations = await withFetchSlot(async () => {
        const response = await fetchImpl(MULTI_LANGUAGE_URL + encodeURIComponent(options.urn), {timeout: FETCH_TIMEOUT_MS});
        if (!response.ok) throw new Error(`HTTP ${response.status || response.statusText || 'error'}`);
        return selectTranslations(await response.json(), options.language);
      });
    } catch (error) {
      if (options.logger && options.logger.debug) {
        options.logger.debug(`Could not refresh MIoT localized names; using cached or built-in names: ${error.message}`);
      }
      return cached && cached.translations ? cached.translations : {};
    }

    try {
      await fs.mkdir(options.cacheDir, {recursive: true});
      await MiotNameResolver._cleanupCache(options.cacheDir, now);
      await MiotNameResolver._writeCache(options.cacheFile, {
        version: CACHE_VERSION,
        language: options.language,
        urn: options.urn,
        fetchedAt: now,
        translations,
      });
    } catch (error) {
      if (options.logger && options.logger.debug) {
        options.logger.debug(`Could not cache MIoT localized names; continuing without a cache: ${error.message}`);
      }
    }
    return translations;
  }

  static async _loadStandardValues(options) {
    const now = options.now ? options.now() : Date.now();
    let cached = null;

    try {
      cached = JSON.parse(await fs.readFile(options.cacheFile, 'utf8'));
      if (cached.version === CACHE_VERSION && cached.language === options.language && now - cached.fetchedAt <= CACHE_MAX_AGE_MS) {
        return cached.values || {};
      }
    } catch (error) {
      cached = null;
    }

    let values;
    try {
      const fetchImpl = options.fetchImpl || require('node-fetch');
      values = await withFetchSlot(async () => {
        const response = await fetchImpl(STANDARD_VALUES_URL, {timeout: FETCH_TIMEOUT_MS});
        if (!response.ok) throw new Error(`HTTP ${response.status || response.statusText || 'error'}`);
        return selectStandardValues(await response.json(), options.language);
      });
    } catch (error) {
      if (options.logger && options.logger.debug) {
        options.logger.debug(`Could not refresh MIoT standard values; using cached or built-in names: ${error.message}`);
      }
      return cached && cached.values ? cached.values : {};
    }

    try {
      await fs.mkdir(options.cacheDir, {recursive: true});
      await MiotNameResolver._cleanupCache(options.cacheDir, now);
      await MiotNameResolver._writeCache(options.cacheFile, {
        version: CACHE_VERSION,
        language: options.language,
        fetchedAt: now,
        values,
      });
    } catch (error) {
      if (options.logger && options.logger.debug) {
        options.logger.debug(`Could not cache MIoT standard values; continuing without a cache: ${error.message}`);
      }
    }
    return values;
  }

  static async _writeCache(cacheFile, value) {
    const temporaryFile = `${cacheFile}.${process.pid}.tmp`;
    try {
      await fs.writeFile(temporaryFile, JSON.stringify(value), 'utf8');
      await fs.rename(temporaryFile, cacheFile);
    } finally {
      await fs.rm(temporaryFile, {force: true}).catch(() => {});
    }
  }

  static async _cleanupCache(cacheDir, now) {
    if (!cleanupLoads.has(cacheDir)) {
      cleanupLoads.set(cacheDir, MiotNameResolver._cleanupCacheFiles(cacheDir, now));
    }
    return cleanupLoads.get(cacheDir);
  }

  static async _cleanupCacheFiles(cacheDir, now) {
    let entries = [];
    try {
      entries = await fs.readdir(cacheDir, {withFileTypes: true});
    } catch (error) {
      return;
    }

    await Promise.all(entries
      .filter(entry => entry.isFile() && /^miot-(?:name|standard-values)-v\d+-.*\.json$/.test(entry.name))
      .map(async (entry) => {
        try {
          const file = path.join(cacheDir, entry.name);
          const stats = await fs.stat(file);
          if (now - stats.mtimeMs > CACHE_RETENTION_MS) await fs.rm(file, {force: true});
        } catch (error) {
          // Another device startup may have cleaned the same cache entry.
        }
      }));
  }

  resolve(defaultName, context = {}) {
    if (!this.language || context.explicit || typeof defaultName !== 'string') return defaultName;

    const localNames = LOCAL_NAMES[this.language];
    const translationKey = getTranslationKey(context);
    const officialName = translationKey && this.translations[translationKey];

    if (context.kind === 'value') {
      if (officialName) return officialName;
      const standardValueKey = getStandardValueKey(context.serviceType, context.propertyType, defaultName);
      const standardName = standardValueKey && this.standardValues[standardValueKey];
      if (standardName) return standardName;
      return (localNames && localNames[defaultName]) || defaultName;
    }

    if (officialName) {
      const separatorIndex = defaultName.indexOf(' - ');
      if (separatorIndex > 0) {
        const valueName = defaultName.slice(separatorIndex + 3);
        return `${officialName} - ${(localNames && localNames[valueName]) || valueName}`;
      }
      const hasWrapperContext = context.nameSource === 'wrapper'
        && (context.sourceDescription || context.propertyType);
      if (hasWrapperContext && !wrapperNameMatchesProperty(defaultName, context)) {
        return (localNames && localNames[defaultName]) || defaultName;
      }
      return officialName;
    }

    if (!localNames) return defaultName;
    if (localNames[defaultName]) return localNames[defaultName];

    const separatorIndex = defaultName.indexOf(' - ');
    if (separatorIndex > 0) {
      const left = defaultName.slice(0, separatorIndex);
      const right = defaultName.slice(separatorIndex + 3);
      const localizedLeft = localNames[left] || left;
      const localizedRight = localNames[right] || right;
      if (localizedLeft !== left || localizedRight !== right) return `${localizedLeft} - ${localizedRight}`;
    }

    for (const suffixName of DEVICE_NAME_SUFFIXES) {
      const suffix = ` ${suffixName}`;
      if (defaultName.endsWith(suffix)) {
        return `${defaultName.slice(0, -suffix.length)} ${localNames[suffixName] || suffixName}`;
      }
    }
    return defaultName;
  }

  formatValueListName(propertyName, valueName, context = {}) {
    if (!this.language || context.explicit) return `${propertyName} - ${valueName}`;

    const hasOriginalPropertyName = typeof context.originalPropertyName === 'string';
    const hasOriginalValueName = typeof context.originalValueName === 'string';
    const propertyWasLocalized = !hasOriginalPropertyName || propertyName !== context.originalPropertyName;
    const valueWasLocalized = context.originalValueName === undefined
      || context.originalValueName === null
      || valueName !== context.originalValueName;
    const languageNeutralValue = hasOriginalValueName && /^-?\d+(?:\.\d+)?$/.test(context.originalValueName);

    let formattedPropertyName = propertyName;
    let formattedValueName = valueName;
    if (hasOriginalPropertyName && hasOriginalValueName
      && propertyWasLocalized !== valueWasLocalized
      && !languageNeutralValue) {
      formattedPropertyName = context.originalPropertyName;
      formattedValueName = context.originalValueName;
    }
    formattedPropertyName = formattedPropertyName.trim().replace(/\s+/gu, ' ');
    formattedValueName = formattedValueName.trim().replace(/\s+/gu, ' ');

    if ((this.language === 'zh-Hans' || this.language === 'zh-Hant')
      && context.propertyType === 'mode'
      && propertyWasLocalized
      && valueWasLocalized) {
      return formattedValueName.endsWith('模式') ? formattedValueName : `${formattedValueName}模式`;
    }
    return `${formattedPropertyName} ${formattedValueName}`;
  }
}

module.exports = {
  MiotNameResolver,
  resolveConfiguredCountry,
  resolveConfiguredNameLanguage,
  resolveLanguageFromCountry,
  resolveUrn,
};
