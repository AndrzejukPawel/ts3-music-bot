import * as fs from 'fs';

export class Logger{
    private static stream: fs.WriteStream;
    
    static error(msg: string){
        this.log(`[${new Date().toLocaleString()}] Error:\t${msg}`);
    }

    static info(msg: string){
        this.log(`[${new Date().toLocaleString()}] Info:\t${msg}`);
    }

    private static log(msg: string){
        console.log(msg)
        this.ensureStreamIsOpen();
        this.stream.write(msg + '\n');
    }

    private static ensureStreamIsOpen(){
        if(!this.stream){
            this.stream = fs.createWriteStream("./log.log", {flags:'a'});
        }
    }
}