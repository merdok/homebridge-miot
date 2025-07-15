# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.7.8] - 2025-07-16
### Added
- Added support for xiaomi.airp.va3 (Xiaomi Air Purifier 5S) air purifier. Thanks @zinzilulo for the contribution
- Added support for dmaker.fan.p45 (Xiaomi Tower Fan 2) fan
- Added support for zhimi.fan.za3 (Smartmi Standing Fan 2) fan


## [1.7.7] - 2025-06-23
### Added
- Added support for cgllc.airm.cgs2 (Qingping Air Monitor 2) air monitor. Thanks @M4nk1n for the contribution
- Added support for deerma.humidifier.jsq1 (Mi Smart Antibacterial Humidifier S) humidifier. Thanks @M4nk1n for the contribution
- Added support for xiaomi.derh.13l.js (Xiaomi Dehumidifier 13L) dehumidifier. Thanks @Willian-Zhang for the contribution

## [1.7.6] - 2025-06-21
### Fixed
- Fixed issues with the MiCloud connection. Thanks @JosephStalin0305 for the providing the fix!

## [1.7.5] - 2024-11-21
### Added
Added support for node.js v22

### Fixed
- Fixed an issue where switch accessories could be created with non-unique names


## [1.7.4] - 2024-09-06
### Added
Added support for Homebridge 2.x


## [1.7.3] - 2024-08-01
### Fixed
- Hot fix for filter life level


## [1.7.2] - 2024-07-26
### Added
- Added support for xiaomi.airc.r24r00 (Xiaomi Air Conditioner KFR-35GW/V1A1 2024) air conditioner. Thanks @Willian-Zhang for the contribution
- Added support for xiaomi.fan.p51 (Mijia Air Circulation Fan) fan. Thanks @Willian-Zhang for the contribution

### Fixed
- Ensure filter life level does not exceed 100 as some devices might return a value which is greater


## [1.7.1] - 2024-04-20
### Added
- New `deviceEnabled` configuration property which allows to disable devices and stop unnecessary reconnects when a device is longer offline
- Added support for roborock.vacuum.a75 (Roborock Q Revo) robot cleaner. Thanks @pablolop002 for the contribution

### Changed
- Updated spec for dmaker.airfresh.a1 fresh air system. Thanks @Willian-Zhang for the contribution


## [1.7.0] - 2023-12-05
### Added
- New `silentLog` configuration property which when enabled allows to disable all log output
- Added motion sensor module. Thanks @eric14142004 for the contribution
- Action param parsing can now be disabled per device
- New 'contains' value operator which allows to specify a list of values as a value for propertyMonitor and it will check if any of the specified values match
- Allow to configure food dispense amount for pet feeders. The `foodAmount` configuration property can be used for that
- Handle HCHO density on air quality sensors correctly if the device supports it
- Some new cli commands for simpler property access or action execution on the device
- Added support for lumi.sensor_magnet.v2 (Xiaomi Mi Door and Window Sensor) contact sensor! Thanks @350d for the contribution
- Added support for roborock.vacuum.a51 (Roborock S8) robot cleaner
- Added support for roborock.vacuum.a70 (Roborock S8 Pro Ultra) robot cleaner

### Changed
- Status overrides for robot cleaners can now also be specified as arrays, allowing to handle multiply statuses with the same name correctly
- Auto status parsing logic has been enhanced to also take into account multiple status with the same name
- Some smaller minor updates under the hood


## [1.6.2] - 2023-07-11
### Added
- Added support for zhimi.airpurifier.ma4 (Xiaomi Mi Air Purifier 3) air purifier. Thanks @thealpa for the contribution
- Added support for chunmi.cooker.r2.js (Joyami Smart Rice Cooker S1) cooker. Thanks @sirinveen for the contribution

### Fixed
- Code cleanup


## [1.6.1] - 2023-04-25
### Added
- Added value operator to property monitor which allows to the value to be used as a threshold
- Added support for roborock.vacuum.a62 (Roborock S7 Pro Ultra) robot cleaner. Thanks @pawelaugustyn for the contribution
- Added dreame1808-specific room cleaning section to the documentation. Thanks @mavoronin for the contribution


## [1.6.0] - 2023-03-31
### Added
- Added temperature humidity sensor module
- Added submersion sensor module
- Added plant monitor module
- New `suppressAutoServiceCreation` configuration property which allows to suppress auto created services
- Added support for chunmi.cooker.eh1.js (Xiaomi Mijia Smart Rice Cooker 1.6 L) cooker. Thanks @romacv for the contribution
- Added support for careli.fryer.maf05a (Mi Smart Air Fryer Pro 4L) air fryer. Thanks @Skjall for the contribution
- Illumination property can now be auto detected on devices

### Changed
- Add default food value for pet feeder devices

### Fixed
- Fix switch naming
- Fix total clean time unit on some robot cleaner devices


## [1.5.2] - 2023-03-06
### Added
- Added pet feeder module
- Added support for yeelink.light.fancl6 (Yeelight Smart Ceiling Fan C1060) ceiling fan

### Changed
- It is now possible to show BLE devices from the MiCloud in the homebridge ui and using the list-devices cli command


## [1.5.1] - 2023-02-17
### Added
- Added video doorbell module
- Added support for madv.cateye.mowl3g (Xiaomi Smart Doorbell 3) video doorbell
- Added support for hlumi.airer.acn02 (Aqara Smart Clothes Drying Rack Lite) airer
- Added support for dmaker.humidifier.p2 (Xiaomi Mijia Pure Smart Humidifier 2) humidifier
- Added support for yeelink.light.bslamp2 (Xiaomi Mi Bedside Lamp 2) light. Thanks @jaaasonSun for the contribution
- Added support for dreame.vacuum.r2250 (Dreame D10s Pro) robot cleaner

### Changed
- Update the leshow.humidifier.jsq1 spec


## [1.5.0] - 2023-01-09
### Added
- New `methodButtons` configuration property which allows to call a raw miio method on the device
- Much better generic device support, the plugin will now try to find some common properties in the miot spec and expose those automatically for device which have no dedicated class
- Added new contact sensor module
- Added gateway module
- Ambient light control will now show up on light device which support that
- Added support for isa.magnet.dw2hl (Xiaomi Door and Windows Sensor 2) contact sensor
- Added support for lumi.gateway.mgl03 (Xiaomi Gateway v3) gateway
- Added support for leshow.heater.bs1 (Mi Smart Baseboard Heater 1) heater
- Added support for viomi.heater.v4 (Viomi Kick-Line heater Pro2) heater. Thanks @gazer000 for the contribution
- Added support for lumi.curtain.agl001 (Xiaomi Curtain Driver E1) curtain
- Added support for lumi.curtain.hmcn02 (Xiaomi BLE Curtain Driver E1) curtain
- Added support for yeelink.light.ceilc (Yeelight Arwen) light
- Added room cleaning guide for roborock (and xiaomi) devices

### Fixed
- Fix a potential bug which could lead to wrong device identification


## [1.4.4] - 2022-11-29
### Added
- Added new Speaker module. Thanks @0x5e for the contribution
- Added support for xiaomi.wifispeaker.lx06 (Mi AI Speaker Pro) speaker. Thanks @0x5e for the contribution
- Added support for chunmi.pre_cooker.dylg5 (Mi Smart Pressure Cooker 5L) cooker
- Added support for dreame.vacuum.r2228o (Dreame L10s Ultra) robot cleaner


## [1.4.3] - 2022-11-06
### Fixed
- Fix MiCloud issues with the recent nodejs releases


## [1.4.2] - 2022-11-05
### Fixed
- Fix missing properties to monitor on some fans devices
- Fix a potential crash during device identification


## [1.4.1] - 2022-11-02
### Added
- Added support for isleep.blanket.hs2201 (Painted sleep water heating pad HS2201)
- Added support for dreame.fan.p2018 (Xiaomi Smart Purifying Fan) fan

### Changed
- Do not show a warning log when a cloud device is offline

### Fixed
- Fix tvoc density range calculation
- Fix property control when switching to fan
- Fix missing properties to monitor on blanket heater devices


## [1.4.0] - 2022-10-27

**With this update the connection logic to local and especially cloud device has been rewritten!**  
**Please note that there are some potential breaking changes in this update!**

### Breaking changes
- If specified, the deviceId is now used to generate the unique accessory uuid which is used by HomeKit, this might cause some devices to reset and require to be reconfigured within the Home app.

### Added
- Connection to mesh devices over a supported gateway is now possible
- The property control now accepts a new `config` parameter, which allows to configure the resulting accessory. Right now only `type` is available which allows to choose between a lightbulb or fan for a value range based property
- Added support for zhimi.airp.sa4 (Xiaomi Air Purifier 4 Max) air purifier
- Added support for roborock.vacuum.s6 (Roborock S6) robot cleaner
- Added support for dreame.vacuum.p2114a (Xiaomi Robot Vacuum X10+) robot cleaner
- Added support for deerma.humidifier.jsq2g (Mijia Smart Anti-bacterial Humidifier 2) humidifier
- Added support for zhimi.airpurifier.v3 (Xiaomi Mi Air Purifier) air purifier. Thanks @0x5e for the contribution
- Added support for 090615.switch.mesw2 (PTX Mesh intelligent two switch) switch. Thanks @0x5e for the contribution

### Changed
- MiCloud devices now use a pure cloud connection without connection to the device locally anymore if a deviceId is provided upfront
- Improvements to the miio protocol! Thanks @0x5e for the contribution

### Fixed
- Fixed missing properties monitoring for some services
- Convert tvoc value from mg/m3 to µg/m3 which is the unit reported by homekit
- Fix careli.fryer.maf02 device class


## [1.3.1] - 2022-09-15
### Added
- Property sync chunk size can now be changed per device
- Added new `propertyChunkSize` config property, which allows to reduce the number of properties which are requested from the device at once

### Changed
- Marked yeelink.bhf_light.v2 as MiCloud required
- Remove temperature property from chuangmi.plug.m3 as that seems to cause issues

### Fixed
- Minor fixes for certain air purifier devices


## [1.3.0] - 2022-09-05
### Added
- Added new device connection test cli command
- Added new `onlyMainService` config property, which allows to disable all accessory services but the main
- Added support for roidmi.vacuum.v66 (Roidmi Eva) robot cleaner
- Added support for dreame.vacuum.r2205 (Dreame Bot D10 Plus) robot cleaner
- Added support for dmaker.fan.1e (Mi Smart Standing Fan E) fan
- Added support for dmaker.derh.22l (Xiaomi Smart Dehumidifier 22L) dehumidifier
- Added support for viomi.vacuum.v7 (Viomi Vacuum v7) robot cleaner
- Added support for dreame.vacuum.p2148o (Xiaomi MIJIA Ultra-Thin Robot Vacuum STYTJ04ZHM) robot cleaner
- Added support for yeelink.bhf_light.v2 (Yeelight Smart Bathroom Heater)
- Added support for careli.fryer.maf07 (Mi Smart Air Fryer 3.5L) air fryer
- Added support for philips.light.candle (Xiaomi Philips Zhirui Candle Light Bulb - Scrub Version) light. Thanks @achrovisual for the contribution!
- Added support for zhimi.airp.cpa4 (Xiaomi Air Purifier 4 Compact) air purifier
- Added support for careli.fryer.maf01 (Mi Smart Air Fryer MAF01) air fryer

### Changed
- Air Fryer devices now have a dedicated module


## [1.2.4] - 2022-07-06
### Added
- Extended and improved the cli commands
- Added support for philips.light.zyceiling (Mi Philips Zhirui Ceilling Light) light
- Added support for dreame.vacuum.r2228 (Dreame S10) robot cleaner

### Fixed
- Fix missing two factor authentication url in homebridge ui


## [1.2.3] - 2022-06-10
### Added
- Added support for dmaker.fan.p220 (Mijia DC Inverter Circulating Floor Fan) fan

### Changed
- Increased default polling interval from 10s to 15s to reduce load on the devices
- Optimizations to the miot protocol

### Fixed
- Fixed properties retrieval from the Roborock s7 maxV Ultra
- Fix missing temperature on hanyi.airpurifier.kj550


## [1.2.2] - 2022-05-30
### Added
- Added support for dmaker.fan.p30 (Xiaomi Smart Standing Fan 2) fan
- Added support for dmaker.fan.p33 (Xiaomi Smart Standing Fan 2 Pro) fan

### Fixed
- Adjusted Airer devices to new spec
- Fix missing temperature on Mi Fresh Air Ventilator C1-80 (zhimi.airfresh.ua1)


## [1.2.1] - 2022-05-24
### Added
- Added support for zhimi.fan.sa1 (Mi Standing Fan) fan
- Added support for dreame.vacuum.p2027 (Dreame W10) robot cleaner


## [1.2.0] - 2022-05-20
### Added
- Added cooker device support
- Added support for chunmi.cooker.normalcd1 (Mi IH 3L Rice Cooker) cooker
- Added support for cuco.plug.cp3a (Gosund CP3-AM) outlet
- Added support for zhimi.airp.mp4 (Miija Air Purifier 4 Pro) air purifier
- Added support for cuco.plug.cp5pro (Gosund Smart Power Strip Pro) outlet
- Added support for roborock.vacuum.a27 (Roborock S7 MaxV Ultra) robot cleaner

### Changed
- Only necessary properties are now being monitored which should reduce the probability of timeouts
- Properties which are not writable are now skipped in `propertyControl`

### Fixed
- Fix properties monitoring in custom services
- Set temperature and humidity sensor to inactive when miot device is not connected


## [1.1.3] - 2022-04-16
### Fixed
- More spec parsing improvements


## [1.1.2] - 2022-04-15
### Fixed
- Additional parsing fix


## [1.1.1] - 2022-04-15
### Added
- Added support for roborock.vacuum.a01 (Roborock E4) robot cleaner
- Added support for zhimi.airp.rmb1 (Xiaomi Air Purifier 4 Lite) air purifier

### Fixed
- Fix automatic device identification
- Properties, action and events with id 0 are now properly parsed


## [1.1.0] - 2022-04-11
### Added
- Added support for qmi.powerstrip.v1 (Xiaomi Chingmi WiFi Smart Powerstrip) outlet
- Added support for zhimi.airp.mb3a (Xiaomi Mi Air Purifier 3H v2) air purifier
- Added support for cuco.light.sl4a (NiteBird SL4) light

### Changed
- Introduce custom services for better and cleaner device control

### Fixed
- Fixed an issue where some properties where detected as percentage, even if they were not
- Fixed an issue where outlets were displayed as switches


## [1.0.6] - 2022-03-09
### Added
- Added support for dreame.vacuum.p2259 (Dreame Bot D9 Max) robot cleaner
- Added support for dreame.vacuum.p2187 (Dreame D9 Pro) robot cleaner
- Added support for yeelink.light.lamp15 (Yeelight Led Screen Light Bar Pro) light

### Changed
- Marked the Roidmi Eve Plus as not MiCloud required


## [1.0.5] - 2022-02-21
### Added
- Added support for zhimi.airmonitor.v1 (Xiaomi PM2.5 Monitor) air monitor. Thanks @wojciej for the contribution!
- Added support for cubee.airrtc.th123e (Heatcold Heating Thermostat) thermostat
- Added support for zhimi.airpurifier.mc1 (Xiaomi Air Purifier 2S Global Version) air purifier

### Fixed
- Fix a possible infinite loop which might have occurred on some unknown devices


## [1.0.4] - 2022-02-12
### Added
- Added support for yeelink.light.colorc (Yeelight RGB LED Bulb) light
- Added support for zhimi.airp.mb5 (Xiaomi Mi Air Purifier 4) air purifier @blue2000hk for the contribution!
- Added support for hyd.airer.znlyj2 (MIJIA Smart Clothes Dryer 2) airer @blue2000hk for the contribution!
- Added support for philips.light.downlight (Xiaomi Mijia Philips Zhirui Downlight) light
- Added support for isleep.blanket.hs2205 (Painted sleep water heating pad HS2205) heater

### Changed
- Marked yeelink.light.strip6 as MiCloud required

### Fixed
- Fix param value 0 being ignored in actions


## [1.0.3] - 2022-02-06
### Changed
- Mark deerma.humidifier.jsq and deerma.humidifier.mjjsq as mi cloud required

### Fixed
- Fix retrieving actions by id
- Fix action parameters parsing


## [1.0.2] - 2022-02-04
### Added
- Added room cleaning guide for Viomi devices
- Added support for philips.light.candle2 (Xiaomi Philips Zhirui Candle Light Bulb) light
- Added support for zhimi.airfresh.va4 (Smartmi Fresh Air System XFXTDFR02ZM) fresh air system

### Changed
- Remove viomi.health_pot.v1 as it seems to be a read only device in the miot protocol

### Fixed
- Fix potential accessory reset during homebridge restart


## [1.0.1] - 2022-02-03
### Added
- Added support for zimi.powerstrip.v2 (Xiaomi Power Strip) outlet
- Added support for dreame.vacuum.p2150o (Mijia Robot Vacuum-Mop Dirt Disposal) robot cleaner

### Fixed
- Fix possible crash related to the pm10 density property
- Fix viomi.vacuum.v18 and viomi.vacuum.v19 stop clean actions
- Fix possible crash in the Kettle accessory
- Fix possible crash in BathHeater accessory


## [1.0.0] - 2022-02-02

**With this update the plugin is now completely rewritten and includes many new features and improvements. The miot spec is now actively used to determine the device type and fetch the device metadata if needed!**  
**Due to the many changes I expect that there might be some minor issues. If you find any issue then please let me know!**  
**Please note that there are some breaking changes in this update!**

### Breaking changes
- Node 16.x is now required, see below for details
- Some configuration properties got renamed, like `shutdownTimer` -> `offDelayControl`, please review your config if something is not working!
- Many device specific configuration properties are removed in favor of `propertyControl` and `propertyMonitor`. This gives a better flexibility and control over your accessories. Please use those instead.

### Added
- The plugin is now implementing its own miio protocol instead of depending on the external miio library which seems not to be maintained anymore
- The plugin now actively fetches and uses the miot spec for unknown devices to retrieve the device metadata and categorize the device
- New `propertyControl` configuration property which allows to expose any property of your device as a interactive service on your accessory
- New `propertyMonitor` configuration property which allows to expose any property of your device as a sensor(light sensor) on your accessory
- New `customAccessory` configuration property which allows to create a customized accessory for all supported and even unsupported devices
- New `childLockControl` configuration property which allows to hide the child lock service
- New global `micloud` configuration property which allows to specify the MiCloud credentials used by all devices
- Added cli commands
- Added new tools to Homebridge Ui to fetch get and view device metadata used for `propertyControl`, `propertyMonitor` and `actionButtons`
- Added support for air monitor devices
- Added support for ijai.vacuum.v3 (Mi Robot Vacuum-Mop 2 Pro) robot cleaner
- Added support for zhimi.airp.vb2a (Xiaomi Air Purifier Pro H v2) air purifier
- Added support for zhimi.airpurifier.m2 (Xiaomi Air Purifier 2) air purifier
- Added support for yeelink.light.strip6 (Yeelight Lightstrip Plus) light
- Added support for zhimi.airp.vb4 (Xiaomi Air Purifier Pro 4) air purifier
- Added support for viomi.vacuum.v8 (Xiaomi Robot Vacuum-Mop Pro) robot cleaner
- Added support for cgllc.airmonitor.b1 (Xiaomi Air Quality Monitor) air monitor
- Added support for cgllc.airm.cgdn1 (Qingping Air Monitor Lite) air monitor
- Added support for viomi.health_pot.v1 (Mijia Smart Multipurpose Wi-Fi Kettle) kettle
- Added support for yeelink.light.lamp22 (Xiaomi Mi Computer Monitor Light Bar 1S) light
- Added support for zhimi.humidifier.ca1 (Xiaomi Smartmi Evaporative Humidifier 2) humidifier
- Added support for hyd.airer.znlyj4 (Xiaomi Mijia Smart Clothes Dryer) airer
- Added support for yeelink.bhf_light.v1 (Yeelight Smart Bathroom Heater Pro) bath heater
- Added support for deerma.humidifier.mjjsq (Xiaomi Mijia Smart Sterilization Humidifier) humidifier
- Added support for deerma.humidifier.jsq (Xiaomi Mi Smart Antibacterial Humidifier) humidifier
- Added support for yeelink.light.mono6 (Yeelight Smart LED Bulb mono6) light
- Added support for zhimi.airp.mb4a (Xiaomi Mi Air Purifier 3C v2) air purifier
- Added support for yeelink.light.monob (Yeelight GU10 LED Smart Bulb W1) light
- Added support for leshow.humidifier.jsq1 (Xiaomi Mijia Pure Pro) humidifier

### Changed
- IMPORTANT! As Node.js 12.x will not be supported anymore by homebridge as of April 2022, the minimum required Node.js was bumped to 16.x, please make sure to update: https://github.com/homebridge/homebridge/wiki/How-To-Update-Node.js
- Changed viomi.waterheater.e8 (Viomi Water Heater) device type to bath heater
- Renamed `shutdownTimer` configuration property to `offDelayControl`
- Removed many device specific configuration fields
- MiCloud now uses an encrypted communication to the servers
- Device specific factories are now not needed anymore
- Increase default polling interval to 10 seconds as this seems to be enough
- Reorganized and cleaned up device classes
- Many more under the hood changes

### Fixed
- Fixed MiCloud two factor authentication which prevented a login even when the used successfully verified
- Properly show humidifier devices which do not support target humidity


## [0.9.19] - 2021-12-27

This update includes new devices added by some users. I appreciate any contribution and highly encourage anyone to add new devices.

### Added
- Added support for roborock.vacuum.s5 (Roborock S5) robot cleaner. Thanks @wojciej for the contribution!
- Added support for yeelink.light.color1 (Yeelight Smart LED Bulb 1) light. Thanks @mrking for the contribution!
- Added support for cuco.plug.sp5 (Gosund Smart Power Strip) outlet. Thanks @PietroLubini for the contribution!
- Added support for zhimi.airpurifier.m1 (Xiaomi Mi Air Purifier 2 Mini) air purifier. Thanks @mrking for the contribution!


## [0.9.18] - 2021-11-29
### Added
- Added support for roborock.vacuum.a29 (Roborock Vacuum G10) robot cleaner
- Added support for roidmi.vacuum.v6 (Roidmi Eve Plus) robot cleaner
- Added support for roborock.vacuum.a10 (Roborock S6 MaxV) robot cleaner
- Added support for ijai.vacuum.v2 (Mi Robot Vacuum-Mop 2) robot cleaner
- Added support for yeelink.light.mono4 (Yeelight 1S) light
- Added support for roborock.vacuum.s5e (Roborock S5 MAX) robot cleaner
- Added support for leshow.heater.bs3 (Mi Smart Baseboard Heater 3) heater
- Added support for dreame.vacuum.mb1808 (Mi Robot Vacuum-Mop) robot cleaner
- Added support for chuangmi.plug.hmi208 (Xiaomi Mijia Smart Wi-fi Plug) outlet
- Added support for philips.light.ceiling (Xiaomi Philips LED Ceiling Light) light
- Added support for zhimi.fan.v3 (Smartmi Standing Fan V3) fan
- Added support for babai.switch.bb101s (WiFi Wall Switch A1) switch
- Added support for viomi.vacuum.v19 (Viomi Robot Vacuum SE) robot cleaner
- Added support for roborock.vacuum.a08 (Roborock S6 Pure) robot cleaner
- Added support for viomi.waterheater.e8 (Viomi Water Heater) kettle
- Added support for yeelink.light.bslamp1 (Xiaomi Mi Bedside Lamp) light
- Added support for zhimi.humidifier.cb1 (Smartmi Air Humidifier 2) humidifier
- Added support for lumi.acpartner.mcn04 (Mi Smart Air Conditioner Controller Pro)  air conditioner

### Changed
- The zhimi.airpurifier.sb1 air purifier is now marked as MiCloud required
- Some code cleanup. Thanks @JohnHom1024 for the contribution!


## [0.9.17] - 2021-11-02
### Added
- Light devices can now control color if supported
- Added support for leshow.heater.bs1s (Mi Smart Baseboard Heater 1S). Thanks @saurikCornel for the contribution!
- Added support for yeelink.light.strip4 (Yeelight Willow LED Lightstrip) light
- Added support for viomi.vacuum.v18 (Viomi Robot Vacuum S9) robot cleaner
- Added support lumi.acpartner.v2 (Xiaomi Air Conditioning Companion) air conditioner
- Added support lumi.acpartner.v3 (Aqara Air Conditioning Companion) air conditioner
- Added support for zhimi.airpurifier.sb1 (Xiaomi Mi Air Purifier MAX) air purifier
- Added support for yeelink.light.color5 (Xiaomi Mi Smart LED Bulb Essential MJDPL01YL) light
- Added support for yeelink.light.color4 (Yeelight Smart LED Bulb 1S) light
- Added support for yeelink.light.color2 (Yeelight Smart LED Bulb 2) light
- Added support for cuco.plug.cp1m (Gosund Smart Plug CP1-AM) outlet

### Changed
- Temperature reporting on outlet devices can now be disabled

### Fixed
- Fix fan level emulation on some devices


## [0.9.16] - 2021-10-14
### Added
- Added support for switch devices
- Added support for yeelink.switch.sw1 (Yeelight Smart Dual Control Module) switch
- Added support for Added support for zhimi.airfresh.va2 (Smartmi Fresh Air System XFXT01ZM) fresh air system
- Added support for chuangmi.plug.v1 (Xiaomi Chuangmi Plug V1) outlet
- Added support for chuangmi.plug.v3 (Xiaomi Chuangmi Plug V3) outlet
- Added support for chuangmi.plug.m1 (Xiaomi Chuangmi Plug M1) outlet
- Added support for zhimi.airpurifier.v6 (Xiaomi Mi Air Purifier Pro V6) air purifier
- Added support for chuangmi.plug.hmi206 (Xiaomi Smart Plug 3680w) outlet
- Added support for yeelink.light.lamp1 (Xiaomi Mi Desk Lamp) light
- Added support for cuco.plug.cp2a (Gosund CP2-AM) outlet
- Added support for careli.fryer.maf02 (Mi Smart Air Fryer) air fryer

### Changed
- Removed the temperature property from chuangmi.plug.m3 outlet
- Some under the hood improvements

### Fixed
- Fixed calculation of fan speed on devices which emulate stepless fan speed


## [0.9.15] - 2021-10-02
### Added
- Added support for chuangmi.plug.m3 (Xiaomi Chuangmi Plug M3) outlet

### Changed
- The yunmi.kettle.r3 is now marked as MiCloud required


## [0.9.14] - 2021-09-23
### Fixed
- Fixed config.schema.json


## [0.9.13] - 2021-09-22
### Added
- Added support for kettle devices
- Added support for thermostat devices
- Added support for yunmi.kettle.r3 (Yunmi Kettle) kettle
- Added support for cubee.airrtc.th123w (Heatcold UFH Thermostat) thermostat
- Added support for lumi.curtain.hagl08 (Aqara Curtain Controller A1) curtain
- Added support for cuco.plug.co1 (Gosund Smart Wall Plug). Thanks @seanzhang98 for the contribution!


## [0.9.12] - 2021-09-06
### Added
- Added support for philips.light.bulb (Xiaomi Philips Smart LED) light

### Fixed
- Fixed some typos in the changelog and supported devices list


## [0.9.11] - 2021-09-05
### Added
- Added support for bath heater devices
- Added support for dreame.vacuum.p2140 (Mijia Robot Vacuum-Mop 2C) robot cleaner
- Added support for yeelink.bhf_light.v5 (Mi Smart Bathroom Heater Pro) bath heater
- Added support for dreame.vacuum.p2157 (MOVA L600) robot cleaner
- Custom UI to automatically extract device tokens from MiCloud! Thanks @nVuln for the contribution!

### Changed
- Some improvements to the oven accessory
- Improved the humidifier accessory
- Increase default polling interval to 7 seconds
- Organized project structure

### Fixed
- Fixed deerma.humidifier.jsq4 property mapping


## [0.9.10] - 2021-08-20
### Added
- Added support for hanyi.airpurifier.kj550 (MiWhole Air Purifier Mix) air purifier
- Added support for dreame.vacuum.p2029 (Dreame Bot L10 Pro) robot cleaner

### Changed
- Some improvements to the oven accessory


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
