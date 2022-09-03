import { Youtube } from './youtube';
import { TS3Client } from './TS3Client';
import * as fs from 'fs';
import { TS3Event } from './TS3Event';
import { IMessageParams } from './IMessageParams';
import { Logger } from './Logger';

const wait = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

function readConfigFile(){
    return JSON.parse(fs.readFileSync('./config.json').toString());
}

// TODO: 10min ts3 client timeout

async function main(){
    const config = readConfigFile();

    const youtube = new Youtube();
    await youtube.initialize(config.audioDeviceName);

    const youtubeCommandHandler = (eventParams: IMessageParams, command: string, param?: string) => {
        switch(command){
            case '!play':{
                if(!param){
                    return;
                }
                youtube.playUrl(param.substring(5, param.length-6)).then(result => {
                    if(!result){
                        ts3Client.telnetSendEvent("sendtextmessage", { targetmode: eventParams.targetmode, target: eventParams.invokerid, msg: 'Command failed! Check logs for more Info.'});
                    }
                })
                break;
            }
            case '!next':{
                youtube.playNext().then(result => {
                    if(!result){
                        ts3Client.telnetSendEvent("sendtextmessage", { targetmode: eventParams.targetmode, target: eventParams.invokerid, msg: 'Command failed! Check logs for more Info.'});
                    }
                })
                break;
            }
            case '!previous':{
                youtube.goBack().then(result => {
                    if(!result){
                        ts3Client.telnetSendEvent("sendtextmessage", { targetmode: eventParams.targetmode, target: eventParams.invokerid, msg: 'Command failed! Check logs for more Info.'});
                    }
                })
                break;
            }
            case '!prev':{
                youtube.goBack().then(result => {
                    if(!result){
                        ts3Client.telnetSendEvent("sendtextmessage", { targetmode: eventParams.targetmode, target: eventParams.invokerid, msg: 'Command failed! Check logs for more Info.'});
                    }
                })
                break;
            }
            case '!pause':{
                youtube.pauseOrResume().then(result => {
                    if(!result){
                        ts3Client.telnetSendEvent("sendtextmessage", { targetmode: eventParams.targetmode, target: eventParams.invokerid, msg: 'Command failed! Check logs for more Info.'});
                    }
                })
                break;
            }
            case '!resume':{
                youtube.pauseOrResume().then(result => {
                    if(!result){
                        ts3Client.telnetSendEvent("sendtextmessage", { targetmode: eventParams.targetmode, target: eventParams.invokerid, msg: 'Command failed! Check logs for more Info.'});
                    }
                })
                break;
            }
            case '!name':{
                youtube.getTitle().then(title => {
                    ts3Client.telnetSendEvent("sendtextmessage", { targetmode: eventParams.targetmode, target: eventParams.invokerid, msg: title as string});
                });
                break;
            }
            default:{
                Logger.info(`Command ${command} is invalid!`);
            }
        }
    }

    const unescapeMessage = (msg: string) => {
        msg = msg.replace(/\\\//g, '/');
        msg = msg.replace(/\\s/g, ' ');
        msg = msg.replace(/\\\\/g, '\\');
        return msg;
    }

    const textMessageHandler = (params: IMessageParams) => {
        if(!params.msg){
            return ;
        }
        const botCommandMessage = unescapeMessage(params.msg);
        const commandElements = botCommandMessage.split(' ');
    
        if(commandElements[0].indexOf('!') == 0){
            youtubeCommandHandler(params, commandElements[0], commandElements[1]);
        }
    
    }

    const ts3Client = new TS3Client(config.exePath, config.exeParams);
    await wait(4000);
    ts3Client.telnetConnect(config.ip, config.port, config.apiKey);
    await wait(1000);
    ts3Client.registerEventListener(TS3Event.notifytextmessage, textMessageHandler);
}

main();