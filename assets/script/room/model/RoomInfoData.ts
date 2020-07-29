import { EnumRoomMode, EnumRoomTypes, EnumRole, RoomProperty } from "../../other/EnumCenter";
import { Time } from "../../../base/script/frame/time/Time";
import { RoomController } from "../controller/RoomController";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";

//进入的房间的数据结构
export class RoomInfo {

    //#region 房间基础数据
    public RoomId: number;              //房间Id
    public RoomName: string;            //房间名称
    public RoomTypes: EnumRoomTypes;    //房间类型
    public Password: string = '';
    public Mode: EnumRoomMode;          //房间上麦方式
    public Hot: number;                 //房间热度(即房间内总人数)
    public Background: string;          //房间背景图片
    public Reception: boolean;          //房间是否开启接待位
    public Property: RoomProperty;      //房间的属性
    public Description: string;          //房间公告
    public TypeLabel: string;           //房间标签str
    public Deleted: number;             //对应房间状态 0：房间开启，1：房主自主关闭，2：封房
    public ThemeSwitchBackground: string[] = []; //背景图全量列表
    //#region 

    //#region 房间扩展数据
    public ServerTimeStamp: number;                  //同步过来的服务器时间戳
    public get ServerTime(): string                  //同步过来的服务器时间,格式 yyyy/MM/dd hh:mm:ss
    {
        return Time.TimestampToTime(this.ServerTimeStamp * 1000)
    }
    public VoiceToken: string;            //声网Token
    public IsOpenChat: boolean = true;            //是否开启公屏
    //#endregion


    constructor(serverData?: any) {
        if (serverData) {
            this.RoomId = parseInt(serverData.rid);
            this.RoomName = serverData.name;
            this.RoomTypes = serverData.types as EnumRoomTypes;
            this.Mode = serverData.mode as EnumRoomMode;
            this.Hot = parseInt(serverData.online_num);
            this.Background = serverData.background;
            this.Reception = !!serverData.reception;
            this.Property = serverData.property as RoomProperty;
            this.TypeLabel = serverData.type_label;
            this.Deleted = serverData.deleted;
            if (serverData.hasOwnProperty('password')) {
                // 如果是房主 则有密码字段
                this.Password = serverData.password
            }

            if (serverData.themeSwitchBackground) {
                this.ThemeSwitchBackground = [];
                for (let index = 0; index < serverData.themeSwitchBackground.length; index++) {
                    const element = serverData.themeSwitchBackground[index];
                    this.ThemeSwitchBackground.push(element)
                }
            }
            if (serverData.hasOwnProperty('display_message')) {
                this.IsOpenChat = Number(serverData.display_message) > 0;
            }
        }

        Clog.Trace(ClogKey.Net, "new RoomInfo finish");
    }

    public From(serverData?: any) {
        if (serverData.hasOwnProperty('rid')) this.RoomId = parseInt(serverData.rid);
        if (serverData.hasOwnProperty('name')) this.RoomName = serverData.name;
        if (serverData.hasOwnProperty('types')) this.RoomTypes = serverData.types as EnumRoomTypes;
        if (serverData.hasOwnProperty('mode')) this.Mode = serverData.mode as EnumRoomMode;
        if (serverData.hasOwnProperty('online_num')) this.Hot = parseInt(serverData.online_num);
        if (serverData.hasOwnProperty('background')) this.Background = serverData.background;
        if (serverData.hasOwnProperty('reception')) this.Reception = !!serverData.reception;
        if (serverData.hasOwnProperty('property')) this.Property = serverData.property as RoomProperty;
        if (serverData.hasOwnProperty('deleted')) this.Deleted = serverData.deleted;
        if (serverData.hasOwnProperty('description_text')) this.Description = serverData.description_text;
        if (serverData.hasOwnProperty('themeSwitchBackground')) {
            this.ThemeSwitchBackground = [];
            for (let index = 0; index < serverData.themeSwitchBackground.length; index++) {
                const element = serverData.themeSwitchBackground[index];
                this.ThemeSwitchBackground.push(element)
            }
        }
        if (serverData.hasOwnProperty('display_message')) {
            this.IsOpenChat = Number(serverData.display_message) > 0;
        }
    }
}


