const Properties = require('../../constants/Properties.js');

const OutletProperties = {
  IN_USE: 'in_use',
  USB_POWER: 'usb_power',
  OUTLET_POWER1: 'outlet_power1',
  OUTLET_POWER2: 'outlet_power2',
  OUTLET_POWER3: 'outlet_power3',
  OUTLET_POWER4: 'outlet_power4',
  OFF_MEMORY: 'off_memory'
};

module.exports = {...Properties, ...OutletProperties};
