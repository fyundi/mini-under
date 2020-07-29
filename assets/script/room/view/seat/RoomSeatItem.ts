/*
 * @Description: 房间内的玩家
 * @Author: luo.fei
 * @Date: 2020-04-22 17:06:03
 */
import { UIEventCenter } from "../../../../base/script/util/UIEventCenter";
import { UIUtil } from "../../../../base/script/frame/ui/UIUtil";

import { SS } from "../../../../base/script/global/SS";
import { RoomController } from "../../controller/RoomController";
import Clog, { ClogKey } from "../../../../base/script/frame/clog/Clog";
import { EventCommond } from "../../../other/EventCommond";
import { EmojiData } from "../../../emoji/model/EmojData";

import { StringLimit } from "../../../../base/script/util/StringUtil";
import { EventAgora } from "../../../../base/script/api/agora/AgoraBase";
import { AgoraApi } from "../../../../base/script/api/AgoraApi";
import { ActionSheetController } from "../../../actionSheet/controller/ActionSheetController";
import { Session } from "../../../login/model/SessionData";
import { JoinMicController } from "../../controller/JoinMicController";
import { RoomSeatData } from "../../model/RoomSeatData";
import { EmojiController } from "../../../emoji/controller/EmojiController";

/**
 * 房间内单个座位
 */
export class RoomSeatItem extends cc.Component {

    private _position: number;
    private get data(): RoomSeatData {
        return RoomController.Seats.find(item => item.Position == this._position)
    }
    private _headIcon: cc.Sprite;
    private _iconAdd: cc.Sprite;        //加号按钮
    private _nameLabel: cc.Label;
    private _infoRoot: cc.Node;
    private _info: cc.Label;
    private _btnThis: cc.Button;
    private _emoji: cc.Animation;
    private _onSpeak: cc.Node;
    private _onSpeakAnim: cc.Animation;
    private _onCountDown: cc.Node;
    private _onCountDownLabel: cc.Label;

    public Init(pos: number) {
        this._position = pos;
        this.node.active = true;
        this.initRoot();
        this.initEvent();
    }

    onDestroy() {
        this.removeEvent();
    }

    //初始化各节点
    private initRoot() {
        this._headIcon = cc.find("Mask/Icon", this.node).getComponent(cc.Sprite);
        this._iconAdd = cc.find("Mask/Add", this.node).getComponent(cc.Sprite);
        this._nameLabel = cc.find("NameLabel", this.node).getComponent(cc.Label);
        this._infoRoot = cc.find("Info", this.node);
        this._info = cc.find("Info/Label", this.node).getComponent(cc.Label);
        this._btnThis = cc.find("Btn", this.node).getComponent(cc.Button);
        this._emoji = cc.find("Emoji", this.node).getComponent(cc.Animation);
        this._onSpeak = cc.find("OnSpeak", this.node);
        this._onSpeakAnim = cc.find("OnSpeak/Bg", this.node).getComponent(cc.Animation);
        this._onCountDown = cc.find("Mask/OnCountdown", this.node);
        this._onCountDownLabel = cc.find("Mask/OnCountdown/Bg/Label", this.node).getComponent(cc.Label);

        this._emoji.node.active = false;
        this._emoji.on('finished', this.onEmojiFinished, this);
    }

    //初始化事件
    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnThis, () => this.OnBtnThisClick());
        SS.EventCenter.on(EventCommond.UIPlayerEmoji, this.onEmoji, this);
        SS.EventCenter.on(EventCommond.UIRoomMicBt, this.refreshOnSpeak, this);
        SS.EventCenter.on(EventAgora.EventVoIPChatSpeakersChanged, this.refreshOnSpeak, this);
        this.schedule(this.refreshCountdown.bind(this), 1, cc.macro.REPEAT_FOREVER, 1);
    }

    private removeEvent() {
        SS.EventCenter.off(EventCommond.UIPlayerEmoji, this.onEmoji, this);
        SS.EventCenter.off(EventCommond.UIRoomMicBt, this.refreshOnSpeak, this);
        SS.EventCenter.off(EventAgora.EventVoIPChatSpeakersChanged, this.refreshOnSpeak, this);
        this.unschedule(this.refreshCountdown.bind(this));
    }

    private async onEmoji(data: { position: number, emoji: EmojiData }) {
        //较验表情数据的座位号
        if (data.position != this.data.Position) {
            return;
        }

        Clog.Green(ClogKey.UI, "onPlayerEmoji, emojiInfo:" + JSON.stringify(data));

        this._emoji.node.active = true;
        let sprite = this._emoji.getComponent(cc.Sprite);
        EmojiController.CreatePlaceClip(data.emoji,async (typeStr: string ,res: any) => {
            if(typeStr == "SpriteFrame") {
                sprite.spriteFrame = res;
                sprite.node.scale = 0.8;
            } else {
                sprite.spriteFrame = null;
                sprite.node.scale = data.emoji.SeatScale;
                while (this._emoji.getClips().length > 0) this._emoji.removeClip(this._emoji.getClips()[0], true);
                if (res) {
                    this._emoji.addClip(res, data.emoji.Id);
                    this._emoji.play(data.emoji.Id);
                }
            }
        })
    }

    private onEmojiFinished() {
        this._emoji.node.active = false;
    }

    //头像按钮点击事件
    private async OnBtnThisClick() {
        ActionSheetController.OnClickPosition(this._position);
    }

    //刷新整个
    public Refresh() {
        this.refreshSeatPlayerIcon();
        this.refreshSeatPlayerName();
        this.refreshSeatPlayerInfo();
        this.refreshOnSpeak();
        this.refreshCountdown();
    }

    /**
     * 重置UI
     */
    public Reset()
    {
        //icon
        this._iconAdd.node.active = true;
        UIUtil.ChangeSprite("T_Com_Seat_Normal", this._iconAdd)
        this._headIcon.node.active = false;
        //name
        this._nameLabel.node.active = false;
        //声波
        this._onSpeak.active=false;

        this._onCountDown.active = false;
    }

    //刷新访客头像Icon
    private refreshSeatPlayerIcon() {
        //case 有人
        if (this.data.HasPlayer) {
            let url = SS.ImageUrlProxy + this.data.Icon;
            UIUtil.LoadRemoteImage(url, this._headIcon);
            this._iconAdd.node.active = false;
            this._headIcon.node.active = true;
            return;
        }

        //case 没人，但位置上锁了
        if (this.data.IsLock) {
            this._iconAdd.node.active = true;
            UIUtil.ChangeSprite("T_Com_Seat_Lock", this._iconAdd)
            this._headIcon.node.active = false;
            return;
        }

        //case 没人，位置没上锁
        this._iconAdd.node.active = true;
        UIUtil.ChangeSprite("T_Com_Seat_Normal", this._iconAdd)
        this._headIcon.node.active = false;
    }

    //刷新访客名字
    private refreshSeatPlayerName() {
        if (!this.data.HasPlayer) {
            this._nameLabel.node.active = false;
            return;
        }
        this._nameLabel.node.active = true;
        this._nameLabel.string = StringLimit(this.data.Name, 16);
    }

    //刷新麦上的打赏统计（暂不显示）
    private refreshSeatPlayerInfo() {
        this._infoRoot.active = false;
    }

    private refreshOnSpeak() {          
        // Clog.Red(ClogKey.UI,"【-----------------refreshOnSpeak】:"+AgoraApi.Agora.SpeakingUids);
        // let res=  (this.data.UId === Session.BanBan.UId && !JoinMicController.MicMute)  // qq实时语音中的openId居然不包括自己
        // || (this.data.UId !== Session.BanBan.UId && !!AgoraApi.Agora.SpeakingUids.find(openId => openId == this.data.OpenId));
        let res=AgoraApi.Agora.SpeakingUids.find(openId => openId == this.data.OpenId);      
        if(res)
        {
            this._onSpeak.active=true;
        }
        else
        {
            this._onSpeak.active=false;
        }                   
    }

    private refreshCountdown() {
        if (!this.data.HasPlayer) {
            this._onCountDown.active = false;
            return;
        }

        let current = Math.trunc(new Date().getTime() / 1000);
        if (current < this.data.Counter) {
            this._onCountDown.active = true;
            this._onCountDownLabel.string = Math.max(0, this.data.Counter - current) + 's';
        }
        else if (this._onCountDown.active) {
            this._onCountDown.active = false;
        }
    }

}