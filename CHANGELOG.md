# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]


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
