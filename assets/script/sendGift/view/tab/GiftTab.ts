import { EnumGiftTab } from "../../../other/EnumCenter";
import { UIEventCenter } from "../../../../base/script/util/UIEventCenter";
import Clog, { ClogKey } from "../../../../base/script/frame/clog/Clog";
import { UIGift } from "../main/UIGift";


/*
 * @Description: 房间礼物面板的页签，用于切换背包和礼物 
 * @Author: luo.fei
 * @Date: 2020-04-26 18:05:06
 */
export class GiftTab extends cc.Component {
    private _btnGift: cc.Button; //礼物页签按钮
    private _btnGiftOn: cc.Node;    //礼物页签打开状态
    private _btnGiftOff: cc.Node;   //礼物页签关闭状态
    private _btnBag: cc.Button;  //背包页签按钮
    private _btnBagOn: cc.Node;     //背包页签打开状态
    private _btnBagOff: cc.Node;    //背包页签关闭状态
    private curTab: EnumGiftTab = EnumGiftTab.Gift


    onLoad() {
        this.initRoot();
        this.initEvent();
    }

    private initRoot() {
        this._btnGift = cc.find("BtnGift", this.node).getComponent(cc.Button);
        this._btnGiftOn = cc.find("BtnGift/On", this.node)
        this._btnGiftOff = cc.find("BtnGift/Off", this.node)
        this._btnBag = cc.find("BtnBag", this.node).getComponent(cc.Button);
        this._btnBagOn = cc.find("BtnBag/On", this.node)
        this._btnBagOff = cc.find("BtnBag/Off", this.node)
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnGift, () => this.onBntGiftClick());
        UIEventCenter.ButtonEvent(this._btnBag, () => this.onBntBagClick());
    }


    private refreshTab() {
        switch (this.curTab) {
            case EnumGiftTab.Gift:
                {
                    this._btnGiftOn.active = true;
                    this._btnGiftOff.active = false;
                    this._btnBagOn.active = false;
                    this._btnBagOff.active = true;
                }
                break;
            case EnumGiftTab.Bag:
                {
                    this._btnGiftOn.active = false;
                    this._btnGiftOff.active = true;
                    this._btnBagOn.active = true;
                    this._btnBagOff.active = false;
                }
                break;
        }
        UIGift.Instance.ShowSubPanel(this.curTab);
    }

    private onBntGiftClick() {
        Clog.Trace(ClogKey.UI, "UIRoomGift >> onBntGiftClick")
        if (this.curTab == EnumGiftTab.Gift) {
            return;
        }
        this.curTab = EnumGiftTab.Gift;
        this.refreshTab();
    }

    private onBntBagClick() {
        Clog.Trace(ClogKey.UI, "UIRoomGift >> onBntBagClick")
        if (this.curTab == EnumGiftTab.Bag) {
            return;
        }
        this.curTab = EnumGiftTab.Bag;
        this.refreshTab();
    }
}
