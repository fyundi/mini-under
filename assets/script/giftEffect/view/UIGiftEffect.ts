import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { SS } from "../../../base/script/global/SS";
import { EventCommond } from "../../other/EventCommond";
import { UIUtil } from "../../../base/script/frame/ui/UIUtil";
import { GiftEffectController } from "../controller/GiftEffectController";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { GiftEffectData } from "../model/GiftEffectData";
import { RoomController } from "../../room/controller/RoomController";
import { RoomSeats } from "../../room/view/seat/RoomSeats";
import { StringLimit } from "../../../base/script/util/StringUtil";
import { XiYouGiftTable } from "../../xiyou/config/XiYouGiftConfig";
import { EnumUIHierarchy } from "../../../base/script/frame/ui/UIEnum";

export class UIGiftEffect extends UIBase {

    public PrefabName = "P_UIGiftEffect"
    public HierarchyType = EnumUIHierarchy.Fix;
    private _texture: cc.Sprite;
    private _dragon: dragonBones.ArmatureDisplay
    private isPlaying: boolean = false;
    private _sendInfo: cc.Node;

    start() {
        this.initRoot();
        this.initEvent();
    }

    private initRoot() {
        this._texture = cc.find("Texture", this.node).getComponent(cc.Sprite);
        this._dragon = cc.find("Dragon", this.node).getComponent(dragonBones.ArmatureDisplay);
        this._sendInfo = cc.find("SendInfo", this.node)
        this._sendInfo.active = false;
        this._texture.node.active = false;
        this._dragon.node.active = false;
    }

    private initEvent() {
        SS.EventCenter.on(EventCommond.OnShowGiftEffect, () => { this.showNextGiftAnim() }, this)
        SS.EventCenter.on(EventCommond.OnShowGiftCountTip, (data) => { this.OnAnimGiftCount(data) }, this)
    }

    onDestroy() {
        SS.EventCenter.off(EventCommond.OnShowGiftEffect)
        SS.EventCenter.off(EventCommond.OnShowGiftCountTip)
    }

    private async showNextGiftAnim() {
        Clog.Green(ClogKey.UI, "showNextGiftAnim");
        if (this.isPlaying) {
            return;
        }
        if (GiftEffectController.GiftEffectList.length <= 0) {
            return;
        }
        let data = GiftEffectController.GiftEffectList.pop();
        let isOK = await this.OnAnimGiftShow(data);  //开始表现礼物从A飞到B
        if (isOK) {
            this.showNextGiftAnim();
            return
        }
    }

    /**
    * 提示A送礼物给了B
    */
    private OnAnimGiftCount(data: GiftEffectData) {
        let node = cc.instantiate(this._sendInfo)
        node.addComponent(SendInfoItem).Init(data)
        node.active = true;
        node.setParent(this.node)
        node.setPosition(cc.v2(-175, 0))
        let action1 = cc.moveTo(1.2, cc.v2(-175, 300))
        let action2 = cc.delayTime(0.2)
        let action3 = cc.fadeOut(1.2)
        let action4 = cc.callFunc(() => node.destroy());
        node.runAction(cc.sequence(action1, action2, action3, action4))
    }


    /**
     * 礼物从A飞到中间，动画，再飞到B的动画
     */
    private async OnAnimGiftShow(data: GiftEffectData): Promise<boolean> {
        return new Promise(async (reslove) => {
            this.isPlaying = true;
            let fromPosition = RoomController.GetPositionByUserId(data.From.UId)
            let toPosition = RoomController.GetPositionByUserId(data.To.UId)
            let giftConfig = XiYouGiftTable.GetGiftConfigById(data.GiftId)
            let giftIcon = giftConfig.Image

            let getStartPos = () => {
                if (fromPosition >= 0) {
                    let fromWorldPos = RoomSeats.Instance.GetSeatItemPostion(fromPosition)
                    let fromLocalPos = this.node.convertToNodeSpaceAR(fromWorldPos)
                    return fromLocalPos
                }
                return cc.v2(375, 667)   //右上角
            }

            let getEndPos = () => {
                if (toPosition >= 0) {
                    let toWorldPos = RoomSeats.Instance.GetSeatItemPostion(toPosition)
                    let toLocalPos = this.node.convertToNodeSpaceAR(toWorldPos)
                    return toLocalPos
                }
                return cc.v2(-375, -667) //左下角
            }

            let startPos = getStartPos()
            let endPos = getEndPos()

            await this.step1(giftIcon, startPos, cc.v2(0, 0));
            await this.step2(data);
            await this.step3(giftIcon, cc.v2(0, 0), endPos);
            this.isPlaying = false;
            reslove(true)
        })
    }


    /**
     * 第一步，从礼物送出者的位置飞到屏幕中心
     * @param icon 
     * @param startPos 
     * @param endPos 
     */
    private async step1(icon: string, startPos: cc.Vec2, endPos: cc.Vec2): Promise<boolean> {
        return new Promise(async (reslove) => {
            this._texture.node.active = true;
            UIUtil.ChangeSprite(icon, this._texture)
            this._texture.node.setPosition(startPos)
            this._texture.node.runAction(cc.sequence(
                cc.moveTo(0.5, endPos),
                cc.callFunc(() => {
                    this._texture.node.active = false;
                    reslove(true)
                })
            ))
        })
    }

    /**
     * 第二步，在屏幕中心展示动画
     * @param data 
     */
    private async step2(data: GiftEffectData) {
        Clog.Green(ClogKey.UI, "gift=" + JSON.stringify(data));
        this._dragon.node.active = true;
        this._dragon.node.scale = 0.6;
        let giftConfig = XiYouGiftTable.GetGiftConfigById(data.GiftId);
        let path = "xiyou/gift/" + giftConfig.AnimName;
        await UIUtil.LoadDragonBones(this._dragon, path, giftConfig.AnimName, "idle");
        this._dragon.node.active = false;
    }

    /**
     * 第三步，从屏幕中心飞到礼物接收者的位置
     * @param icon 
     * @param startPos 
     * @param endPos 
     */
    private async step3(icon: string, startPos: cc.Vec2, endPos: cc.Vec2): Promise<boolean> {
        return new Promise(async (reslove) => {
            this._texture.node.active = true;
            UIUtil.ChangeSprite(icon, this._texture)
            this._texture.node.setPosition(startPos)
            this._texture.node.runAction(cc.sequence(
                cc.moveTo(0.5, endPos),
                cc.callFunc(() => {
                    this._texture.node.active = false;
                    reslove(true)
                })
            ))
        })
    }

}



class SendInfoItem extends cc.Component {

    private data: GiftEffectData
    private _playerIcon: cc.Sprite;
    private _fromNameLabel: cc.Label;
    private _toNameLabel: cc.Label;
    private _giftIcon: cc.Sprite;
    private _countLabel: cc.Label;
    public Init(data: GiftEffectData) {
        this.data = data;
        this.initRoot();
        this.refresh();
    }

    private initRoot() {
        this._playerIcon = cc.find("IconMask/Icon", this.node).getComponent(cc.Sprite)
        this._fromNameLabel = cc.find("FromName", this.node).getComponent(cc.Label)
        this._toNameLabel = cc.find("ToName", this.node).getComponent(cc.Label)
        this._giftIcon = cc.find("GiftIcon", this.node).getComponent(cc.Sprite)
        this._countLabel = cc.find("Count", this.node).getComponent(cc.Label)
    }

    private refresh() {
        this._fromNameLabel.string = StringLimit(this.data.From.Name, 14);
        this._toNameLabel.string = StringLimit(this.data.To.Name, 14);
        let giftConfig = XiYouGiftTable.GetGiftConfigById(this.data.GiftId)
        let giftIcon = giftConfig.Image
        UIUtil.ChangeSprite(giftIcon, this._giftIcon)
        this._countLabel.string = "X" + this.data.GiftNum.toString();
        let url = SS.ImageUrlProxy + this.data.From.Icon;
        UIUtil.LoadRemoteImage(url, this._playerIcon);
    }
}