export interface IMessageParams{
    schandlerid?: number; 
    targetmode?: number; 
    msg?: string; 
    target?: number; 
    invokerid?: number; 
    invokername?: string; 
    invokeruid?: string;
    [key: string]: any;
}