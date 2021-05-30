<span align="center">

# homebridge-miot

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)
[![homebridge-miot](https://badgen.net/npm/v/homebridge-miot?icon=npm)](https://www.npmjs.com/package/homebridge-miot)
[![mit-license](https://badgen.net/npm/license/lodash)](https://github.com/merdok/homebridge-miot/blob/master/LICENSE)
[![follow-me-on-twitter](https://badgen.net/twitter/follow/merdok_dev?icon=twitter)](https://twitter.com/merdok_dev)
[![join-discord](https://badgen.net/badge/icon/discord?icon=discord&label=homebridge-xiaomi-fan)](https://discord.gg/AFYUZbk)

</span>

`homebridge-miot` is a plugin for homebridge which allows you to control any device supporting the miot protocol from Xiaomi! More devices will be added over time.
The goal is to add Homekit support to miot devices and make them fully controllable from the native Homekit iOS app and Siri.

#### This is a Work in Progress. Feedback and contribution is helpful and will improve the plugin!
#### Since the plugin was made with the intention to implement new devices easy and fast, it should be pretty straight forward to do that. If your device is not supported please create a request and specify the device model and type.

### Features
* Integrates miot devices into homekit
* Detect device types automatically if the device is supported
* Homekit automations for your miot devices

### Supported device types
* Fan
* Ceiling Fan
* Heater
* Humidifier
* Dehumidifier
* Air Purifier
* Outlet
* Curtain
* Fresh Air System
* Robot Cleaner

More device types will be added!

For a full list of supported devices by model check here: [all supported devices by model](https://github.com/merdok/homebridge-miot/blob/master/supported_devices.md).

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
          "shutdownTimer": true,
          "ioniserControl": true,
          "horizontalAngleButtons": [
            5,
            60,
            100
          ],
          "actionButtons": [
            {
              "action": "toggle_power",
              "name": "Toggle power action",
              "params": [
                123
              ]
            },
            {
              "action": "toggle_mode",
              "name": "Toggle mode action"
            }
          ]
        }
      ]
    }
  ]
}
```

### Token
For the plugin to work the device token is required. For methods on how to find the token refer to this guide [obtaining mi device token](https://github.com/merdok/homebridge-miot/blob/master/obtain_token.md).

You can also use this tool to easily retrieve the token: [Xiaomi Cloud Tokens Extractor](https://github.com/PiotrMachowski/Xiaomi-cloud-tokens-extractor).

### Configuration
Keep in mind that your device needs to support the feature which you enable, otherwise you will not see any effect.
#### Platform configuration fields
- `platform` [required]
Should always be **"miot"**.
- `devices` [required]
A list of your devices.
#### General configuration fields
- `name` [required]
Name of your accessory.
- `ip` [required]
ip address of your device.
- `token` [required]
The token of your device.
- `deviceId` [optional]
The deviceId will be automatically retrieved by the plugin but if there is trouble you can manually specify it. **Default: "" (not specified)**
- `model` [optional]
The device model if known. Should only be specified when certain about the device model. If specified then the accessory will be created instantly without the need to first discover and identify the device. **Default: "" (not specified)**
- `micloud` [optional]
This is a configuration object for the MiCloud. Some older devices require a MiCloud connection in order to be controlled! **Default: "" (not specified)**
- Can also be specified even when the device does not require the MiCloud, in that case additional information for the device will be retrieved.
- An object should have the following properties:
  - *username* - [required] the MiCloud username
  - *password* - [required] the MiCloud password
  - *country* - [optional] the country where the servers are located for your devices. **Default: "cn"**
- `prefsDir` [optional]
The directory where the device info will be stored. **Default: "~/.homebridge/.xiaomiMiot"**
- `pollingInterval` [optional]
The device state background polling interval in seconds. **Default: 5**
- `deepDebugLog` [optional]
Enables additional more detailed debug log. Useful when trying to figure out issues with the plugin. **Default: false**
- `buzzerControl` [optional]
Whether the buzzer service is enabled. This allows to turn on/off the device buzzer/alarm. **Default: true**
- `ledControl` [optional]
Whether the led service is enabled. This allows to turn on/off the device LED. **Default: true**
- `childLockControl` [optional]
Whether it is possible to control the child lock. Shows a switch on the device accessory to enable/disable the child lock. **Default: true**
- `actionButtons` [optional]
Show additional action switches if the device supports any. **Default: false**
  - Set to *true* or *false* to show/hide all actions available on the device
  - Set an array of action names to only show the desired actions
  - You can also set an array of objects as the value which enables advanced configuration. An object can have the following properties:
    - *action* - [required] the action name
    - *name* - [optional] the name of the switch
    - *params* - [optional] parameters to be used for the action, not all actions support parameters
  - To get the action names available for the device simply check the homebridge debug console. The action names will be printed there during initialization
#### Fan specific configuration fields
- `swingControl` [optional]
Show a switch to quickly enable/disable horizontal and/or vertical swing mode. **Default: false**
- `moveControl` [optional]
Whether the move control service is enabled. This allows to move the fan in 5° to the left, right, up or down. **Default: false**
- `fanLevelControl` [optional]
Show fan level switches which allow to change the fan level. **Default: true**
- `modeControl` [optional]
Show mode switches which allow to change the device mode. **Default: true**
- `ioniserControl` [optional]
Show a switch which allows to quickly enable/disable the ioniser on your fan. **Default: false**
- `shutdownTimer` [optional]
Show a slider (as light bulb) which allows to set a shutdown timer in minutes. **Default: false**
- `horizontalAngleButtons` [optional]
Whether the angle buttons service is enabled. This allows to create buttons which can change between different horizontal oscillation angles. **Default: "" (disabled)**
  - Set an array of numeric values. Possible values depend on the fan model
  - Some fans support predefined angle buttons, in the case the specified angles are ignored and the supported angle buttons are retrieved from the fan and displayed as switches
  - Tapping the active oscillation angle button will disable oscillation completely
- `verticalAngleButtons` [optional]
Same as above but for vertical oscillation angles. **Default: "" (disabled)**
#### Ceiling Fan specific configuration fields
- `fanLevelControl` [optional]
Show fan level switches which allow to change the fan level. **Default: true**
- `modeControl` [optional]
Show mode switches which allow to change the fan mode. **Default: false**
- `lightModeControl` [optional]
Show light mode switches which allow to change the light mode. **Default: false**
- `lightShutdownTimer` [optional]
Show a slider (as light bulb) which allows to set a shutdown timer in minutes for the light. **Default: false**
#### Heater specific configuration fields
- `shutdownTimer` [optional]
Show a slider (as light bulb) which allows to set a shutdown timer in minutes. **Default: false**
- `heatLevelControl` [optional]
Show heat level switches which allow to change the heat level. **Default: false**
- `modeControl` [optional]
Show mode switches which allow to change the device mode. **Default: false**
#### Humidifier specific configuration fields
- `dryControl` [optional]
Whether the dry control service is enabled. This allows to quickly turn control the dry state. **Default: true**
- `screenControl` [optional]
Whether the screen service is enabled. This allows to turn on/off the device screen and control brightness. **Default: true**
- `fanLevelControl` [optional]
Show fan level switches which allow to change the fan level. **Default: true**
#### Dehumidifier specific configuration fields
- `fanLevelControl` [optional]
Show fan level switches which allow to change the fan level. **Default: true**
- `modeControl` [optional]
Show mode switches which allow to change the device mode. **Default: false**
#### Air Purifier specific configuration fields
- `screenControl` [optional]
Whether the screen service is enabled. This allows to turn on/off the device screen and control brightness. **Default: true**
- `fanLevelControl` [optional]
Show fan level switches which allow to change the fan level. **Default: false**
- `modeControl` [optional]
Show mode switches which allow to change the device mode. **Default: false**
- `pm25Breakpoints` [optional]
Define a custom array of pm25 breakpoints. Provide an array with exactly 4 unique numbers. **Default: [7, 15, 30, 55]**
#### Curtain specific configuration fields
- `motorControl` [optional]
Show motor control switches which allow to control the curtains. **Default: true**
- `motorReverseControl` [optional]
Show a switch which allows to quickly reverse the motor. **Default: false**
#### Frash Air System specific configuration fields
- `fanLevelControl` [optional]
Show fan level switches which allow to change the fan level. **Default: true**
- `heaterControl` [optional]
Show a switch which allows to quickly enable the heater. **Default: true**
#### Robot Cleaner specific configuration fields
- `modeControl` [optional]
Show mode switches which allow to change the device mode. **Default: false**
- `mopModeControl` [optional]
Show mop mode switches which allow to change the device mop mode. **Default: false**
- `dndControl` [optional]
Show a switch which allows to quickly enable do not disturb mode. **Default: false**
#### Outlet specific configuration fields
- `offMemoryControl` [optional]
Show switches which allow to change the device off memory behaviour. **Default: false**

## Troubleshooting
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

## Special thanks
[miio](https://github.com/aholstenson/miio) - the Node.js remote control module for Xiaomi Mi devices.

[HAP-NodeJS](https://github.com/KhaosT/HAP-NodeJS) & [homebridge](https://github.com/nfarina/homebridge) - for making this possible.
