import * as exec from 'child_process';
import * as fs from 'fs';
import { IMessageParams } from './IMessageParams';
import { Logger } from './Logger';
import { TelnetClient } from './TelnetClient';

export class TS3Client{

    private telnet!: TelnetClient;
    private commandCallbacks: Map<string, (params: IMessageParams) => void> = new Map();

    constructor(ts3ClientExePath: string, params: string[]){
        try{
            exec.spawn(`${ts3ClientExePath}`, params);
        }
        catch(error){
            console.log(error);
            return;
        }
    }

    telnetConnect(ip: string, port: number, apiKey: string){
        this.telnet = new TelnetClient(ip, port);
        this.telnet.connect(() => { Logger.info("Telnet connected"); });
        const authentication = (msg:string) => {
            if(msg.includes(`Use the "auth" command to authenticate yourself.`)){
                this.telnet.sendCommand('auth', { apikey: apiKey});
                this.telnet.unregisterCallback(authentication);
                this.telnet.registerCallback(this.dataCallback);
            }
        }
        this.telnet.registerCallback(authentication);
    }

    telnetSendEvent(event: string, params: IMessageParams){
        this.telnet.sendCommand(event, params);
    }

    private dataCallback = (msg: string) => {
        const splitMsg = msg.split(' ');
        const commandName = splitMsg[0];
        const paramsNameValuePairs = splitMsg.slice(1).map(param => {
            let splitPoint = param.indexOf('=');
            let name = param.substring(0, splitPoint);
            let value: string | number = param.substring(splitPoint + 1);
            value = Number.isNaN(Number(value)) ? value : Number(value);
            
            return {
                name: name, 
                value: value
            }
        });

        let params: IMessageParams = {};


        const paramsObject: Map<string, string | number> = new Map();
        paramsNameValuePairs.forEach((param) => {
            params[param.name] = param.value;
        })

        const callback = this.commandCallbacks.get(commandName);
        if(callback){
            callback(params);
        }
    }

    registerEventListener(event: string, listener: (params: IMessageParams) => void){
        if(this.commandCallbacks.get(event)){
            Logger.error(`Listener for event ${event} is already registered!`);
        }
        this.commandCallbacks.set(event, listener);
        this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: event});
    }

    unregisterEventListener(event: string){
        if(!this.commandCallbacks.get(event)){
            Logger.error(`Listener for event ${event} is not registered!`);
        }
        this.commandCallbacks.delete(event);
    }

    // registerNotifications(){
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifytalkstatuschange"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifymessage"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifymessagelist"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifycomplainlist"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifybanlist"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyclientmoved"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyclientleftview"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifycliententerview"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyclientpoke"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyclientchatclosed"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyclientchatcomposing"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyclientupdated"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyclientids"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyclientdbidfromuid"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyclientnamefromuid"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyclientnamefromdbid"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyclientuidfromclid"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyconnectioninfo"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifychannelcreated"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifychanneledited"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifychanneldeleted"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifychannelmoved"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyserveredited"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyserverupdated"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "channellist"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "channellistfinished"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifytextmessage"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifycurrentserverconnectionchanged"});
    //     this.telnet.sendCommand("clientnotifyregister", {schandlerid: 0, event: "notifyconnectstatuschange"});
    // }

}