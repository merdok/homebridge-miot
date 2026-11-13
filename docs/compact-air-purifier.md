# Xiaomi Smart Air Purifier 4 Compact

The dedicated `xiaomi.airp.cpa4` definition uses the bundled `xiaomi-cpa4:2`
MIoT specification. This is a different model from `zhimi.airp.cpa4`; its
property names and filter-reset action are not interchangeable. It works with
the plugin's existing local or cloud connection configuration.

## Apple Home controls

- The existing purifier is the primary service: power, Auto/Manual, fan speed,
  physical-control lock, and filter life.
- Fifteen manual levels map to 7–100% on the native slider. A zero-speed command
  turns the unit off while retaining its manual level. A positive-speed command
  sets the level, chooses Manual/Favorite, and turns it on, in that order.
- In Auto or Sleep, the displayed speed is measured RPM divided by the advertised
  2500 RPM maximum. This is a rotation-speed estimate, not an airflow measurement.
- **Sleep** replaces the three mode switches. On selects Sleep and powers on;
  off returns to Auto only when currently in Sleep. Its original service subtype
  is preserved.
- **Display** replaces the three brightness switches. It restores the last
  nonzero brightness observed during the current bridge session, defaulting to
  Dim after a restart if the display is off. Brightness can still be selected in
  Xiaomi Home. This remains a switch so it does not join Siri's room lighting.
- **Buzzer** remains an optional switch with its original subtype.
- `modeControl`, `screenControl`, `buzzerControl`, and `childLockControl` retain
  their enable/disable roles. No configuration changes are required for this model.
- Native air-quality and filter-maintenance services are linked to the purifier.
  Filter reset is exposed as the standard write-only maintenance characteristic,
  never as a reset switch. Its appearance depends on the HomeKit client.

The Auto/Favorite switches and old three brightness switches are retired.
Automations targeting those removed switches need to use the native mode control
or the new Display switch. The purifier, Sleep, Buzzer, air-quality and filter
service identities remain stable.

## State, faults and diagnostics

Motor RPM determines whether an active unit is idle or purifying. A motor-stuck
fault reports idle and logs a warning; a sensor-lost fault marks air quality as
unknown, sets the sensor fault flag, and invalidates the PM2.5 reading. Reads report
No Response when disconnected or before initial device data arrives. Control
errors propagate to HomeKit instead of being silently swallowed. All control
writes are serialized, including multi-step speed changes.
Explicit commands always reach the purifier: writing its saved manual level
implicitly changes its mode, so cached equality must not suppress a later
Auto request. Verification restores the manual level while powered off, then
the original mode, and finally the original power state.

The model polls 12 relevant properties in batches of three. Its MIoT definition
retains filter percentages, used hours, remaining **days**, raw RPM and device
fault codes. Home has no standard UI fields for
raw RPM, used hours or days remaining; no unrelated sensor types are substituted.
No region settings, factory/debug counters, or heartbeat controls are exposed.

The spec is bundled so creating these accessories requires no online metadata
lookup. The implementation follows Apple's [air purifier and linked-service
definitions](https://github.com/apple/HomeKitADK/blob/master/HAP/HAPServiceTypes.h).

Tests exercise actual Homebridge HAP classes, all manual speed levels, service
identities, linking, Sleep/Display controls, filter-reset routing with a mock,
offline/error handling, fault recovery, and concurrent control writes. Live
verification must not invoke filter reset or alter filter/debug counters.
