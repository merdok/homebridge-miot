# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]


## [0.9.10] - 2021-08-20
### Added
- Added support for hanyi.airpurifier.kj550 (MiWhole Air Purifier Mix) air purifier
- Added support for dreame.vacuum.p2029 (Dreame Bot L10 Pro) robot cleaner

### Changed
- Some improvements to the oven accessory

### Fixed


## [0.9.9] - 2021-08-09
### Added
- New coffee machine device type
- New camera device type with basic support (no stream)
- Added support for chunmi.oven.x02 (Mi Smart Steam Oven) oven
- Added support for scishare.coffee.s1102 (Scishare Capsule Coffee Maker) coffee machine
- Added support for zhimi.airpurifier.xa1 (Mi Air Purifier X) air purifier
- Added support for dreame.vacuum.p2036 (Xiaomi Trouver Finder LDS Vacuum) robot cleaner
- Added support for isa.camera.hlc7 (Xiaomi Mi Home Magnetic Mount Outdoor Camera) camera
- Added support for the air.fan.ca23ad9 (AIRMATE CA23-AD9 Air Circulation Fan) fan
- Added support for rockrobo.vacuum.v1 (Xiaomi Mi Robot Vacuum) robot cleaner

### Fixed
- Fixed an warning for humidifier devices


## [0.9.8] - 2021-07-26
### Added
- Added support for mijia.vacuum.v2 (Xiaomi Mi Robot Vacuum Mop G1) robot cleaner
- Added support for dreame.vacuum.p2028 (Dreame Bot Z10 Pro Vacuum) robot cleaner
- Added support for yeelink.light.color3 (Yeelight LED Color Bulb) light

### Changed
- Show target temperature on air conditioner devices which does not support temperature reporting
- Cleaned up actions
- Improve device factories
- Improve device definition

### Fixed
- Fixed an error for air conditioner devices


## [0.9.7] - 2021-07-05
### Added
- Added carbon dioxide sensor to fresh air systems
- New `co2AbnormalThreshold` property to control the abnormal state of the carbon dioxide sensor
- Show VOC value on air quality sensor if available
- Added support for dreame.vacuum.p2041 (Xiaomi Mijia 1T Robot Vacuum Cleaner) robot cleaner
- Added support for lumi.acpartner.mcn02 (Xiaomi Mi Air Conditioner Companion 2) air conditioner
- Added support for dmaker.airfresh.t2017 (Xiaomi Air Purifier MJXFJ-300-G1) fresh air system
- Added support for zhimi.airpurifier.v7 (Xiaomi Mi Air Purifier Pro V7) air purifier
- Added `heatLevelControl` property for supported Fresh Air Systems devices

### Changed
- The chunmi.microwave.n20l01 is now marked as MiCloud required
- Adjusted hyd.airer.znlyj1 device spec

### Fixed
- Fixed some typos in the chunmi.microwave.n20l01 oven
- Fixed typo in README


## [0.9.6] - 2021-06-28
### Added
- Added support for Oven devices
- Added support for chuangmi.plug.212a01 (Mi Smart Power Plug 2) outlet
- Added support for dmaker.airfresh.a1 (Xiaomi Mi Air Purifier A1) fresh air system
- Added support for chunmi.microwave.n20l01 (Mi Smart Microwave Oven) oven

### Changed
- Improvements to the air quality service
- Marked viomi.vacuum.v10 as a MiCloud device
- Change airer accessory to lightbulb instead of window covering


## [0.9.5] - 2021-06-21
### Changed
- Add additional MiCloud servers
- Update README

### Fixed
- Fixed a typo which might cause a crash


## [0.9.4] - 2021-06-20
### Added
- Added support for Air Conditioner devices
- Added support for Airer devices
- Added support for viomi.vacuum.v10 (Mi Robot Vacuum Mop P) vacuum cleaner
- Added support for cuco.plug.cp2 (Gosund Socket) outlet device
- Added support for zhimi.fan.za4 (Smartmi Standing Fan 2S) fan
- Added support for dmaker.fan.p18 (Mi Smart Fan 2) fan
- Added support for lumi.aircondition.acn05 (Aqara Air Conditioning Companion P3) air conditioner
- Added support for hyd.airer.znlyj1 (MIJIA Smart Clothes Dryer) airer

### Changed
- Added `ledControl` and `shutdownTimer` property to outlet devices
- The generated accessory uuid will now be more unique to prevent conflicts, this might cause existing accessories to reset


## [0.9.3] - 2021-06-07
### Added
- Added support for Light devices
- Added support for yeelink.light.fancl5 (Yeelight Smart Ceiling Fan C900) ceiling fan
- Added support for dreame.vacuum.p2009 (Dreame D9) vacuum cleaner
- Added support for leshi.light.wy0b01 (Scenario WIFI Dual Color Light) light

### Changed
- Retry MiCloud connection on failed login
- Improvements the color temperature characteristic

### Fixed
- Fixed some unhandled errors


## [0.9.2] - 2021-06-01
### Fixed
- Fixed broken config.schema.json


## [0.9.1] - 2021-06-01
### Added
- Added support for zhimi.airpurifier.ma2 (Xiaomi Air Purifier 2S) air purifier

### Changed
- Removed `childLockControl` property
- Improvements to logging

### Fixed
- Fixed an issue where the country for MiCloud was ignored
- Fixed an issue in the config.schema.json with buzzer and led control


## [0.9.0] - 2021-05-31
### Added
- The plugin now supports connection to the MiCloud allowing older devices to also be controlled with the miot protocol
- Added support for roborock.vacuum.m1s (Xiaomi Mi Robot 1S) robot cleaner
- Added support for zhimi.airpurifier.mc2 (Xiaomi Air Purifier 2H) air purifier
- Added support for dmaker.fan.p5 (Mi Smart Fan 1X) fan
- Added support for cuco.plug.cp5 (Gosund Smart Power Strip) outlet
- New `micloud` property for specifying the MiCloud credentials, only required for older devices
- New `offMemoryControl` property for supported Outlet devices

### Changed
- Lots of improvements to the miot protocol
- Devices will now not reconnect immediately on the first failed request, but instead after 3 consecutive fails, this should sort out sporadic packet loss
- Improved fan speed emulation on devices which only support fan levels
- More under the hood changes and improvements
- Some improvements in the config.schema.json

### Fixed
- Fixed a warning which appeared on air purifier devices
- Fixed a bug where devices would appear online even when no connection was established to the device
- Fixed a bug where devices would not reconnect when the connection was lost


## [0.8.2] - 2021-05-24
### Added
- Added support for zhimi.fan.fb1 (Mi Smart Air Circulator Fan) fan
- New `verticalAngleButtons` property for fans that support vertical oscillation angles

### Changed
- Improved status reporting of some switches

### Fixed
- Fixed an issue where creating a custom list of `actionButtons` would fail


## [0.8.1] - 2021-05-20
### Fixed
- Fixed a visual error which was displayed in the debug homebridge console when setting a property
- Fixed property fetching for device with many properties


## [0.8.0] - 2021-05-13
### Added
- Added support for roborock.vacuum.a15 (Roborock Vacuum S7) vacuum cleaner
- Added support for roborock.vacuum.a11 (Roborock Vacuum T7) vacuum cleaner
- Added support for leshi.curtain.v0001 (Scene Curtain WIFI X) curtains
- `actionButtons` property is now available for all devices and allows to show additional actions for devices that support any

### Changed
- `actionButtons` property has now an advanced configuration which allows to show/hide certain buttons, rename buttons or add parameters to actions
- More under the hood changes and improvements
- Some improvements in the config.schema.json

### Fixed
- Fixed some small issues and typos


## [0.7.4] - 2021-05-08
### Added
- Added support for dreame.vacuum.mc1808 vacuum cleaner

### Changed
- Optimized config.schema.json


## [0.7.3] - 2021-05-04
### Fixed
- Fixed a warning for air purifier devices
- Fixed property mapping for nwt.derh.312en dehumidifer device


## [0.7.2] - 2021-05-02
### Fixed
- Air purifier favorite speed has now the correct value range (0-100%)


## [0.7.1] - 2021-05-01
### Added
- Added support for zhimi.airpurifier.va1 air purifier

### Changed
- Improvements to favorite speed for air purifier devices

### Fixed
- Fixed a couple of minor typos which might have caused crashes


## [0.7.0] - 2021-04-28
### Added
- Added support for robot cleaner devices (dreame.vacuum.p2008)
- Added support for dehumidifier devices (nwt.derh.312en)

### Changed
- Improvements to humidifier devices
- Many under the hood changes and improvements

### Fixed
- Fixed some small issue which might have caused a crash


## [0.6.5] - 2021-04-23
### Changed
- Improvements to fans
- Merged `horizontalSwingControl` and `verticalSwingControl` properties into `swingcontrol` for fans
- Merged `verticalMoveControl` and `horizontalMoveControl` properties into `moveControl` for fans
- Greatly improved the `screenControl` service
- Optimizations to other services

### Fixed
- Fixed an issue with the `screenControl` service
- Fixed some issues in heater devices


## [0.6.4] - 2021-04-20
### Changed
- Improvements to humidifiers
- Renamed `dryModeControl` property to `dryControl` for humidifiers
- Greatly improved the `screenControl` service
- A warning will now be shown in the homebridge console if the `pm25Breakpoints` property has a wrong value

### Fixed
- Fixed wrong mapping of some properties


## [0.6.3] - 2021-04-15
### Added
- Added new property `pm25Breakpoints` to air purifiers
- Emulate rotation speed on unsupported fresh air systems

### Changed
- Improvements to heaters
- Code cleanup


## [0.6.2] - 2021-04-12
### Changed
- Improvements to air purifiers
- Renamed `fanModeControl` property to `modeControl` for ceiling fans
- Improvements to the miot protocol, skip property update for properties which are marked as write only
- Code cleanup

### Fixed
- Fixed curtain devices status update


## [0.6.1] - 2021-04-11
### Added
- Added new property `lightShutdownTimer` to ceiling fans

### Changed
- Improvements to ceiling fans

### Fixed
- Fixed a small issue with the shutdownTimer service


## [0.6.0] - 2021-04-09
### Added
- Added support for outlet devices (cuco.plug.cp1)
- Added support for curtain devices (dooya.curtain.m2)
- Added support for fresh air system devices (zhimi.airfresh.ua1)

### Changed
- Lots of code cleanup and under the hood improvements

### Fixed
- Air quality and filter change reporting on air purifiers now also works when power is off


## [0.5.6] - 2021-04-02
### Fixed
- Fixed some issues with ceiling fans

### Changed
- Some minor under the hood changes


## [0.5.5] - 2021-03-31
### Added
- Ceiling fans now support rotation speed for easier speed setting
- New modeControl property for certain devices which allows to quickly switch between the device modes

### Changed
- Lots of improvements to the miot protocol
- Use property value list instead of capabilities
- Due to the protocol improvements changed some of the properties
- Improved config.schema.json

### Fixed
- Fixed a bug in generic accessory which prevented the possibility to turn on the device


## [0.5.2] - 2021-03-25
### Fixed
- Fixed deepDebugLog causing a crash


## [0.5.1] - 2021-03-24
### Changed
- Lots of under the hood improvements which should enable more features in the future

### Fixed
- Fixed an illegal value warning for ceiling fans
- Fixed an error which occurred when tried to control ceiling fans
- Fixed deepDebugLog actually not having any effect


## [0.5.0] - 2021-03-22
### Added
- Added support for ceiling fan devices (opple.light.fanlight, yeelink.light.fancl1, yeelink.light.fancl2)

### Changed
- Implemented proper idle state for air purifiers
- Implemented proper idle state for fans
- Heaters now have a swing mode service
- Child Lock control can now be disabled
- When setting rotation speed on air purifiers, the device will not automatically switch to favorite mode if supported
- Improved air quality sensor on air purifiers


## [0.4.9] - 2021-03-18
### Added
- Added support for the zhimi.heater.na1 heater device

### Changed
- Improvements to the heater accessory to better various capabilities

### Fixed
- Fixed a minor issue with favorite speed on air purifier devices


## [0.4.8] - 2021-03-15
### Changed
- Improvements to the protocol


## [0.4.7] - 2021-03-12
### Added
- Emulate stepless fan control on fans not supporting that feature

### Fixed
- Fix warnings on heater devices

### Changed
- Improved heater module


## [0.4.6] - 2021-03-11
### Fixed
- Fix protocol property setting


## [0.4.5] - 2021-03-10
### Added
- Added filter maintenance info to air purifier devices

### Changed
- Improve the miot protocol
- Store more info for miot properties
- Remove some capabilities in favor of property information
- Adjusted README
- Code cleanup


## [0.4.0] - 2021-03-07
### Fixed
- Fixed some issue with Heater devices
- Fixed small issue with fan levels on Fan devices

### Changed
- Improve the LED control service for all devices
- Improve the LED control service for all devices
- Cleanup the device modules


## [0.3.12] - 2021-03-06
### Fixed
- Fixed a typo


## [0.3.11] - 2021-03-06
### Fixed
- Fixed air purifier led control status


## [0.3.10] - 2021-03-06
### Fixed
- Fixed air purifier led control
- Fixed use time units


## [0.3.9] - 2021-03-06
### Fixed
- Fixed some air purifier capabilities


## [0.3.8] - 2021-03-06
### Changed
- Improve the miot protocol to properly handle "off" states


## [0.3.7] - 2021-03-06
### Fixed
- Fixed a small typo


## [0.3.6] - 2021-03-06
### Fixed
- Calculate the favorite speed as percentage based on the supported range on supported air purifier devices


## [0.3.5] - 2021-03-06
### Fixed
- Use proper property for favorite speed on Air Purifier devices


## [0.3.4] - 2021-03-06
### Fixed
- Fixed a naming issue


## [0.3.3] - 2021-03-06
### Fixed
- Fixed accessory creation issue


## [0.3.2] - 2021-03-06
### Fixed
- Fixed some more protocol typos which caused issues

### Changed
- Improved "use time" handling on supported devices


## [0.3.1] - 2021-03-02
### Fixed
- Fixed some protocol typos which caused issues


## [0.3.0] - 2021-03-02
### Added
- Air Purifier support
- Added 5 new heater devices

### Changed
- Improved heater support
- More under the hood improvements

### Fixed
- Fixed some issues with heater accessories


## [0.2.0] - 2021-03-01
### Added
- Humidifier support

### Changed
- Lots of under the hood improvements

### Fixed
- Fixed some issue with fan accessories
- Fixed some issues with heater accessories


## [0.1.0] - 2021-02-28
### Initial release
