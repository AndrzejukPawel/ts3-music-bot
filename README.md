# ts3-music-bot

Teamspeak3 music bot using chromium for playing music from youtube.

## setup
- put TS3 client files in the ts3client folder
- setup the server connection on the client to auto join the server/channel
- create input/output virtual audio devices (for example using Virtual Audio Cable) and set them as input/output for the TS3 client
- set up the config file

## config
- audioDeviceName - name of the audio device that should output sound from chromium
- exePath - path to ts3client.exe
- exeParams - parameters for ts3client.exe
- apiKey - api key from TS3 Client Query plugin
- ip - ip address of the TS3 client
- port - port of the TS3 client

#####TODO:
- auto load all extensions from chromium_extensions folder