const Properties = require('../../constants/Properties.js');

const OutletProperties = {
  IN_USE: 'in_use',
  USB_POWER: 'usb_power',
  OUTLET_POWER1: 'outlet_power1',
  OUTLET_POWER2: 'outlet_power2',
  OUTLET_POWER3: 'outlet_power3',
  OUTLET_POWER4: 'outlet_power4',
  OFF_MEMORY: 'off_memory',
  POWER_CONSUMPTION: 'power_consumption',
  VOLTAGE: 'voltage',
  ELECTRIC_CURRENT: 'electric_current',
  ELECTRIC_POWER: 'electric_power',
  REVERSE_LED: 'reverse_led',
  OVERHEAT_ALARM: 'overheat_alarm'
};

module.exports = {...Properties, ...OutletProperties};
