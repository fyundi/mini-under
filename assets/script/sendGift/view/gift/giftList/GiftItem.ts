/*
 * @Description: 
 * @Author: luo.fei
 * @Date: 2020-04-26 15:43:20
 */

import { UIEventCenter } from "../../../../../base/script/util/UIEventCenter";
import { UIUtil } from "../../../../../base/script/frame/ui/UIUtil";
import { XiYouGiftManager } from "../../../../xiyou/controller/XiYouGiftManager";
import { XiYouGiftConfig } from "../../../../xiyou/config/XiYouGiftConfig";
import { EnumXiyouItemType } from "../../../../other/EnumCenter";
import { UIGift } from "../../main/UIGift";
import { GiftPanel } from "../GiftPanel";

export class GiftItem extends cc.Component {
    private data: XiYouGiftConfig
    private _icon: cc.Sprite;
    private _cost: cc.Label;
    private _onSelect: cc.Node;
    private _nameLabel: cc.Label;
    private _btnThis: cc.Button;

    public Init(data: XiYouGiftConfig) {
        this.data = data;
        this.node.active = true;
        this.initRoot();
        this.initEvent();
        this.refreshAll();
    }

    private initRoot() {
        this._icon = cc.find("Icon", this.node).getComponent(cc.Sprite);
        this._cost = cc.find("Cost", this.node).getComponent(cc.Label);
        this._nameLabel = cc.find("Name", this.node).getComponent(cc.Label);
        this._onSelect = cc.find("OnSelect", this.node)
        this._onSelect.active = false;
        this._btnThis = this.node.getComponent(cc.Button);
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnThis, () => this.onBtnThisClick());
    }

    private refreshAll() {
        this.refreshIcon();
        this.refrehsCost();
        this.refreshName();
        this.RefreshOnSelect();
    }

    private refreshIcon() {
        UIUtil.ChangeSprite("gift_01_" + this.data.Id, this._icon);
    }

    private refreshName() {
        this._nameLabel.string = this.data.Name;
    }

    private refrehsCost() {
        switch (this.data.Type) {
            case EnumXiyouItemType.XiyouCommodity:
                this._cost.string = this.data.Price + "玩币"
                return
            case EnumXiyouItemType.XiyouProp:
                this._cost.string = this.data.Price + "金币"
                return
        }
    }

    public RefreshOnSelect() {
        this._onSelect.active = XiYouGiftManager.CurSendGiftInfo.Id == this.data.Id
    }

    private onBtnThisClick() {
        XiYouGiftManager.CurSendGiftInfo.Id = this.data.Id
        GiftPanel.Instance.OnSelectGiftId();
    }

}