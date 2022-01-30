## Robot Cleaner

### Robot Cleaner specific configuration fields
- none

### Room cleaning

The plugin allows you to create switches to start specific room cleaning. For that you need to use `actionButtons`. The process on how to create those switches might slightly differ depending on what device you use.

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
  - first parameter `3` indicated the room id - this are usually relativley low and if you do not know the room id you can try to guess by incrementing that number
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

3. Restart the plugin and observe the homebridge log. A similiar entry to this should appear:  
`<-W-> Monitored string property Timer Clean value changed to ---> "1-1-14:36-0000000-0-2-1-2-3"`
4. The last number in that value `3` represents the room id.
5. You can now remove the `propertyMonitor` entry and the Mi home cleaning schedule and create an `actionButtons` entry
