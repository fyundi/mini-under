

import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { EnumUIRoomManagerTab, EnumPurview } from "../../other/EnumCenter";
import { RoomAdminController } from "../controller/RoomAdminController";
import { AdminInfoItem } from "./AdminInfoItem";
import { OnlineInfoItem } from "./OnlineInfoItem";
import { RoomAdminData, RoomOlineData } from "../model/RoomAdminData";
import { RoomController } from "../../room/controller/RoomController";


export class UIRoomAdmin extends UIBase {

    public PrefabName = "P_UIRoomAdmin"

    private _mask: cc.Button;
    private _item: cc.Node;
    private _scrollview: cc.Node;       //多个scrollview不好用，因为被隐藏的scrollview会能挡住点击事件
    private _tabOnline: cc.Button;
    private _tabAdmin: cc.Button;
    private _tabOnlineOn: cc.Node;
    private _tabOnlineOff: cc.Node;
    private _tabAdminOn: cc.Node;
    private _tabAdminOff: cc.Node;
    private _tip: cc.Node;

    private allRoomAdminItem: Array<AdminInfoItem> = new Array<AdminInfoItem>()
    private allRoomOnlineItem: Array<OnlineInfoItem> = new Array<OnlineInfoItem>()

    onLoad() {
        this.initRoot();
        this.initEvent();
    }

    start(){
        this.refresh();
    }

    private initRoot() {
        this._mask = cc.find("Mask", this.node).getComponent(cc.Button)
        this._item = cc.find("Main/Item", this.node)
        this._item.active = false;
        this._scrollview = cc.find("Main/ScrollView/view/content", this.node)
        this._scrollview.active = false;
        this._tabOnline = cc.find("Main/Tab/Online", this.node).getComponent(cc.Button);
        this._tabAdmin = cc.find("Main/Tab/Admin", this.node).getComponent(cc.Button);
        this._tip = cc.find("Main/Tip", this.node)
        this._tip.active = false;
        this._tabOnlineOn = cc.find("Main/Tab/Online/On", this.node)
        this._tabOnlineOff = cc.find("Main/Tab/Online/Off", this.node)
        this._tabAdminOn = cc.find("Main/Tab/Admin/On", this.node)
        this._tabAdminOff = cc.find("Main/Tab/Admin/Off", this.node)
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._mask, () => this.onBtnMaskClick())
        UIEventCenter.ButtonEvent(this._tabOnline, () => { this.onTabOnlineClick() })
        UIEventCenter.ButtonEvent(this._tabAdmin, () => { this.onTabAdminClick() })
    }

    private onBtnMaskClick() {
        UIManager.CloseUI(UIRoomAdmin)
    }

    private onTabOnlineClick() {
        this._tabOnlineOn.active = true
        this._tabOnlineOff.active = false
        this._tabAdminOn.active = false
        this._tabAdminOff.active = true
        this._scrollview.active = true
        this._tip.active = false
        this.allRoomOnlineItem.forEach(item => item.node.active = true)
        this.allRoomAdminItem.forEach(item => item.node.active = false)
    }

    private onTabAdminClick() {
        this._tabOnlineOn.active = false
        this._tabOnlineOff.active = true
        this._tabAdminOn.active = true
        this._tabAdminOff.active = false

        //只有房主能查看管理员
        if (RoomController.Purview == EnumPurview.Createor) {
            this._scrollview.active = true
            this._tip.active = false
            this.allRoomOnlineItem.forEach(item => item.node.active = false)
            this.allRoomAdminItem.forEach(item => item.node.active = true)
        }
        else {
            this._tip.active = true
            this._scrollview.active = false
        }
    }


    private async refresh() {
        await this.refreshAdminItem();
        await this.refreshOnlineItem();
        this.onTabOnlineClick();   //开始时，默认切到online页签
    }

    private async refreshOnlineItem() {
        let isOk = await RoomAdminController.GetRoomOnlineInfo();
        if (!isOk) {
            return;
        }
        this.allRoomOnlineItem = new Array<OnlineInfoItem>();
        for (let index = 0; index < RoomAdminController.AllOnlineInfo.length; index++) {
            const data: RoomOlineData = RoomAdminController.AllOnlineInfo[index];
            let node = cc.instantiate(this._item);
            node.setParent(this._scrollview)
            let item = node.addComponent(OnlineInfoItem)
            item.Init(data);
            this.allRoomOnlineItem.push(item)
        }
    }

    private async refreshAdminItem() {
        //只有房主才能看管理员
        if (RoomController.Purview != EnumPurview.Createor) {
            return
        }

        let isOk = await RoomAdminController.GetRoomAdminInfo();
        if (!isOk) {
            return;
        }

        this.allRoomAdminItem = new Array<AdminInfoItem>();
        for (let index = 0; index < RoomAdminController.AllAdminInfo.length; index++) {
            const data: RoomAdminData = RoomAdminController.AllAdminInfo[index];
            let node = cc.instantiate(this._item);
            node.setParent(this._scrollview)
            let item = node.addComponent(AdminInfoItem)
            item.Init(data);
            this.allRoomAdminItem.push(item)
        }
    }




}