import { RoomController } from "../../../room/controller/RoomController";
import { SS } from "../../../../base/script/global/SS";
import { EventCommond } from "../../../other/EventCommond";
import Clog, { ClogKey } from "../../../../base/script/frame/clog/Clog";
import { GiftEffectData } from "../../../giftEffect/model/GiftEffectData";
import { GiftEffectController } from "../../../giftEffect/controller/GiftEffectController";
import { EmojiController } from "../../../emoji/controller/EmojiController";
import { EmojiData } from "../../../emoji/model/EmojData";
import { JoinMicController } from "../../../room/controller/JoinMicController";
import { TopicController } from "../../../topic/controller/TopicController";
import { MicWaitController } from "../../../micWait/controller/MicWaitController";
import { MicWaitData } from "../../../micWait/model/MicWaitData";
import { NewbieGuildController } from "../../../newbie/control/NewbieGuildController";




/**
 *1.有req有resp的方法叫Call，即客户端发送数据给服务器，同时服务器也响应数据给客户端
* 2.有req无resp的方法叫Input，即客户端发送数据给服务器
* 3.无req有resp的方法叫Sync, 即服务器同步数据给客户端
* 4.本类为Sync
 */
export class RoomSocketSync {

    //注册房间websocket监听事件
    public static Start() {

    }

    //反注册房间websocket监听事件
    public static End() {

    }

    //服务器通知刷新房间在线人数
    public static OnSyncRoomOnline(num: number) {
        RoomController.CurRoom.Hot = num;
        SS.EventCenter.emit(EventCommond.UIRoomOnline)
    }

    //服务器同步所有客户端有人文字聊天
    public static SyncRoomChat(data: any) {
        Clog.Green(ClogKey.Net, "SyncRoomChat data:" + JSON.stringify(data));

        if(!data.hasOwnProperty("user"))
        {
            return;
        }
        //提取有用信息
        let chatInfo: { vip: number, id: number, name: string, chatStr: string } = {
            chatStr: data.content,
            id: data.user.id,
            name: data.user.name,
            vip: data.extra.vip_new
        }

        //通知刷新界面
        SS.EventCenter.emit(EventCommond.UIRoomChat, chatInfo)
    }

    //服务器同步所有客户端欢迎加入房间
    public static SyncRoomWellcome(data: any) {
        let chatInfo: { id: number, name: string, vip: number } = {
            id: data.extra.uid,
            name: data.extra.name,
            vip: data.extra.vip_new
        }
        //通知刷新界面
        SS.EventCenter.emit(EventCommond.UIRoomWellcome, chatInfo)
    }

    public static SyncRoomSendGift(data: any) {
        let giftData = new GiftEffectData(data);
        GiftEffectController.GiftEffectList.push(giftData);
        SS.EventCenter.emit(EventCommond.OnShowGiftEffect)
        SS.EventCenter.emit(EventCommond.OnShowGiftCountTip, giftData)
        SS.EventCenter.emit(EventCommond.OnSendGiftWordTip, giftData)
    }

    public static SyncRoomKickInfo(data: any) {
        let desc: string = data.content;
        SS.EventCenter.emit(EventCommond.OnRoomKick, desc)
    }

    /**
     * 房间有人发表情
     * @param data 
     */
    public static SyncRoomEmoji(data: any) {
        let position = data.extra.emote_position;
        let emoji = EmojiController.GetEmojiByKeyData(data.extra.emote, data.extra.emote_data);
        if (emoji == null) return;

        //访客发表情,以文字形式在UI上显示 
        if (position == -1) {
            let info: { id: number, name: string, emoji: EmojiData, vip: number } = {
                id: data.user.id,
                name: data.user.name == null ? "test" : data.user.name,
                emoji: emoji,
                vip: data.extra.vip_new,
            }
            SS.EventCenter.emit(EventCommond.UIVistorEmoji, info);
            return
        }

        //玩家发表情，需要以座位号区分，在不同玩家头像显示
        if (position >= 0 && position <= 8) {
            let info: { position: number, emoji: EmojiData } = {
                position: position,
                emoji: emoji,
            }
            SS.EventCenter.emit(EventCommond.UIPlayerEmoji, info);
            return
        }
    }

    /**
     * 同步房间话题
     * @param data 
     */
    public static SyncRoomTopic(data: any) {
        if (cc.js.isString(data)) {
            data = JSON.parse(data);
        }
        if (data.hasOwnProperty("topics") && data.hasOwnProperty("status")) {
            let arr = [];
            let topics = data.topics;
            for (var i = 0; i < topics.length; i++) {
                arr.push(Number(topics[i].id));
            }
            TopicController.RefreshTopic(arr, Number(data.status) > 0);
        }
    }

    /**
     * 同步房间排麦情况
     * @param data 
     */
    public static SyncRoomMicWait(data: any) {
        if(data)
        {           
            let micWaitData:number[]=[];
            for(let i=0;i<data.length;i++)
            {
                let d=Number(data[i]);
                micWaitData.push(d);
            }
            MicWaitController.RefreshMicWaitListData(micWaitData);
        }       
    }

    /**
     * 通知玩家播放新手引导
     * @param data 
     */
    public static SyncUserNewbieGuild(data: any) {
        let receiveData = JSON.parse(data);
        if(receiveData instanceof Array && receiveData.length > 0) {
            NewbieGuildController.IsNeedShowGuild = true;
            NewbieGuildController.serverGuilds = receiveData;
            NewbieGuildController.InitNewbieGuild();
        }
        
    }

    /**
     * 同步房间状态 数据可能残缺，不是全量
     */
    public static SyncRoomRefresh(data: any) {
        RoomController.SyncRoomRefresh(data);
        JoinMicController.SyncMicrophone();
    }


}