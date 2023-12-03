<span align="center">

# homebridge-miot

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
[![homebridge-miot](https://badgen.net/npm/v/homebridge-miot?icon=npm)](https://www.npmjs.com/package/homebridge-miot)
[![mit-license](https://badgen.net/npm/license/lodash)](https://github.com/merdok/homebridge-miot/blob/master/LICENSE)
[![follow-me-on-twitter](https://badgen.net/badge/icon/twitter?icon=twitter&label=merdok_dev)](https://twitter.com/merdok_dev)
[![join-discord](https://badgen.net/badge/icon/discord?icon=discord&label=homebridge-miot)](https://discord.gg/c9AWNESQMg)

</span>

`homebridge-miot` is a plugin for homebridge which allows you to control any device supporting the miot protocol from Xiaomi!  
The goal is to add Homekit support to miot devices and make them fully controllable from the native Homekit iOS app and Siri.

#### Feedback and contribution is helpful and will improve the plugin!
#### If your device is not supported please create a request and specify the device model and type.

### Features
* Integrates miot devices into Homekit
* Detect device types automatically via miot spec or by local device implementations
* Fully customizable Homekit accessories
* Homekit automations for your miot devices

### Supported device types
* Fan
* Ceiling Fan
* Heater
* Humidifier
* Dehumidifier
* Air Purifier
* Air Conditioner
* Outlet
* Curtain
* Fresh Air System
* Robot Cleaner - [Room Cleaning guide](https://github.com/merdok/homebridge-miot/blob/main/docs/robotcleaner.md)
* Light
* Airer
* Oven
* Air Fryer
* Coffee Machine
* Camera
* Bath Heater
* Kettle
* Thermostat
* Switch
* Air Monitor
* Cooker
* Speaker
* Contact Sensor
* Gateway
* Video Doorbell
* Pet Feeder
* Temperature Humidity Sensor
* Submersion Sensor
* Plant Monitor
* Motion Sensor

More device types will be added!

For a full list of supported devices by model check here: [all supported devices by model](https://github.com/merdok/homebridge-miot/blob/master/supported_devices.md).

#### Even if your device is not on the supported devices list, worry not! The plugin will use the miot spec to categorize your device as best as possible.

## Installation

If you are new to homebridge, please first read the homebridge [documentation](https://github.com/homebridge/homebridge#readme).
If you are running on a Raspberry, you will find a tutorial in the [homebridge wiki](https://github.com/homebridge/homebridge/wiki/Install-Homebridge-on-Raspbian).

Install homebridge:
```sh
sudo npm install -g homebridge
```

Install homebridge-miot:
```sh
sudo npm install -g homebridge-miot
```

## Configuration

Add the `miot` platform in `config.json` in your home directory inside `.homebridge`.

Add your devices in the `devices`  array.

Example configuration:

```js
{
  "platforms": [
    {
      "platform": "miot",
      "micloud": {
        "username": "miotuser@mio.com",
        "password": "mySecretPassword",
        "country": "cn"
      },
      "devices": [
        {
          "name": "Xiaomi Smartmi Fan 3",
          "ip": "192.168.0.83",
          "token": "63d4d8fba83f94aa5ad8f96536c84c12",
          "pollingInterval": 10,
          "horizontalMoveControl": true,
          "buzzerControl": true,
          "ledControl": true,
          "modeControl": true,
          "offDelayControl": true,
          "ioniserControl": true,
          "horizontalAngleButtons": [
            5,
            60,
            100
          ],
          "actionButtons": [
            {
              "action": "fan:toggle",
              "name": "Toggle power action",
              "params": [
                123
              ]
            },
            {
              "action": "2.3",
              "name": "Toggle mode action"
            }
          ],
          "methodButtons": [
            {
              "method": "get_room_mapping",
              "name": "Get room mapping"
            }
          ],
          "propertyControl": [
            {
              "property": "fan:anion",
              "name": "Control anion"
            },
            {
              "property": "2.7",
              "value": 0,
              "name": "Set natural wind mode"
            },
            {
              "property": "custom-service:speed-level",
              "config": {
                "type": "fan"
              }
            }
          ],
          "propertyMonitor": [
            {
              "property": "battery:battery-level",
              "name": "Show bat level only when mode 1",
              "linkedProperty": "vacuum:mode",
              "linkedPropertyValue": 1
            },
            {
              "property": "vacuum:mode",
              "value": 2,
              "name": "Notify when mode 2 set"
            },
            {
              "property": "battery:battery-level",
              "value": 15,
              "valueOperator": "lessOrEqual",
              "name": "Low Battery"
            }
          ]
        }
      ]
    }
  ]
}
```

### Token
For the plugin to work the device token is required. The plugin offers you two ways to retrieve the token for your devices:
- You can use the plugin's settings in homebridge-config-ui-x (Homebridge Ui), where you will find a **"Discover All Devices via MiCloud"** button, which can automatically get the tokens for all your devices!
- Another way it to use the command line tools, simply type `miot cloud-devices -u <username> -p <password>` in the command line to get the tokens for all your devices!

Other ways:  
- guide to retrieve token manually: [obtaining mi device token](https://github.com/merdok/homebridge-miot/blob/master/obtain_token.md).  
- a great tool to easily retrieve the token: [Xiaomi Cloud Tokens Extractor](https://github.com/PiotrMachowski/Xiaomi-cloud-tokens-extractor).

### Configuration
Keep in mind that your device needs to support the feature which you enable, otherwise you will not see any effect.
#### Platform configuration fields
- `platform` [required]
Must always be **"miot"**.
- `devices` [required]
A list of your devices.
- `micloud` [optional]
This is a global configuration object for the MiCloud connection. When specified, this credentials will be used when a device requires a MiCloud connection. Some older devices require a MiCloud connection in order to be controlled! **Default: "" (not specified)**
  - Can also be specified even when no devices require the MiCloud, in that case additional information for the devices will be retrieved.
  - An object should have the following properties:
    - *username* - [required] the MiCloud username
    - *password* - [required] the MiCloud password
    - *country* - [optional] the country where the servers are located for your devices. **Default: "cn"**
    - *forceMiCloud* - [optional] forces to use MiCloud even when the device supports local commands. **Default: false**
    - *timeout* - [optional] set a custom request timeout in milliseconds. **Default: 5000**
#### General device configuration fields
- `name` [required]
The name of the accessory.
- `ip` [required]
The ip address of your device.
- `token` [required]
The token of your device.
- `deviceId` [optional]
The deviceId is required for a MiCloud connection to identify the device. If not specified an attempt will be made to retrieve it from a local connection to the device **Default: "" (not specified)**
- `model` [optional]
The device model if known. Should only be specified when certain about the device model. If specified then the accessory will be created instantly without the need to first discover and identify the device. **Default: "" (not specified)**
- `micloud` [optional]
When specified overwrites the global setting for the device. Useful when you have devices on different servers or want to force certain devices to use MiCloud. **Default: "" (not specified)**
- `prefsDir` [optional]
The directory where the device info will be stored. **Default: "~/.homebridge/.xiaomiMiot"**
- `pollingInterval` [optional]
The device state polling interval in seconds. **Default: 15**
- `propertyChunkSize` [optional]
Size of a property chunk when syncing properties with the device. A lower value might reduce the load on the device. Range 1-14 **Default: device class default, if not defined -> 14**
- `deepDebugLog` [optional]
Enables additional more detailed debug log. Useful when trying to figure out issues with the plugin. **Default: false**
- `silentLog` [optional]
When enabled all log output will only appear in debug mode. **Default: false**
- `customAccessory` [optional]
Creates a custom empty accessory for the device which can be manually populated with services. Requires ***actionButtons***, ***propertyControl*** or ***propertyMonitor*** to be set. **Default: false**
- `onlyMainService` [optional]
Only the main accessory service will be created without any additional services. Useful when wanting to have a clean layout. ***actionButtons***, ***propertyControl*** or ***propertyMonitor*** can be used to manually add services. **Default: false**
- `buzzerControl` [optional]
Whether the buzzer service is enabled. This allows to turn on/off the device buzzer/alarm. **Default: true**
- `ledControl` [optional]
Whether the led service is enabled. This allows to turn on/off the device LED. **Default: true**
- `childLockControl` [optional]
Whether the child lock control service is enabled. This allows to turn on/off the device child lock. **Default: true**
- `modeControl` [optional]
Show mode switches which allow to change the device mode. **Default: true**
- `suppressAutoServiceCreation` [optional]
Suppress auto creation of some sensor services. **Default: "" (not specified)**
  - Set an array of service names which should be disabled
  - Available services: *temperature*, *relativeHumidity*, *illumination*
  - Only takes effect if a device supports the specified service and the service is NOT a main device service
- `actionButtons` [optional]
Show additional action switches if the device supports any. **Default: false**
  - Set to *true* or *false* to show/hide all actions available on the device
  - Set an array of action names or action ids to only show the desired actions
  - You can also set an array of objects as the value which enables advanced configuration. An object can have the following properties:
    - *action* - [required] the action name or action id
    - *name* - [optional] the name of the switch
    - *params* - [optional] parameters to be used for the action, not all actions support parameters
- `methodButtons` [optional]
Execute a raw miio method on the device. Can be useful for advanced robot cleaner configuration. **Default: "" (not specified)**
  - Creates statless switches which when pressed execute the method, the result of the method call is printed in the log
  - Set an array of method names to only show the desired method buttons
  - You can also set an array of objects as the value which enables advanced configuration. An object can have the following properties:
    - *method* - [required] the method name
    - *name* - [optional] the name of the switch
    - *params* - [optional] parameters to be used for the method call
- `propertyControl` [optional]
Allows to control any properties of your device. **Default: "" (not specified)**
  - Creates ui controls on your device based on the property type
  - Set an array of property names or property ids
  - You can also set an array of objects as the value which enables advanced configuration. An object can have the following properties:
    - *property* - [required] the property name or id
    - *name* - [optional] the name of the control
    - *value* - [optional] a fixed value which will be set to the property. When specified will create a stateless switch
    - *linkedProperty* - [optional] linked property used for status checking. Useful when control should only be possible when for example the device is on
    - *linkedPropertyValue* - [optional] the value of the linked property
    - *config* - [optional] a configuration object, for details see below
- `propertyMonitor` [optional]
Allows to monitor any properties of your device. **Default: "" (not specified)**
  - Creates a light sensor to display numeric values. String values are logged
  - Set an array of property names or property ids
  - You can also set an array of objects as the value which enables advanced configuration. An object can have the following properties:
    - *property* - [required] the property name or id
    - *name* - [optional] the name of the control
    - *value* - [optional] when a fixed value is specified instead of a light sensor a presence sensor will be created which triggers when the property has the specified value
    - *valueOperator* - [optional] defines the operator which should be used when comparing the value to the property value. Only takes effect when a value is set. Possible values *equal*, *less*, *greater*, *lessOrEqual*, *greaterOrEqual*, *contains*. **Default: "equal"**
    - *linkedProperty* - [optional] linked property used for status checking- Useful when monitor should only be possible when for example the device is on
    - *linkedPropertyValue* - [optional] the value of the linked property

#### Some device types also have some specific configuration fields. Please have a look at the device type page to check whether there are any available under the [docs](https://github.com/merdok/homebridge-miot/tree/main/docs).

#### Property and Action names (or ids)
There are 4 ways to get the property an action names (or ids) used in ***actionButtons***, ***propertyControl*** and ***propertyMonitor***:
- Use the [Miot Spec Fetcher](https://merdok.github.io/miotspec/)
- Use the plugin's settings in homebridge-config-ui-x (Homebridge Ui), where you will find a **"Fetch Device Metadata"** button
- Check the homebridge log. Available device property and action names will be printed there during initialization
- You can also use the official miot spec in order to determine the names or ids [Miot Spec - Released](https://miot-spec.org/miot-spec-v2/instances?status=released)

#### Property control config
Some properties have a configuration which enables to change certain aspects of the resulting service.

###### Value range properties:
- *type* - the type of the accessory which is created **Default: "lightbulb"**
  - lightbulb
  - fan

## BLE and ZigBee devices

It is also possible to connect BLE and ZigBee devices to the plugin via a gateway or hub.
To do that, first the device needs to be connected to the gateway or hub, afterwards you have to manually specify the **token** and **ip** of the gateway/hub, but the **model** and **deviceId** needs to be that of the BLE or ZigBee device.
All the required information can be retrieved from the MiCloud either via the Ui or the CLI commands.

Example:
```js
{
  "platforms": [
    {
      "platform": "miot",
      "devices": [
        {
          "name": "Zigbee Outlet",
          "ip": "<GATEWAY_IP>",
          "token": "<GATEWAY_TOKEN>",
          "model": "lumi.plug.mmeu01",
          "deviceId": "<OUTLET_DID>",
        }
      ]
    }
  ]
}
```


## CLI
The plugin also offers a command line interface to control your devices directly from the command line.  
Just type `miot` in the console to get a list of available options. Currently available are:
- `miot send` -> Send a RAW command over your local network to the device
- `miot get-prop` -> Get the specified property value from the device. Accepts property id in the format siid:piid
- `miot set-prop` -> Set the value for the specified property. Accepts property id in the format siid:piid
- `miot action` -> Execute an action on the device. Accepts action id in the format siid:aiid
- `miot test` -> Test connection to a device
- `miot tokens` -> Store and show tokens for specific devices
- `miot cloud` -> Connect to the MiCloud, execute commands, list devices and get specific device info
- `miot fetch-metadata` -> Fetch device metadata for the specified model

Examples:
```sh
miot send <IP> -t <TOKEN> get_properties '[{"siid":2,"piid":2}]'

miot send <IP> -t <TOKEN> set_properties '[{"siid":2,"piid":2,"value":1}]'

miot send <IP> -t <TOKEN> action '{"aiid":13,"in":[],"siid":10}'

miot cloud list-devices

miot cloud get-props '[{"siid":2,"piid":2,"did":"<DID>"}]'

miot cloud set-props '[{"siid":2,"piid":2,"value":1,"did":"<DID>"}]'
```

## Troubleshooting

##### Debug
If you have any issues with the plugin or device services then you can run homebridge in debug mode, which will provide some additional information. This might be useful for debugging issues.

Homebridge debug mode:
```sh
homebridge -D
```

Deep debug log, add the following to your config.json:
```json
"deepDebugLog": true
```
This will enable additional extra log which might be helpful to debug all kind of issues.

##### Connection test
You can test the connection to a device with the following cli command:
```sh
miot test <ip> -t <token>
```

If the connection test will succeed then your ip and token are correct!

## Special thanks
[HAP-NodeJS](https://github.com/KhaosT/HAP-NodeJS) & [homebridge](https://github.com/nfarina/homebridge) - for making this possible.
