# Obtain Mi Home device token
Use any of these methods to obtain the device token for the supported miio devices.

## Method 1 - Obtain device token from Mi home account
[Windows app, MAC OS app](https://github.com/Maxmudjon/Get_MiHome_devices_token/releases)


## Method 2 - Obtain device token for miio devices that hide their token after setup
Use one of these methods to obtain the device token for devices that hide their tokens after setup in the Mi Home App (like the Mi Robot Vacuum Cleaner with firmware 3.3.9_003077 or higher). This is usually the case for most Mi Home devices. The latest versions of the Mi Home smartphone app dont hold the token anymore so before you begin with any of these methods you will need to install an older version of the smartphone app. Version 5.0.19 works for sure with the 1st gen Vacuum Robot, for the 2nd gen (S50) you should try version 3.3.9_5.0.30. Android users can find older version of the app [here](https://www.apkmirror.com/apk/xiaomi-inc/mihome/).

### Android users
#### Rooted Android Phones
* Setup your Android device with the Mi Home app version 5.0.19 or lower
* Install [aSQLiteManager](https://play.google.com/store/apps/details?id=dk.andsen.asqlitemanager) on your phone
* Use a file browser with granted root privilege and browse to /data/data/com.xiaomi.smarthome/databases/
* Copy miio2.db to an accessable location
* Open your copy of miio2.db with aSQLiteManager and execute the query "select token from devicerecord where localIP is '192.168.0.1'" where you replace the IP address with the IP address of the device you want to get the token from. It will show you the 32 character device token for your Mi Home device.

#### Non-Rooted Android Phones
##### Extract token from log file
This method will only work when you install the Mi Home app version v5.4.54. You can find it [here](https://android-apk.org/com.xiaomi.smarthome/43397902-mi-home/). It looks like Xiaomi made a mistake in this app version where the log file written to internal memory exposes the device tokens of your Xiaomi miio devices.
* Setup your Android device with the Mi Home app version 5.4.54
* Log in with you Xiaomi account
* Use a file explorer to navigate to /sdcard/SmartHome/logs/Plug_Devicemanager/
* Look for a log file named yyyy-mm-dd.txt and open it with a file editor
* Search for a string similar to this with you device name and token
```
{"did":"117383849","token":"90557f1373xxxxxxx8314a74d547b5","longitude":"x","latitude":"y","name":"Mi Robot Vacuum","pid":"0","localip":"192.168.88.68","mac":"40:31:3C:AA:BB:CC","ssid":"Your AP Name","bssid":"E4:8D:8C:EE:FF:GG","parent_id":"","parent_model":"","show_mode":1,"model":"rockrobo.vacuum.v1","adminFlag":1,"shareFlag":0,"permitLevel":16,"isOnline":true,"desc":"Zoned cleanup","extra":{"isSetPincode":0,"fw_version":"3.3.9_003460","needVerifyCode":0,"isPasswordEncrypt":0},"event":{"event.back_to_dock":"{\"timestamp\":1548817566,\"value\":[0]}
```
* Copy the token from this string and you are done.

##### Extract token from a backup on Android phones that allow non-encrypted backups
* Setup your Android device with the Mi Home app
* Enable developer mode and USB debugging on your phone and connect it to your computer
* Get the ADB tool
   - for Windows: https://developer.android.com/studio/releases/platform-tools.html
   - for Mac: `brew install adb`
* Create a backup of the Mi Home app:
   - for Windows: `.\adb backup -noapk com.xiaomi.smarthome -f mi-home-backup.ab`
   - for Mac: `adb backup -noapk com.xiaomi.smarthome -f mi-home-backup.ab`
* On your phone you must confirm the backup. Do not enter any password and press button to make the backup
* (Windows Only) Get ADB Backup Extractor and install it: https://sourceforge.net/projects/adbextractor/
* Extract all files from the backup on your computer:
   - for Windows: `java.exe -jar ../android-backup-extractor/abe.jar unpack mi-home-backup.ab backup.tar`
   - for Mac & Unix: `( printf "\x1f\x8b\x08\x00\x00\x00\x00\x00" ; tail -c +25 mi-home-backup.ab) |  tar xfvz -`
* Unzip the ".tar" file
* Open /com.xiaomi.smarthome/db/miio2.db with a SQLite browser (for instance http://sqlitebrowser.org/)
* Execute the query "select token from devicerecord where localIP is '192.168.0.1'" where you replace the IP address with the IP address of the Mi Home device you want to get the token from. It will show you the 32 character device token for your Mi Home device.

##### Extract token from a backup on Android phones that do not allow non-encrypted backups
* Use the steps from above but install Java and use [backup extractor](https://github.com/nelenkov/android-backup-extractor) to extract the encrypted backup.
```
$ java -jar abe-all.jar unpack mi-home-backup.ab unpack mi-home-backup.tar
This backup is encrypted, please provide the password
Password:

# extract without header trick
$ tar -zxf mi-home-backup.tar

# db file is accessible
$ ls apps/com.xiaomi.smarthome/db/
geofencing.db				google_app_measurement.db		miio.db					miio2.db				mistat.db
geofencing.db-journal			google_app_measurement.db-journal	miio.db-journal				miio2.db-journal			mistat.db-journal
```

### iOS users
### Non-Jailbroken iOS users
* Setup your iOS device with the Mi Home app
* Create an unencrypted backup of your iOS device on your computer using iTunes. In case you are unable to disable encryption you probably have a profile preventing this that enforces certain security policies (like work related accounts). Delete these profiles or use another iOS device to continu.
* Install iBackup Viewer from [here](http://www.imactools.com/iphonebackupviewer/) (another tool that was suggested can be found [here](https://github.com/richinfante/iphonebackuptools)).
* Navigate to your BACKUPS and find the name of your iOS device in the list. Open this backup by clicking the triangle in front of it and then click on raw data.
* Sort the view by name and find the folder com.xiaomi.mihome and highlight it (it's somewhere at the end). After highlighting it click on the cockwheel above the results and select "Save selected files" from here and choose a location to save the files.
* Navigate to the com.xiaomi.mihome folder which you just saved somewhere and inside this folder navigate to the /Documents/ subfolder. In this folder there is a file named <userid>_mihome.sqlite where your userid is specific for your account.
* Open this file with a SQLite browser (for instance http://sqlitebrowser.org/)
* Execute the query "select ZTOKEN from ZDEVICE where ZLOCALIP is '192.168.0.1'" where you replace the IP address with the IP address of the Mi Home device you want to get the token from. It will show you the 32 character device token for your Mi Home device.
* The latest Mi Home app store the tokens encrypted into a 96 character key and require an extra step to decode this into the actual token. Visit [this](http://aes.online-domain-tools.com/) website and enter the details as shown below:
** __Input type:__ text
    * __Input text (hex):__ your 96 character key
    * __Selectbox Plaintext / Hex:__ Hex
    * __Function:__ AES
    * __Mode:__ ECB
    * __Key (hex):__ 00000000000000000000000000000000
    * __Selectbox Plaintext / Hex:__ Hex
* Hit the decrypt button. Your token are the first two lines of the right block of code. These two lines should contain a token of 32 characters and should be the correct token for your device.
* If this tutorial did not work for you, [here](https://github.com/mediter/miio/blob/master/docs/ios-token-without-reset.md) is another that might work.

## Jailbroken iOS users
* Setup your iOS device with the Mi Home app
* Use something like Forklift sFTP to connect to your iOS device and copy this file to your computer: /var/mobile/Containers/Data/Application/[UUID]/Documents/USERID_mihome.sqlite (where UUID is a specific number for your device)
    * username: root
    * IP address: your phones IP address
    * password: alpine (unless you changed it something else)
* Open this file with a SQLite browser (for instance http://sqlitebrowser.org/)
* Execute the query "select ZTOKEN from ZDEVICE where ZLOCALIP is '192.168.0.1'" where you replace the IP address with the IP address of the Mi Home device you want to get the token from. It will show you the 32 character device token for your Mi Home device.
* The latest Mi Home app store the tokens encrypted into a 96 character key and require an extra step to decode this into the actual token. Visit [this](http://aes.online-domain-tools.com/) website and enter the details as shown below:
    * __Input type:__ text
    * __Input text (hex):__ your 96 character key
    * __Selectbox Plaintext / Hex:__ Hex
    * __Function:__ AES
    * __Mode:__ ECB
    * __Key (hex):__ 00000000000000000000000000000000
    * __Selectbox Plaintext / Hex:__ Hex
* Hit the decrypt button. Your token are the first two lines of the right block of code. These two lines should contain a token of 32 characters and should be the correct token for your device.

## Method 3 - Obtain Xiaomi Gateway device token
This method is specifically for the Xiaomi Gateway.

* Open Mi Home App in your Android device.
* Select your xiaomi device.
* Then click on the 3 dots at the top right of the screen.
* Then click on "About".
* Tap on the version number at the bottom of the screen repeatedly.
* You should see now 2 extra options listed.
* Tap on the second option: "Hub info".
* There you can find the device token.

## Method 4 - Nodejs Command Line Tool from the miIO Device library
The author of the miIO Device Library which is used by this Homey app has also created a nodejs command line tool for retrieving device tokens. Please follow the steps in [these instructions](https://github.com/aholstenson/miio/blob/master/docs/management.md) to retrieve the token for the supported miio devices. Be aware that some devices hide their token after the device has been setup in the Mi Home app. Retrieving tokens for these devices will not work with this method but require method 3.

## Method 5a - Packet Sender Tool
During setup of Mi Home devices the device tokens an be retrieved by sending a ping command to the device. This method uses a tool called Packet Sender which you will need to download. Choose the portable version which does not require installation.
* Download the portable version of [Packet Sender](https://packetsender.com/download).
* Reset the device following the instructions from the device manual, this usually means holding one or two buttons for 10 seconds. This will reset all device settings including the Wi-Fi settings.
* After reset the device will create a it's own Wi-Fi network. This network will have a name related to the device and is used for configuring the device but will also allow us to retrieve the token. Connect to this Wi-Fi network with your computer which has Packet Sender running.
* Open Packet Sender and enter the following details.
    * HEX: 21310020ffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    * IP: 192.168.8.1
    * Port: 54321
    * Protocol dropdown: UDP
* Click send and the device will respond with an answer which contains the unique device token. In the last 16 bytes (32 characters) of the devices response is the device token. Copy and save it somewhere.
* Disconnect your computer from the devices network, you can now use the Mi Home app to setup the device and connect it to your Wi-Fi network.

## Method 5b - netcat and Wireshark / tcpdump
Like above you can also use this shell command to send the magic package:

```sh
echo -ne '\x21\x31\x00\x20\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff' | nc -u 192.168.8.1 54321
```

While running this you have to listen with Wireshark or tcpdump for UDP packages sent as anser by the robot.
Extract the last 16 bytes of the answer and convert them to a (32 characters) hexadecimal string using `xxd -p`.

## Method 6 - telnet with root access
> discovered by [#slavikme](https://github.com/slavikme)

In some devices, like "Mi Home Security Camera 360" (and maybe others), you are able to access the filesystem of the device using telnet.
* Reset the device following the instructions from the device manual, this usually means holding one or two buttons for 10 seconds. This will reset all device settings including the Wi-Fi settings. Or you can just delete the device from Mi Home app, that will reset the device for you.
* After reset the device will create it's own Wi-Fi network. This network will have a name related to the device and is used for configuring the device but will also allow us to retrieve the token. Connect to this Wi-Fi network with your computer which has a `telnet` command installed.
* Find out Wi-Fi's gateway address ([This article](https://www.lifewire.com/how-to-find-your-default-gateway-ip-address-2626072) can help). Let's say that it is `192.168.14.1`.
* Create a telnet connection to this addres:
  ```bash
  telnet 192.168.14.1
  ```
* It will ask you to enter a login. Just write `root`:
  ```bash
  Trying 192.168.14.1...
  Connected to 192.168.14.1.
  Escape character is '^]'.
  mijia-camera login: root
  #
  ```
* Now you have a root shell access to device's filesystem.
* Get the hex token using the following command:
  ```bash
  /usr/sbin/nvram get miio_token | hd -n16 -e '16/1 "%02x " "\n"' | sed '2!d; s/ //g'
  ```
  The output should be something like this:
  ```
  3268786f5730305661445a6375467039
  ```
* If you are not getting 32 characters hexadecimal string, then just run the command `/usr/sbin/nvram get miio_token` and convert it using `xxd -p` or [this tool](https://www.rapidtables.com/convert/number/ascii-to-hex.html) (don't forget to remove the space delimiter) to hexadecimal representation.  
  Command output example:
  ```bash
  # /usr/sbin/nvram get miio_token
  2hxoW00VaDZcuFp9
  ```
