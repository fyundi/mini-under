import { GiftEffectData } from "../../../giftEffect/model/GiftEffectData";
import { RoomStyle } from "../../../other/RoomStyle";
import { UIEventCenter } from "../../../../base/script/util/UIEventCenter";
import { Session } from "../../../login/model/SessionData";
import { UIManager } from "../../../../base/script/frame/ui/UIManager";
import { UIUserDetail } from "../../../userDetail/view/UIUserDetail";
import { UserDetailController } from "../../../userDetail/controller/UserDetailController";
import Clog from "../../../../base/script/frame/clog/Clog";
import { UIUtil } from "../../../../base/script/frame/ui/UIUtil";
/*
 * @Description: 
 * @Author: luo.fei
 * @Date: 2020-04-27 15:28:25
 */
export class RoomGiftTip extends cc.Component {

    private _lvIcon: cc.Node;         //玩家等级图片
    private _lvIconBg: cc.Sprite;         //玩家等级图片
    private _lvIconLabel: cc.Label;       //玩家等级
    private _fromLabel: cc.Label;
    private _toLabel: cc.Label;
    private _giftIcon: cc.Sprite;
    private _giftCountLabel: cc.Label;
    private _btn: cc.Button;

    private initRoot(): void {
        this._lvIcon = cc.find("LvIcon", this.node);
        this._lvIconBg = cc.find("LvIcon/Bg", this.node).getComponent(cc.Sprite);
        this._lvIconLabel = cc.find("LvIcon/Label", this.node).getComponent(cc.Label);
        this._fromLabel = cc.find("FromLabel", this.node).getComponent(cc.Label);
        this._toLabel = cc.find("ToLabel", this.node).getComponent(cc.Label);
        this._giftCountLabel = cc.find("CountLabel", this.node).getComponent(cc.Label);
        this._btn = this.node.getComponent(cc.Button);
        this._giftIcon = cc.find("gift/Icon", this.node).getComponent(cc.Sprite);
    }


    public Init(data: GiftEffectData) {
        this.initRoot();
        this._fromLabel.string = data.From.Name;
        this._toLabel.string = data.To.Name;
        this._giftCountLabel.string = "x" + data.GiftNum;
        let url = "gift_01_" + data.GiftId;
        UIUtil.ChangeSprite(url, this._giftIcon);
        if (data.From.Vip <= 0) {
            this._lvIcon.active = false;
        }
        else {
            this._lvIcon.active = true;
            this._lvIconBg.node.color = RoomStyle.VipColor(data.From.Vip);
            this._lvIconLabel.string = '' + data.From.Vip;
        }
        this.eventLookOtherDetail(data.From.UId);
    }

    /**
    * 点击玩家名字查看详细信息
    * @param uid 
    */
    private eventLookOtherDetail(uid: number) {
        if (uid == Session.BanBan.UId) {
            return;
        }
        UIEventCenter.ButtonEvent(this._btn, async () => {
            UserDetailController.TargetUserId = uid
            await UIManager.OpenUI(UIUserDetail);
        })
    }

}

