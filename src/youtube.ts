import puppeteer, { PuppeteerExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer-extra-plugin/dist/puppeteer';
import { Logger } from './Logger';

export class SearchResult{
    videoName: string;
    videoUrl: string;

    constructor(videoName: string, videoUrl: string){
        this.videoName = videoName;
        this.videoUrl = videoUrl;
    }
}

export class Youtube{

    private readonly mainPageUrl = 'https://www.youtube.com/';
    private readonly acceptAllCookiesText = "Accept the use of cookies and other data for the purposes described"

    private browser!: Browser;
    private page!: Page;
    private outputDeviceName!: string;

    async initialize(outputDeviceName: string){
        this.outputDeviceName = outputDeviceName;

        puppeteer.use(StealthPlugin());
        
        this.browser = await puppeteer.launch({
            headless: false, 
            ignoreDefaultArgs: ['--disable-extensions', '--mute-audio'],
            args: [
                `--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36"`,
                '--use-fake-ui-for-media-stream',
                `--disable-extensions-except=../../../../../chromium_extensions/cjpalhdlnbpafiamejdnhcphjbkeiagm/1.43.0_1`, 
                `--load-extension=../../../../../chromium_extensions/cjpalhdlnbpafiamejdnhcphjbkeiagm/1.43.0_1`
            ]
        });
        await this.openYoutube();
    }

    async playUrl(url: string){
        try{
            await this.page.goto(url, {waitUntil: 'load'});
            await this.setAudioDevice();
        }
        catch(error){
            Logger.error(`Error in playUrl: ${error instanceof Error?error.message:'unknown error'}`);
            return false;
        }
        return true;
    }

    async playNext(){
        try{
            const selector = `ytd-compact-video-renderer[class="style-scope ytd-watch-next-secondary-results-renderer"]`;
            await this.page.waitForSelector(selector, {timeout: 3000});
            await this.page.click(selector);
        }
        catch(error){
            Logger.error(`Error in playNext: ${error instanceof Error?error.message:'unknown error'}`);
            return false;
        }
        return true;
    }

    async goBack(){
        try{
            await this.page.goBack();
        }
        catch(error){
            Logger.error(`Error in goBack: ${error instanceof Error?error.message:'unknown error'}`);
            return false;
        }
        return true;
    }

    async pauseOrResume(){
        try{
            const selector = `button[class="ytp-play-button ytp-button"]`;
            await this.page.waitForSelector(selector, {timeout: 3000});
            await this.page.click(selector);
        }
        catch(error){
            Logger.error(`Error in pauseOrResume: ${error instanceof Error?error.message:'unknown error'}`);
            return false;
        }
        return true;
    }

    async getTitle(){
        try{
            return await this.page.evaluate(() => { 
                return new Promise(resolve => { 
                    resolve(document?.querySelector("div[id=container].style-scope.ytd-video-primary-info-renderer")?.querySelector("h1 > yt-formatted-string")?.innerHTML);
                })});
        }
        catch(error){
            const errorMsg = `Error in pauseOrResume: ${error instanceof Error?error.message:'unknown error'}`;
            Logger.error(errorMsg);
            return errorMsg;
        }
    }

    private async setAudioDevice(){
        try{
            const func = `(async () => {   
                await navigator.mediaDevices.getUserMedia({audio: true, video: true});   
                var devices = await navigator.mediaDevices.enumerateDevices();
                var selectedDeviceId = devices.filter((device) => { return device.kind == 'audiooutput' && device.label.indexOf('${this.outputDeviceName}') != -1})[0].deviceId
                document.getElementsByTagName('video')[0].setSinkId(selectedDeviceId);
              })()`;
            return await this.page.evaluate(func);
        }
        catch(error){
            const errorMsg = `Error in pauseOrResume: ${error instanceof Error?error.message:'unknown error'}`;
            Logger.error(errorMsg);
            return errorMsg;
        }
    }

    /**
     * Open youtube and accept cookies
     * @returns 
     */
    async openYoutube(){
        this.page = await this.browser.newPage();
        await this.page.goto(this.mainPageUrl, {waitUntil:'load'})

        const selector = `tp-yt-paper-button[aria-label="${this.acceptAllCookiesText}"]`;
        await this.page.waitForSelector(selector, {timeout: 10000});
        return await this.page.click(selector);
    }
}