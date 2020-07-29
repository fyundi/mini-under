
import { XiyouData } from "./XiYouData";
import { BanBanData as BanBanData } from "./BanBanData";
import { QQData } from "./QQData";


export class SessionData {
    public BanBan: BanBanData;            //登录BanBan方得到的banban的数据
    public XiYou: XiyouData;              //登录Xiyou方得到的xiyou的数据
    public QQ: QQData;                    //登录QQ方得到的QQ数据
    constructor() {
        this.BanBan = new BanBanData();
        this.XiYou = new XiyouData();
        this.QQ = new QQData();
    }
}

//登录数据的别名
export let Session: SessionData = new SessionData();