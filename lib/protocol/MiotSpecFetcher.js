const fetch = require('node-fetch');

// DEVICES: http://miot-spec.org/miot-spec-v2/instances?status=all
// device types: http://miot-spec.org/miot-spec-v2/spec/devices
// service types: http://miot-spec.org/miot-spec-v2/spec/services

const ALL_DEVICES_URL = "https://miot-spec.org/miot-spec-v2/instances?status=all";
const INSTANCE_URL = "https://miot-spec.org/miot-spec-v2/instance?type=";
// Guard every fetch so a slow/unreachable miot-spec.org cannot hang the caller
// (matches the convention in MiotNameResolver).
const FETCH_TIMEOUT_MS = 4000;
// How long the fetched instances list is reused before re-fetching. The list
// changes rarely and is large, so a single fetch serves a whole startup pass.
const INSTANCES_CACHE_TTL_MS = 60 * 60 * 1000;


class MiotSpecFetcher {
  constructor() {
    this._instancesCache = null;
    this._instancesCacheTime = 0;
  }


  /*----------========== PUBLIC ==========----------*/

  async fetchMiotSpecFromUrl(specUrl, skipDevInfoService = false) {
    if (specUrl) {
      //const url = `https://miot-spec.org/miot-spec-v2/instance?type=${spec}`;
      const res = await fetch(specUrl, {timeout: FETCH_TIMEOUT_MS});
      if (!res.ok) {
        throw new Error(`Get spec error with status ${res.statusText}`);
      }
      const result = await this._processMiotFetchResult(res, skipDevInfoService);
      result.specUrl = specUrl;
      return result;
    } else {
      throw new Error(`No miot spec url specified! Cannot fetch!`);
    }
    return {};
  }

  async fetchMiotSpecByModel(model, skipDevInfoService = false) {
    let specUrl = undefined;
    specUrl = await this.findDeviceMiotSpecUrlByModel(model);
    return this.fetchMiotSpecFromUrl(specUrl, skipDevInfoService);
  }

  async findDeviceMiotSpecUrlByModel(model) {
    if (model) {
      const instances = await this._getInstancesList();

      const lastFoundSpecIndex = instances.map(spec => spec.model === model).lastIndexOf(true);
      let foundSpec = instances[lastFoundSpecIndex];
      if (foundSpec && foundSpec.type) {
        return INSTANCE_URL + foundSpec.type;
      }
      throw new Error(`Could not find miot spec for model ${model}`);
      return undefined;
    } else {
      throw new Error(`No miot spec url specified! Cannot fetch!`);
    }
    return undefined;
  }

  // Returns the highest published spec version (an integer) for a model, or
  // undefined if the model is not in the registry. Used to detect when a
  // bundled device definition is behind the latest published spec.
  async getLatestVersionForModel(model) {
    if (!model) {
      return undefined;
    }
    const instances = await this._getInstancesList();
    let latest = undefined;
    for (const inst of instances) {
      if (inst.model === model && typeof inst.version === 'number') {
        if (latest === undefined || inst.version > latest) {
          latest = inst.version;
        }
      }
    }
    return latest;
  }


  /*----------========== PRIVATE ==========----------*/

  // Fetch the full instances list once and reuse it for a short TTL. A single
  // fetch serves every device loaded during a startup pass instead of
  // re-downloading the large list per device.
  async _getInstancesList() {
    const now = Date.now();
    if (this._instancesCache && (now - this._instancesCacheTime) < INSTANCES_CACHE_TTL_MS) {
      return this._instancesCache;
    }
    const res = await fetch(ALL_DEVICES_URL, {timeout: FETCH_TIMEOUT_MS});
    if (!res.ok) {
      throw new Error(`Get all spec error with status ${res.statusText}`);
    }
    const {
      instances
    } = await res.json();
    this._instancesCache = instances || [];
    this._instancesCacheTime = now;
    return this._instancesCache;
  }

  async _processMiotFetchResult(data, skipDevInfoService = false) {
    const {
      type,
      description,
      services
    } = await data.json();
    const result = {};
    result.type = type;
    result.description = description;
    result.services = [];
    result.properties = {};
    result.actions = {};
    result.events = {};
    services.forEach(service => {
      const {
        iid,
        type,
        description,
        properties,
        actions,
        events
      } = service;

      // if skipDevInfoService then skip device information service
      if (skipDevInfoService && type.includes('device-information')) {
        return;
      }

      let newService = {};
      newService.siid = iid;
      newService.type = type;
      newService.description = description;
      const uniqueServiceName = this._getUniqueServiceName(result.services, type, iid);
      if (properties) {
        properties.forEach(property => {
          const propType = property.type.split(':')[3];
          const name = this._getUniqueEntityName(result.properties, uniqueServiceName, propType, property.iid);
          result.properties[name] = {
            name: name,
            siid: service.iid,
            piid: property.iid,
            type: property.type,
            description: property.description,
            format: property.format,
            access: property.access,
            unit: property.unit,
            valueRange: property['value-range'],
            valueList: property['value-list']
          };
        });
      }
      if (actions) {
        actions.forEach(action => {
          const actionType = action.type.split(':')[3];
          const name = this._getUniqueEntityName(result.actions, uniqueServiceName, actionType, action.iid);
          result.actions[name] = {
            name: name,
            siid: service.iid,
            aiid: action.iid,
            type: action.type,
            description: action.description,
            in: action.in,
            out: action.out
          };
        });
      }
      if (events) {
        events.forEach(tmpEvent => {
          const eventType = tmpEvent.type.split(':')[3];
          const name = this._getUniqueEntityName(result.events, uniqueServiceName, eventType, tmpEvent.iid);
          result.events[name] = {
            name: name,
            siid: service.iid,
            eiid: tmpEvent.iid,
            type: tmpEvent.type,
            description: tmpEvent.description,
            arguments: tmpEvent.arguments
          };
        });
      }
      result.services.push(newService);
    });

    return result;
  }

  _getUniqueServiceName(services, curServiceType, curServiceSiid) {
    const serviceType = curServiceType.split(':')[3];
    const sameServiceExists = services.find(service => service.type.split(':')[3] === serviceType);
    if (sameServiceExists) {
      return `${serviceType}${curServiceSiid}`;
    }
    return serviceType;
  }

  _generateEntityName(serviceType, itemType) {
    return [serviceType, itemType].join(':');
  }

  _getUniqueEntityName(items, serviceType, itemType, itemIid) {
    let key = this._generateEntityName(serviceType, itemType);
    if (key in items) {
      key = this._generateEntityName(serviceType, itemType + itemIid);
    }
    return key;
  }

}

module.exports = new MiotSpecFetcher();
