## Fan

### Fan specific configuration fields
- `swingControl` [optional]
Show a switch to quickly enable/disable horizontal and/or vertical swing mode. **Default: false**
- `moveControl` [optional]
Whether the move control service is enabled. This allows to move the fan in 5° to the left, right, up or down. **Default: false**
- `fanLevelControl` [optional]
Show fan level switches which allow to change the fan level. **Default: false**
- `ioniserControl` [optional]
Show a switch which allows to quickly enable/disable the ioniser on your fan. **Default: false**
- `offDelayControl` [optional]
Show a slider (as light bulb) which allows to set a shutdown timer in minutes. **Default: false**
- `horizontalAngleButtons` [optional]
Whether the angle buttons service is enabled. This allows to create buttons which can change between different horizontal oscillation angles. **Default: "" (disabled)**
  - Set an array of numeric values. Possible values depend on the fan model
  - Some fans support predefined angle buttons, in the case the specified angles are ignored and the supported angle buttons are retrieved from the fan and displayed as switches
  - Tapping the active oscillation angle button will disable oscillation completely
- `verticalAngleButtons` [optional]
Same as above but for vertical oscillation angles. **Default: "" (disabled)**
