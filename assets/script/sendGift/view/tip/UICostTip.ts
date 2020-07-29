import { UIBase } from "../../../../base/script/frame/ui/UIBase";
import { UIEventCenter } from "../../../../base/script/util/UIEventCenter";
import { UIManager } from "../../../../base/script/frame/ui/UIManager";
import { UIUtil } from "../../../../base/script/frame/ui/UIUtil";
import { XiYouGiftManager } from "../../../xiyou/controller/XiYouGiftManager";
import { LocalStorageUtil } from "../../../../base/script/frame/storage/LocalStorage";

/**
 * 提示送礼消费结果界面
 */
export class UICostTip extends UIBase {

    public PrefabName = "P_UICostTip"

    private _btnSure: cc.Button;
    private _btnCancel: cc.Button;
    private _isSelectSprite: cc.Sprite;
    private _btnUnTip: cc.Button;
    private _tip: cc.Label;

    public static Cost: number = 1;

    //是否提示送礼（localstorage）
    private static _isTipCost: boolean = null;
    public static get IsTipCost(): boolean {
        if (this._isTipCost == null)
            this._isTipCost = LocalStorageUtil.GetBool('IsTipCost', true)
        return this._isTipCost;
    }
    public static set IsTipCost(value: boolean) {
        this._isTipCost = value
        LocalStorageUtil.SetBool('IsTipCost', this._isTipCost)
    }

    onLoad() {
        this.initRoot();
        this.initEvent();
    }

    start(){
        this.refresTipIcon();
        this.refreshTip();
    }

    private initRoot() {
        this._btnSure = cc.find("Bg/Layout/BtnSure", this.node).getComponent(cc.Button);
        this._btnCancel = cc.find("Bg/Layout/BtnCancel", this.node).getComponent(cc.Button);
        this._isSelectSprite = cc.find("Bg/BtnUnTip/Cell", this.node).getComponent(cc.Sprite);
        this._btnUnTip = cc.find("Bg/BtnUnTip", this.node).getComponent(cc.Button);
        this._tip = cc.find("Bg/Tip", this.node).getComponent(cc.Label);
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnSure, () => this.onBtnSureClick())
        UIEventCenter.ButtonEvent(this._btnCancel, () => this.onBtnCancelClick())
        UIEventCenter.ButtonEvent(this._btnUnTip, () => this.onBtnUnTipClick())
    }

    private onBtnCancelClick() {
        UIManager.CloseUI(UICostTip)
    }

    private refreshTip() {
        this._tip.string = "您本次消费需要支付" + UICostTip.Cost + "玩币"
    }

    private async onBtnSureClick() {
        await XiYouGiftManager.GiftSend();
        await UIManager.CloseUI(UICostTip)
    }

    private onBtnUnTipClick() {
        UICostTip.IsTipCost = !UICostTip.IsTipCost
        this.refresTipIcon();
    }

    private refresTipIcon() {
        let name = UICostTip.IsTipCost ? "T_Cell_UnSelect" : "T_Cell_Selected"
        UIUtil.ChangeSprite(name, this._isSelectSprite)
    }
}