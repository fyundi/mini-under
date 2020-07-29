import { UIBase } from "../../../../base/script/frame/ui/UIBase";
import { EnumUIOpenTween, EnumUICloseTween } from "../../../../base/script/frame/ui/UIEnum";
import { UIEventCenter } from "../../../../base/script/util/UIEventCenter";
import { UIManager } from "../../../../base/script/frame/ui/UIManager";
import { GiftPanel } from "../gift/GiftPanel";
import { Bag } from "../bag/Bag";
import { EnumGiftTab } from "../../../other/EnumCenter";
import { GiftTab } from "../tab/GiftTab";
import { XiYouGiftManager } from "../../../xiyou/controller/XiYouGiftManager";
import { EntryController } from "../../../entry/controller/EntryController";


/*
 * @@Description: 礼物赠送面板主UI，该UI有三个子面板，分别为tab(页签)，gift(礼物)，bag(背包)
 * @Author: your name
 * @Date: 2020-04-26 11:23:34
 */
export class UIGift extends UIBase {
    public static Instance: UIGift;
    public PrefabName = 'P_UIGift';
    public OpenTween = EnumUIOpenTween.DrawerBottomOpen;
    public CloseTween = EnumUICloseTween.DrawerBottomClose;
    private _btnMask: cc.Button;                //空白处点击按钮
    private _panelGift: cc.Node;
    private _panelBag: cc.Node;

    onLoad() {
        UIGift.Instance = this;
        this.initRoot();
        this.initSubPanel();
        this.initEvent();
    }

    start() {
        this.refresh();
    }

    private async initRoot() {
        this._btnMask = cc.find("Mask", this.node).getComponent(cc.Button);
        cc.find("Main/Tab", this.node).addComponent(GiftTab);      //子面板：页签
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnMask, () => this.onBtnMaskClick())
    }

    private initSubPanel() {
        XiYouGiftManager.ResetCurSendGiftInfo();
        this._panelGift = cc.find("Main/Gift", this.node);          //子面板：礼物
        // this._panelBag = cc.find("Main/Bag", this.node);            //子面板：背包
        this._panelGift.active = false;
        this._panelGift.addComponent(GiftPanel);
        // this._panelBag.addComponent(Bag);
        this._panelGift.active = true;
    }

    private onBtnMaskClick() {
        UIManager.CloseUI(UIGift)
    }

    public ShowSubPanel(tab: EnumGiftTab) {
        this._panelBag.active = tab == EnumGiftTab.Bag;
        this._panelGift.active = tab == EnumGiftTab.Gift;
    }

    private refresh() {
        //iphoneX的ui适应
        let bottomWidget = cc.find("Main", this.node).getComponent(cc.Widget);
        EntryController.IphoneXUIFit([bottomWidget], 20);
    }


}
