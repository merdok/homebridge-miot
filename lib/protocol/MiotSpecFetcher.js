const fetch = require('node-fetch');

// DEVICES: http://miot-spec.org/miot-spec-v2/instances?status=all
// device types: http://miot-spec.org/miot-spec-v2/spec/devices
// service types: http://miot-spec.org/miot-spec-v2/spec/services

const ALL_DEVICES_URL = "https://miot-spec.org/miot-spec-v2/instances?status=all";
const INSTANCE_URL = "https://miot-spec.org/miot-spec-v2/instance?type=";


class MiotSpecFetcher {
  constructor() {}


  /*----------========== PUBLIC ==========----------*/

  async fetchMiotSpecFromUrl(specUrl, skipDevInfoService = false) {
    if (specUrl) {
      //const url = `https://miot-spec.org/miot-spec-v2/instance?type=${spec}`;
      const res = await fetch(specUrl);
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
      const res = await fetch(ALL_DEVICES_URL);
      if (!res.ok) {
        throw new Error(`Get all spec error with status ${res.statusText}`);
      }
      const {
        instances
      } = await res.json();

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


  /*----------========== PRIVATE ==========----------*/

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
          const name = this._getUniqueItemName(result.properties, uniqueServiceName, propType, property.iid);
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
          const name = this._getUniqueItemName(result.actions, uniqueServiceName, actionType, action.iid);
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
          const name = this._getUniqueItemName(result.events, uniqueServiceName, eventType, tmpEvent.iid);
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

  _generateItemName(serviceType, itemType) {
    return [serviceType, itemType].join(':');
  }

  _getUniqueItemName(items, serviceType, itemType, itemIid) {
    let key = this._generateItemName(serviceType, itemType);
    if (key in items) {
      key = this._generateItemName(serviceType, itemType + itemIid);
    }
    return key;
  }

}

module.exports = new MiotSpecFetcher();
