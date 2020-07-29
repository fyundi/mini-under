import { EventCommond } from "../../../other/EventCommond";
import { RoomChat } from "./RoomChat";
import { SS } from "../../../../base/script/global/SS";
import Clog, { ClogKey } from "../../../../base/script/frame/clog/Clog";
import { EmojiData } from "../../../emoji/model/EmojData";
import { GiftEffectData } from "../../../giftEffect/model/GiftEffectData";
import { RoomDescription } from "./RoomDescription";
import { RoomWellcome } from "./RoomWellcome";
import { RoomEmoji } from "./RoomEmoji";
import { RoomGiftTip } from "./RoomGiftTip";
import { RoomKick } from "./RoomKick";
import { RoomController } from "../../controller/RoomController";


/*
 * @Description: 
 * @Author: luo.fei
 * @Date: 2020-04-27 15:01:56
 */
export class Chat extends cc.Component {
    private _chatLayout: cc.Node;

    private _chatItem: cc.Node;
    private _descriptionItem: cc.Node;
    private _wellcomeItem: cc.Node;
    private _emojiItem: cc.Node;
    private _giftTipItem: cc.Node
    private _kickItem: cc.Node

    private ContentMaxNum: number = 50

    onLoad(): void {
        this.initRoot();
        this.initEvent();
    }

    start() {
        this.onRoomDescription();       //只有每一次打开界面的时候，才显示房间的公告
        this.onRefresh();
    }

    private initRoot(): void {
        this._chatLayout = cc.find("ScrollView/view/content", this.node)

        this._chatItem = cc.find("RoomChat", this.node)
        this._chatItem.active = false;

        this._descriptionItem = cc.find("RoomDescription", this.node)
        this._descriptionItem.active = false;

        this._wellcomeItem = cc.find("RoomWellcome", this.node)
        this._wellcomeItem.active = false;

        this._emojiItem = cc.find("RoomEmoji", this.node)
        this._emojiItem.active = false;

        this._giftTipItem = cc.find("RoomGiftTip", this.node)
        this._giftTipItem.active = false;

        this._kickItem = cc.find("RoomKick", this.node)
        this._kickItem.active = false;
    }

    private initEvent(): void {
        SS.EventCenter.on(EventCommond.UIRoomChat, this.onRoomChat, this)
        SS.EventCenter.on(EventCommond.UIRoomWellcome, this.onWellcome, this)
        SS.EventCenter.on(EventCommond.UIVistorEmoji, this.onVistorEmoji, this)
        SS.EventCenter.on(EventCommond.OnSendGiftWordTip, this.OnSendGift, this)
        SS.EventCenter.on(EventCommond.OnRoomKick, this.onRoomKick, this)
        SS.EventCenter.on(EventCommond.OnRelink, this.OnRelink, this)
        SS.EventCenter.on(EventCommond.UIChatCheck, this.refreshChat, this);
    }

    onDestroy() {
        SS.EventCenter.off(EventCommond.UIRoomChat, this.onRoomChat, this)
        SS.EventCenter.off(EventCommond.UIRoomWellcome, this.onWellcome, this)
        SS.EventCenter.off(EventCommond.UIVistorEmoji, this.onVistorEmoji, this)
        SS.EventCenter.off(EventCommond.OnSendGiftWordTip, this.OnSendGift, this)
        SS.EventCenter.off(EventCommond.OnRoomKick, this.onRoomKick, this)
        SS.EventCenter.off(EventCommond.OnRelink, this.OnRelink, this)
        SS.EventCenter.off(EventCommond.UIChatCheck, this.refreshChat, this);
    }

    //重连进来时，把公屏清空，显示房间公告
    private OnRelink() {
        this._chatLayout.destroyAllChildren();
        this.onRoomDescription();
    }


    //赠送礼物
    private OnSendGift(data: GiftEffectData) {
        Clog.Green(ClogKey.UI, "OnSendGift, chat:" + JSON.stringify(data));
        let length = this._chatLayout.children.length
        if (length >= this.ContentMaxNum) {
            let firstChild = this._chatLayout.children[0]
            this._chatLayout.removeChild(firstChild)
        }
        let node = cc.instantiate(this._giftTipItem)
        node.setParent(this._chatLayout)
        node.active = true;
        let item = node.addComponent(RoomGiftTip)
        item.Init(data)
    }

    //文字聊天
    private onRoomChat(data: { vip: number, id: number, name: string, chatStr: string }): void {
        Clog.Green(ClogKey.UI, "on room chat, chat:" + JSON.stringify(data));
        let length = this._chatLayout.children.length
        if (length >= this.ContentMaxNum) {
            let firstChild = this._chatLayout.children[0]
            this._chatLayout.removeChild(firstChild)
        }
        let node = cc.instantiate(this._chatItem)
        node.setParent(this._chatLayout)
        node.active = true;
        let item = node.addComponent(RoomChat)
        item.Init(data)
    }

    //系统欢迎
    private onWellcome(data: { id: number, name: string, vip: number }): void {
        Clog.Green(ClogKey.UI, "onWellcome, chat:" + JSON.stringify(data));
        let length = this._chatLayout.children.length
        if (length >= this.ContentMaxNum) {
            let firstChild = this._chatLayout.children[0]
            this._chatLayout.removeChild(firstChild)
        }
        let node = cc.instantiate(this._wellcomeItem)
        node.setParent(this._chatLayout)
        node.active = true;
        let item = node.addComponent(RoomWellcome)
        item.Init(data)
    }

    //访客发表情
    private onVistorEmoji(data: { id: number, name: string, emoji: EmojiData, vip: number }) {
        Clog.Green(ClogKey.UI, "onVistorEmoji, chat:" + JSON.stringify(data));
        let length = this._chatLayout.children.length
        if (length >= this.ContentMaxNum) {
            let firstChild = this._chatLayout.children[0]
            this._chatLayout.removeChild(firstChild)
        }
        let node = cc.instantiate(this._emojiItem)
        node.setParent(this._chatLayout)
        node.active = true;
        let item = node.addComponent(RoomEmoji)
        item.Init(data)
    }

    //显示房间公告
    private onRoomDescription() {
        let length = this._chatLayout.children.length
        if (length >= this.ContentMaxNum) {
            let firstChild = this._chatLayout.children[0]
            this._chatLayout.removeChild(firstChild)
        }
        let node = cc.instantiate(this._descriptionItem)
        node.setParent(this._chatLayout)
        node.active = true;
        let item = node.addComponent(RoomDescription)
        item.Init()
    }

    //显示A把B踢出房间
    private onRoomKick(data: string) {
        let length = this._chatLayout.children.length
        if (length >= this.ContentMaxNum) {
            let firstChild = this._chatLayout.children[0]
            this._chatLayout.removeChild(firstChild)
        }
        let node = cc.instantiate(this._kickItem)
        node.setParent(this._chatLayout)
        node.active = true;
        let item = node.addComponent(RoomKick)
        item.Init(data)
    }

    private onRefresh() {
        this.refreshChat();
    }
    /**
     * 公屏开关
     */
    private refreshChat() {
        if (RoomController.CurRoom.IsOpenChat && !this._chatLayout.active) {
            this.ClearAllChat();
            this._chatLayout.active = true;
            this.onRoomKick("公屏已打开");
        }
        else if (!RoomController.CurRoom.IsOpenChat) {
            this.ClearAllChat();
            this._chatLayout.active = false;
        }
    }

    /**
     * 清除所有公屏
     */
    private ClearAllChat() {
        this._chatLayout.destroyAllChildren();
    }
}