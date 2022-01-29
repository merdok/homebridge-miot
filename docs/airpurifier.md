## Air Purifier

### Air Purifier specific configuration fields
- `screenControl` [optional]
Whether the screen service is enabled. This allows to turn on/off the device screen and control brightness. **Default: true**
- `fanLevelControl` [optional]
Show fan level switches which allow to change the fan level. **Default: true**
- `ioniserControl` [optional]
Show a switch which allows to quickly enable/disable the ioniser on your fan. **Default: false**
- `pm25Breakpoints` [optional]
Define a custom array of pm25 breakpoints. Provide an array with exactly 4 unique numbers. **Default: [7, 15, 30, 55]**
