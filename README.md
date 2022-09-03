
# ts3-music-bot

  

Teamspeak3 music bot using puppeteer (chromium) for playing music from youtube.

  

## Setup

- run `npm install`

- put TS3 client files in the ts3client folder

- setup the server connection on the client to auto join the server/channel

- create input/output virtual audio devices (for example using Virtual Audio Cable) and set them as input/output for the TS3 client

- set up the config file

- run with `node src/index.js`

  

## Config

- audioDeviceName - name of the audio device that should output sound from chromium

- exePath - path to ts3client.exe

- exeParams - parameters for ts3client.exe

- apiKey - api key from TS3 Client Query plugin

- ip - ip address of the TS3 client

- port - port of the TS3 client

  

## Commands

- !play <youtube_video_url> - plays given video url

- !next - play next suggested video or next video from playlist

- !previous / !prev - play previous video

- !pause / !resume - start/stop video playback, both commands "click" on the plause/play button, at least for now

- !name / !title - sends a name of the video being played

  

##### TODO:

- auto load all extensions from chromium_extensions folder
- (un)escaping symbols when sending title to ts3 client
