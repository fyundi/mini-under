import { GiftItem } from "./giftList/GiftItem";
import { XiYouGiftManager } from "../../../xiyou/controller/XiYouGiftManager";
import { GiftTarget } from "./giftTarget/GiftTarget";
import { Session } from "../../../login/model/SessionData";
import { SS } from "../../../../base/script/global/SS";
import { EventCommond } from "../../../other/EventCommond";
import { RoomController } from "../../../room/controller/RoomController";
import { XiYouGiftTable } from "../../../xiyou/config/XiYouGiftConfig";
import { UIEventCenter } from "../../../../base/script/util/UIEventCenter";
import { UIToast } from "../../../common/view/UIToast";
import { UICostTip } from "../tip/UICostTip";
import { UIManager } from "../../../../base/script/frame/ui/UIManager";
import { EnumXiyouItemType } from "../../../other/EnumCenter";

/*
 * @Description: 
 * @Author: luo.fei
 * @Date: 2020-04-26 18:54:15
 */
export class GiftPanel extends cc.Component {

    public static Instance: GiftPanel
    private _giftItem: cc.Node;
    private _giftRoot: cc.Node;
    private allGiftItem: Array<GiftItem>
    private _moneyLabel: cc.Label;

    private _goldLabel: cc.Label;
    private _charmLabel: cc.Label;
    private _vipLabel: cc.Label;
    private _bgWidget: cc.Widget;

    private _btnNumber: cc.Button;
    private _btnSend: cc.Button;
    private _giftNum: cc.Label;
    private _numberMenu: cc.Button
    private numberList = [1, 10, 30, 66, 188, 520, 1314];
    private _btnNumberItemList: Array<cc.Node> = [];


    onLoad() {
        GiftPanel.Instance = this;
        this.initRoot();
        this.initEvent();
        this.initGiftItems();
    }

    start() {
        this.refreshMoney();
        this.refreshGiftCharmValue();
        this.refreshGiftVipValue();
        this.refreshGiftNumber();
        this.refreshBgWidget();
    }

    onDestroy() {
        this.removeEvent();
    }

    private initRoot() {
        this._bgWidget = cc.find("Bg", this.node).getComponent(cc.Widget)
        let panelPlayers = cc.find("Players", this.node)
        panelPlayers.addComponent(GiftTarget)
        this._giftItem = cc.find("Gifts/GiftItem", this.node);
        this._giftItem.active = false;
        this._giftRoot = cc.find("Gifts/GiftRoot/view/content", this.node);
        this._moneyLabel = cc.find("BottomLayer/Money", this.node).getComponent(cc.Label);
        this._goldLabel = cc.find("BottomLayer/Gold", this.node).getComponent(cc.Label);
        this._btnNumber = cc.find("Btns/BtnNumber", this.node).getComponent(cc.Button);
        this._btnSend = cc.find("Btns/BtnSend", this.node).getComponent(cc.Button);
        this._numberMenu = cc.find("NumberMenu", this.node).getComponent(cc.Button);
        this._numberMenu.node.active = false;

        this._charmLabel = cc.find("Layout/CharmLabel", this.node).getComponent(cc.Label)
        this._vipLabel = cc.find("Layout/VIPLabel", this.node).getComponent(cc.Label)

        this._giftNum = cc.find("Btns/BtnNumber/Num", this.node).getComponent(cc.Label);
        for (let index = 0; index < this.numberList.length; index++) {
            const num = this.numberList[index];
            let btn = cc.find("NumberMenu/Layout/Item_" + num, this.node).getComponent(cc.Button);

            UIEventCenter.ButtonEvent(btn, () => {
                XiYouGiftManager.CurSendGiftInfo.Num = num;
                this.onSelectGiftNum();
            });
            this._btnNumberItemList.push(btn.node);
        }
    }

    private initGiftItems() {
        this.allGiftItem = new Array<GiftItem>();
        for (let index = 0; index < XiYouGiftTable.AllConfig.length; index++) {
            const config = XiYouGiftTable.AllConfig[index];
            const element = cc.instantiate(this._giftItem);
            element.setParent(this._giftRoot);
            let item = element.addComponent(GiftItem);
            item.Init(config);
            this.allGiftItem.push(item);
        }
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnNumber, () => this.onBtnNumberClick())
        UIEventCenter.ButtonEvent(this._btnSend, () => this.onBtnSendClick())
        UIEventCenter.ButtonEvent(this._numberMenu, () => this.onNumberMenuClick())
        SS.EventCenter.on(EventCommond.OnXiYouMoneyChange, this.refreshMoney, this)
    }

    private onNumberMenuClick() {
        this._numberMenu.node.active = !this._numberMenu.node.active
    }

    private removeEvent() {
        SS.EventCenter.off(EventCommond.OnXiYouMoneyChange, this.refreshMoney, this)
    }

    private refreshGiftNumber() {
        this._giftNum.string = XiYouGiftManager.CurSendGiftInfo.Num.toString();
    }

    private refreshMoney() {
        this._moneyLabel.string = Session.XiYou.Deposit.toString();
        this._goldLabel.string = Session.XiYou.Gold.toString();
    }

    private onBtnNumberClick() {
        this._numberMenu.node.active = !this._numberMenu.node.active
    }

    private refreshGiftCharmValue() {
        let config = XiYouGiftTable.GetGiftConfigById(XiYouGiftManager.CurSendGiftInfo.Id)
        if (!config) {
            this._charmLabel.node.active = false;
            return;
        }
        this._charmLabel.node.active = true;
        this._charmLabel.string = "魅力值+" + (config.Charm * XiYouGiftManager.CurSendGiftInfo.Num).toString()
    }

    private refreshGiftVipValue() {
        let config = XiYouGiftTable.GetGiftConfigById(XiYouGiftManager.CurSendGiftInfo.Id)
        if (!config) {
            this._vipLabel.node.active = false;
            return;
        }
        this._vipLabel.node.active = true;
        this._vipLabel.string = "VIP值+" + (config.VipValue * XiYouGiftManager.CurSendGiftInfo.Num).toString()
    }

    /**
     * 刷新数字按钮
     */
    private refreshBtnNumberItem() {
        // 选中的数字颜色不一样
        for (let index = 0; index < this._btnNumberItemList.length; index++) {
            this._btnNumberItemList[index].color = XiYouGiftManager.CurSendGiftInfo.Num === this.numberList[index] ? new cc.Color(102, 102, 102) : new cc.Color(34, 34, 34);
        }
    }

    public OnSelectGiftId() {
        this.allGiftItem.forEach(item => item.RefreshOnSelect())
        this.refreshGiftVipValue();
        this.refreshGiftCharmValue();
    }

    private onSelectGiftNum() {
        this.refreshGiftNumber();
        this.onNumberMenuClick();
        this.refreshGiftVipValue();
        this.refreshGiftCharmValue();
        this.refreshBtnNumberItem();
    }

    private async onBtnSendClick() {
        let config = XiYouGiftTable.GetGiftConfigById(XiYouGiftManager.CurSendGiftInfo.Id)

        //总cost=单价*总人数*礼物数量
        let cost = config.Price * XiYouGiftManager.CurSendGiftTarget.UIdList.length * XiYouGiftManager.CurSendGiftInfo.Num

        switch (config.Type) {
            case EnumXiyouItemType.XiyouCommodity:
                if (Session.XiYou.Deposit < cost) {
                    UIToast.Show("您的玩币不足，请返回大厅充值")
                    return
                }
                break
            case EnumXiyouItemType.XiyouProp:
                if (Session.XiYou.Gold < cost) {
                    UIToast.Show("您的金币不足")
                    return
                }
                break
        }

        if (XiYouGiftManager.CurSendGiftTarget.UIdList.indexOf(Session.BanBan.UId) >= 0) {
            UIToast.Show("不能送给自己")
            return
        }

        if (XiYouGiftManager.CurSendGiftTarget.UIdList.length <= 0) {
            UIToast.Show("未选择赠送的玩家")
            return
        }
        if (XiYouGiftManager.CurSendGiftInfo.Num <= 0) {
            UIToast.Show("礼物数据有误")
            return;
        }
        if (XiYouGiftManager.CurSendGiftInfo.Id <= 0) {
            UIToast.Show("礼物不存在")
            return;
        }

        this._btnSend.interactable = false
        await XiYouGiftManager.GiftSend();
        this._btnSend.interactable = true
    }


    private refreshBgWidget() {
        //除自己外的其它玩家
        let others = RoomController.Seats.filter(item => item.HasPlayer && item.UId != Session.BanBan.UId)
        //有玩家，背景显示全
        if (others.length > 0) {
            this._bgWidget.top = 0;
            this._bgWidget.bottom = 0;
            return
        }
        //没有玩家，因为隐藏了玩家选择列表，背景要显示小一点
        this._bgWidget.top = 110;
        this._bgWidget.bottom = 0;
    }
}