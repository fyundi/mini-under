import { SS } from "../../../base/script/global/SS";
import { EventCommond } from "../../other/EventCommond";
import { NewbieGuildConfigData } from "../model/NewbieGuildConfigData";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import UINewbieGuild from "../view/UINewbieGuild";
import { TopicController } from "../../topic/controller/TopicController";

/**
 * 新手引导控制
 */
export class NewbieGuildController {

    public static IsNeedShowGuild: boolean = false;//是否需要展示新手引导
    public static IsRunningGuild: boolean = false;// 是否正在执行新手引导
    public static serverGuilds: Array<string>; // 服务器发送过来的新手引导数据

    public static QQTopWidget: number; //qq平台上方偏移量
    public static ButtomWidget: number; // 下方偏移量

    public static CurStep: number = -1;
    public static GuildList: Array<NewbieGuildConfigData> = [];

    public static Timer: NodeJS.Timeout | null = null;
    public static JoinRoomEnd:boolean = false;

    public static GuildConfigs = {
        "flame": new NewbieGuildConfigData({
            guildName: "flame",
            maskPos: cc.v2(125, 620),
            guildTipPos: cc.v2(195, 470),
            guildTipSize: cc.size(276, 166),
            arrowPos: cc.v2(-70, 94),
            arrowScale: cc.v2(1, 1),
            iconPos: cc.v2(85, 85),
            iconName: "T_Newbie_Hot",
            text: "管理者可以点击小火苗，对房间成员进行更多操作哦",
        }),
        "more": new NewbieGuildConfigData({
            guildName: "more",
            maskPos: cc.v2(307, -613),
            guildTipPos: cc.v2(218, -490),
            guildTipSize: cc.size(276, 125),
            arrowPos: cc.v2(48, -74),
            arrowScale: cc.v2(-1, -1),
            iconPos: cc.v2(116, -56),
            iconName: "T_Newbie_More",
            text: "点击这里，可以修改房间信息哦",
        }),
        "topic": new NewbieGuildConfigData({
            guildName: "topic",
            maskPos: cc.v2(-80, -615),
            guildTipPos: cc.v2(2, -492),
            guildTipSize: cc.size(248, 125),
            arrowPos: cc.v2(-54, -74),
            arrowScale: cc.v2(1, -1),
            iconPos: cc.v2(105, -54),
            iconName: "T_Newbie_Topic",
            text: "快选择话题和大家一起玩吧",
        }),
    }

    //由于服务器发送时机不一致，加上客户端进入房间之后需要打开一些界面，
    //所以这里用定时器来保证满足条件时候再播放新手指引
    public static InitNewbieGuild() {
        this.Timer = setInterval(()=>this.CheckExecuteNewbieGuild(),500);
    }

    /**
     * 
     * @param data 收到服务器数据后执行新手引导
     */
    public static CheckExecuteNewbieGuild() {
        if(this.IsRunningGuild) return;
        if(!this.JoinRoomEnd) return;
        if(!this.IsNeedShowGuild || this.serverGuilds == null) return;
        this.CurStep = 0;
        this.GuildList = [];
        for (let index = 0; index < this.serverGuilds.length; index++) {
            let name = this.serverGuilds[index];
            this.GuildList.push(this.GuildConfigs[name]);
        }
        this.GuildStepExecute();
    }

    public static async GuildStepExecute() {
        if(this.CurStep >= this.GuildList.length) {
            Clog.Trace(ClogKey.UI,"新手指引已执行完");
            this.IsRunningGuild = false;
            clearInterval(this.Timer);
            this.GuildList = [];
            this.CurStep = -1;
            this.IsNeedShowGuild = false;
            this.serverGuilds = null;
            await UIManager.CloseUI(UINewbieGuild);
            return;
        }
        const guildData = this.GuildList[this.CurStep];
        if(!this.IsRunningGuild) {
            await UIManager.OpenUI(UINewbieGuild);
            this.IsRunningGuild = true;
        }
        SS.EventCenter.emit(EventCommond.UINewbieGuildStep,guildData);
        this.CurStep++ ;
    }

    // public static SetGuildData() {
    //     this.CurStep = 0;
    //     this.GuildList = [];
    //     if(this.IsFristCreator) {
    //         if(this.IsFirstAdmin) {
    //             //顺序播放三个指引
    //             this.GuildList.push(this.GuildConfigs.flame);
    //             this.GuildList.push(this.GuildConfigs.more);
    //             if(TopicController.IsOpenTopic) {
    //                 this.GuildList.push(this.GuildConfigs.topic);
    //             }
    //         } 
    //         else {
    //             //只需要播放话题卡引导
    //             if(TopicController.IsOpenTopic) {
    //                 this.GuildList.push(this.GuildConfigs.topic);
    //             }
    //         }
    //     } else if(this.IsFirstAdmin) {
    //         //给出热度和更多的指引
    //         this.GuildList.push(this.GuildConfigs.flame);
    //         this.GuildList.push(this.GuildConfigs.more);
    //     }
    // }
}
