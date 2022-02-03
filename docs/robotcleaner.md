## Robot Cleaner

### Robot Cleaner specific configuration fields
- none

### Room cleaning

The plugin allows you to create switches to start specific room cleaning. For that you need to use `actionButtons`. The process on how to create those switches might slightly differ depending on what device you use.

---------------
#### Dreame
#### Example room cleaning config and parameters description

For **dreame** based devices the `actionButtons` entry would look as follow:

```js
"actionButtons": [
  {
    "action": "4.1",
    "name": "Clean kitchen",
    "params": [
      "{\"selects\":[[3,1,1,2,1]]}",
      {
        "piid": 1,
        "value": 18
      }
    ]
  },
  {
    "action": "4.1",
    "name": "Clean two rooms",
    "params": [
      "{\"selects\":[[3,1,1,2,1],[5,1,1,2,2]]}",
      {
        "piid": 1,
        "value": 18
      }
    ]
  }
]
```
The **action** can be either _4.1_ or _vacuum-extend:start-clean_  
As for the **params**:  
- The `{"piid": 1,"value": 18}` entry indicated a room clean
- The `"{\"selects\":[[3,1,1,2,1]]}"` entry decides which room should cleaned, with what mode and what order, the values can be **selects** can be split as follow:  
  - first parameter `3` indicated the room id - this are usually relatively low and if you do not know the room id you can try to guess by incrementing that number
  - second parameter `1` indicated the number of cleaning times
  - third parameter `1` indicated the vacuum power - see the `vacuum:mode` property in the device metadata to see all available power modes
  - fourth parameter `2` indicated the mopping mode - see the `vacuum-extend:mop-mode` property in the device metadata to see all available mop modes
  - fifth parameter `1` indicated the index of the cleaning. If you have multiple rooms specified this will define the order in what rooms are cleaned

#### Getting room ids

For **dreame** based devices it is possible to retrieve the room ids by following the steps:
1. Using the Mi home app create a room cleaning schedule for the room for which you want to retrieve the room id
2. Create a new `propertyMonitor` in the plugin which should look like this:

```js
"propertyMonitor": [
  {
    "property": "8.2", or ("time:timer-clean")
    "name": "Get clean schedule"
  }
]
```

3. Restart the plugin and observe the homebridge log. A similar entry to this should appear:  
`<-W-> Monitored string property Timer Clean value changed to ---> "1-1-14:36-0000000-0-2-1-2-3"`
4. The last number in that value `3` represents the room id.
5. You can now remove the `propertyMonitor` entry and the Mi home cleaning schedule and create an `actionButtons` entry


---------------
#### Viomi
#### Example room cleaning config and parameters description

For **viomi** based devices the `actionButtons` entry would look as follow:

```js
"actionButtons": [
  {
      "action": "4.13",
      "name": "Clean kitchen",
      "params": [
          0,
          1,
          "8"
      ]
  },
  {
      "action": "4.13",
      "name": "Clean multiply rooms",
      "params": [
          0,
          1,
          "6,7,8,9"
      ]
  }
]
```
The **action** can be either _4.13_ or _viomi-vacuum:set-room-clean_  
As for the **params**:  
- The `0` and `1` are related to the vacuum operation and from my experience they should be left at that values
- `"8"` is the room id of the room which should cleaned. The ids start from 1, so you can easily guess them by incrementing the number and checking to which room the vacuum goes. For multiple rooms simply separate the room ids with a comma like this `"6,7,8,9"`, the vacuum should clean the rooms in the specified order.

#### Setting mode

For the room clean the vacuum will use the last selected mode. With the following `propertyControl` you can expose the mode change functionality on the accessory in HomeKit:

```js
"propertyControl": [
    {
        "property": "vacuum:wdr-mode",
        "name": "Mode"
    }
]
```
After that you should get 3 additional switches which will allow you to set the vacuum mode (sweep, mop, clean). They might be labeled just as numbers in that case the numbers corresponds to the following modes:
- 0 -clean
- 1 - sweep
- 2 - mop
