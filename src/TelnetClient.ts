import { createConnection, Socket } from 'net';
import { TelnetSocket } from 'telnet-stream';
import { Logger } from './Logger';


export class TelnetClient{

    private ip: string;
    private port: number;

    private socket!: Socket;
    private telnetSocket!: TelnetSocket;

    private dataCallbacks: Array<(msg: string)=>void> = [];
    
    constructor(ip: string, port: number){
        this.ip = ip;
        this.port = port;    
    }

    connect(connectCallback: ()=>void){
        this.socket = createConnection(this.port, this.ip, connectCallback);
        this.telnetSocket = new TelnetSocket(this.socket);        
        
        this.telnetSocket.on("data", (buffer) => {
            const msg = buffer.toString("utf8");
            Logger.info(`${msg}`);
            this.dataCallbacks.forEach(callback => {
                callback(msg);
            });
        });
    }

    sendCommand(command: string, params: any = undefined){
        const escapeCharacters = (text: string): string => {
            text = text.replace(/\\/g, '\\');
            text = text.replace(/ /g, '\\s');
            text = text.replace(/\//g, '\\\\/');
            return text;
        }

        var commandWithParams = '';

        if(params){
            const propertyNames = Object.getOwnPropertyNames(params);
            const paramsString = propertyNames.map((property) => `${property}=${escapeCharacters(params[property].toString())}`).join(' ');
            commandWithParams = `${command} ${paramsString}`;
        }
        else{
            commandWithParams = command;
        }
        
        Logger.info(`Sending command ${commandWithParams}`);
        if(!this.telnetSocket.write(`${commandWithParams}\n`)){
            Logger.error(`Failed to write to socket!`);
        }
    }

    registerCallback(callback: (msg: string)=>void){
        if(this.dataCallbacks.indexOf(callback) > -1){
            console.log(`Callback ${callback} is already registered!`);
            return;
        }
        this.dataCallbacks.push(callback);
    }

    unregisterCallback(callback: (msg: string)=>void){
        const callbackIndex = this.dataCallbacks.indexOf(callback);
        if(callbackIndex == -1){
            console.log(`Callback ${callback} is not registered!`);
            return;
        }
        this.dataCallbacks.splice(callbackIndex);
    }
}