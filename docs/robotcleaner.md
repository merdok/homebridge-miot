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
  - second parameter `1` indicates the number of cleaning times
  - third parameter `1` indicates the vacuum power - see the `vacuum:mode` property in the device metadata to see all available power modes
  - fourth parameter `2` indicates the mopping mode - see the `vacuum-extend:mop-mode` property in the device metadata to see all available mop modes
  - fifth parameter `1` indicates the index of the cleaning. If you have multiple rooms specified this will define the order in what rooms are cleaned

#### Dreame.vacuum.mc1808/dreame.vacuum.mb1808
As one of the first models with room cleaning feature these devices don't support `vacuum-extend` **actions** and use `clean:start-clean` action with additional **params**. The `actionButtons` entry would look as follow:

```js
"actionButtons": [
    {
        "action": "18.1",
        "name": "Clean first room",
        "params": [
            {
                "piid": 1,
                "value": 18
            },
            {
                "piid": 21,
                "value": "{\"selects\":[[1,1,1,1,1]]}"
            }
        ]
    }
]
```

#### Some other dreame devices (e.g. Xiaomi Robot Vacuum X10+) separate the room configuration/selection
If the above `actionButtons` doens't work for your robot, you maybe have a device which needs the actions for the room configuration and the actual room selection in 2 separate commands.
Setting the room configuration would look as follow:

```js
"actionButtons": [
    {
        "action": "6.2",
        "name": "Room 3 only sweeping",
        "params": [
            {
                "piid": 4,
                "value": "{\"customeClean\":[[3,1,2,1,0]]}"
            }
        ]
    },
    {
        "action": "6.2",
        "name": "Room 1 and 2 sweeping and mopping",
        "params": [
            {
                "piid": 4,
                "value": "{\"customeClean\":[[1,1,2,1,2],[2,1,2,1,2]]}"
            }
        ]
    }
]
```
The **action** can be either _6.2_ or _map:update-map_  
As for the **params**:  
- The `"{\"customeClean\":[[3,1,2,1,0]]}"` entry sets the configuration for the rooms and the **customeClean** values can be split as follow:  
  - first parameter `3` indicates the room id - this are usually relatively low and if you do not know the room id you can try to guess by incrementing that number
  - second parameter `1` indicates the vacuum power - see the `vacuum:mode` property in the device metadata to see all available power modes
  - third parameter `2` indicates the mopping mode - for the X10+ the values are 2 = Low, 3 = Medium and 4 = High. For this device it's always 1 more than in the `vacuum-extend:mop-mode` property in the device metadata - maybe this is also the case for other devices
  - fourth parameter `1` indicates the number of cleaning times - 1 or 2
  - fifth parameter `0` indicates the cleaning mode. 0 = sweeping, 1 = mopping and 2 = sweeping and mopping

Starting the actual room cleaning would look as follow:

```js
"actionButtons": [
    {
        "action": "4.1",
        "name": "Clean room 1",
        "params": [
            {
                "piid": 1,
                "value": 18
            },
            {
                "piid": 10,
                "value": "{\"selects\":[[1,1,1,1,1]]}"
            }
        ]
    },
    {
        "action": "4.1",
        "name": "Clean rooms 2 and 4",
        "params": [
            {
                "piid": 1,
                "value": 18
            },
            {
                "piid": 10,
                "value": "{\"selects\":[[2,1,1,1,1],[4,1,1,1,1]]}"
            }
        ]
    }
]
```
The **action** can be either _4.1_ or _vacuum-extend:start-clean_  
As for the **params**:  
- The `{"piid": 1,"value": 18}` entry indicated a room clean
- The `"{\"selects\":[[2,1,1,1,1],[4,1,1,1,1]]}"` entry decides which room should cleaned. It's just the room ID followed by `1,1,1,1`

#### Getting room ids

##### Easy way
To get the rooms ids you will need to use the miot cli tools to send a request to the vacuum which will then return the room id.
1. Using the Mi home app create a room cleaning schedule for the room for which you want to retrieve the room id
2. In the terminal on the device where homebridge is installed run the following command:
Simply in the terminal on the device where homebridge is installed type the following command:

`miot send <IP> -t <TOKEN> get_properties '[{"siid":8,"piid":2}]'`

This will output a list which looks similar to this:

`"1-1-14:36-0000000-0-2-1-2-3"`

3. The last number in that value `3` represents the room id. Simply use that room id in the param of your `actionButtons` entry.

##### Alternative way
As an alternative way it is possible to retrieve the room ids by following the steps:
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

---------------
#### ijai (Mi Robot Vacuum-Mop 2 Pro)
#### Example room cleaning config and parameters description

For **ijai** based devices the `actionButtons` entry would look as follows (MiCloud connection details should be configured):

```js
"actionButtons": [
  {
      "action": "sweep:set-room-clean",
      "name": "Clean kitchen",
      "params": [
        "8",
           0,
           1
      ]
  },
  {
      "action": "sweep:set-room-clean",
      "name": "Clean multiply rooms",
      "params": [
          "6,7,8,9",
          0,
          1
      ]
  }
]
```
As for the **params**:
- The `0` (`0` - global cleaning; `1` - along the edge) and `1` (`0` - stop; `1` - start; `2` - pause) are related to the vacuum operation and from my experience they should be left at that values. 
- `"8"` is the room id of the room which should cleaned. The ids start from the specific number (which can be obtained by executing commands bellow), so you can easily guess them by incrementing the number and checking to which room the vacuum goes. For multiple rooms simply separate the room ids with a comma like this `"6,7,8,9"`.

1. `miot cloud action '{"aiid":13,"did":"YOUR_DEVICE_ID","in":[YOU_CURRENT_MAP_ID],"siid":10}'`
2. `YOU_CURRENT_MAP_ID` is `miot cloud action '{"aiid":1,"did":"YOUR_DEVICE_ID","in":[],"siid":10}'`
---------------
#### Roborock
#### Example room cleaning config and parameters description

For **roborock** based devices the `actionButtons` entry would look as follow:

```js
"actionButtons": [
  {
      "action": "vacuum:start-room-sweep",
      "name": "Clean kitchen",
      "params": [
          "80001023333"
      ]
  },
  {
    "action": "vacuum:start-room-sweep",
    "name": "Clean multiply rooms",
    "params": [
        "80001023333, 80001023332, 80001023334"
    ]
  }
]
```
The **action** can be either _2.3_ (_2.6_ on other devices) or simply _vacuum:start-room-sweep_  
As for the **params**:  
- The action accepts one parameter which is a string with a single or multiply room ids (separated by commas) indicating which rooms should be cleaned

#### Getting room ids

To get the rooms ids you will need to use the miot cli tools to send a request to the vacuum which will then return the room ids.
Simply in the terminal on the device where homebridge is installed run the following command:

`miot send <IP> -t <TOKEN> get_room_mapping '[]'`

This will output a list which looks similar to this:

```js
[[6,"80001026443",2],
[7,"80001057044",3],
[8,"80001057045",4],
[9,"80001057046",4],
[10,"80001057047",5]
```

The longer middle number is the room id. You would need to start a couple of manual cleans to see which room id corresponds to which room.
Afterwards simply use that room id in the param of your `actionButtons` entry.

#### Setting mode

For the room clean the vacuum will use the last selected mode.

### Methods for miot cli
#### Roborock
Here are some helpful methods for **roborock** device which can be executed using the miot cli tools.  
Not all of the methods might work on every device.

- **app_start**
- **app_stop**
- **app_spot**
- **app_pause**
- **app_charge**
- **app_zoned_clean**
- **resume_zoned_clean**
- **app_rc_start**
- **app_rc_end**
- **reset_consumable**
- **find_me**
- **test_sound_volume**
- **stop_zoned_clean**
- **stop_segment_clean**
- **resume_segment_clean**
- **get_room_mapping**
- **get_serial_number**
- **get_map**
- **get_map_v1**
- **get_map_v2**
- **get_consumable**
- **get_current_sound**
- **get_customize_clean_mode**
- **get_clean_sequence**
- **get_multi_maps_list**
- **app_segment_clean** , example params -> `[{"clean_mop":0,"segments":[11],"repeat":1,"clean_order_mode":0}]`
- **get_timezone**
- **app_stat**
- **get_mop_template_params_summary**
- **get_server_timer**
- **set_fds_endpoint** , example params -> `["awsde0.fds.api.xiaomi.com"]`
- **enable_log_upload** , example params -> `[9,3]`
- **set_mop_mode** , example params -> `[300]`
- **set_water_box_custom_mode** , example params -> `[201]`
- **set_clean_motor_mode** , example params -> `[{"fan_power":105,"water_box_mode":201,"mop_mode":300}]`
- **set_app_timezone** , example params -> `["Europe\/Warsaw",0]`
- **set_custom_mode** , example params -> `[102]`
- **set_camera_status**
- **set_ignore_carpet_zone**
- **set_clean_sequence**
- **set_homesec_password**
- **set_child_lock_status**
- **set_carpet_clean_mode**
- **set_ignore_identify_area**
- **set_dust_collection_switch_status**
- **set_map_beautification_status**
- **set_fan_motor_work_timeout**
- **set_mop_motor_status**
- **set_collision_avoid_status**
- **set_flow_led_status**
- **set_dust_collection_mode**
- **set_timer**
- **set_dnd_timer**
- **set_timezone**
- **set_carpet_mode**
- **set_lab_status**
- **set_server_timer**
- **set_led_status**
- **set_customize_clean_mode**
- **set_airdry_hours**
- **set_timer_dup**
- **set_map_name**
- **set_multi_map_timer_different_map_tip**
- **set_multi_map_timer_switch_different_map_tip**
- **set_multi_map_timer_different_map_save_tip**
- **get_clean_motor_mode**
- **get_camera_status**
- **get_timer_summary**
- **get_timer_detail**
- **get_testid**
- **get_turn_server**
- **get_device_sdp**
- **get_device_ice**
- **get_homesec_connect_status**
- **get_child_lock_status**
- **get_carpet_clean_mode**
- **get_random_pkey**
- **get_dust_collection_switch_status**
- **get_map_beautification_status**
- **get_fan_motor_work_timeout**
- **get_mop_motor_status**
- **get_sound_progress**
- **get_sound_volume**
- **get_collision_avoid_status**
- **get_flow_led_status**
- **get_dust_collection_mode**
- **get_photo**
- **get_multi_map**
- **get_prop**
- **get_status**
- **get_custom_mode**
- **get_water_box_custom_mode**
- **get_clean_summary**
- **get_clean_record**
- **get_clean_record_map**
- **get_clean_record_map_v2**
- **get_timer**
- **get_dnd_timer**
- **get_log_upload_status**
- **get_carpet_mode**
- **get_fw_features**
- **get_fresh_map**
- **get_persist_map**
- **get_recover_maps**
- **get_recover_map**
- **get_map_status**
- **get_segment_status**
- **get_network_info**
- **get_led_status**
