import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { EnumUIOpenTween, EnumUICloseTween } from "../../../base/script/frame/ui/UIEnum";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { UIUtil } from "../../../base/script/frame/ui/UIUtil";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { GiftWallItem } from "./GiftWallItem";
import { SS } from "../../../base/script/global/SS";
import { EnumSex } from "../../other/EnumCenter";
import { XiYouGiftManager } from "../../xiyou/controller/XiYouGiftManager";
import { UIGift } from "../../sendGift/view/main/UIGift";
import { UserDetailController } from "../controller/UserDetailController";
import { GiftTargetData } from "../../sendGift/model/GiftTargetData";
import { EntryController } from "../../entry/controller/EntryController";
import { XiyouSDK } from "../../xiyou/xiyouSDK/XiyouSDK";
import { XiYouUserDetailController } from "../../xiyou/controller/XiYouUserInfoController";
import { XiyouUserInfoData } from "../../xiyou/model/XiyouUserInfoData";
import { Session } from "../../login/model/SessionData";
import { XiyouAddFriendController } from "../../xiyou/controller/XiyouAddFriendController";
import { BanBanUserInfo } from "../model/UserDetailData";
import { UIToast } from "../../common/view/UIToast";


/**
 * 用户详细信息面板
 */
export class UIUserDetail extends UIBase {

    public PrefabName = 'P_UIUserDetail'
    public OpenTween = EnumUIOpenTween.NormalOpen;
    public CloseTween = EnumUICloseTween.NormalClose;

    private _userIcon: cc.Sprite;
    private _userName: cc.Label;

    private get xiyouData(): XiyouUserInfoData {
        return UserDetailController.CurXiyouUserInfo;
    }

    private get banbanData(): BanBanUserInfo {
        return UserDetailController.CurBanBanUserDetail;
    }

    private _vipLabel: cc.Label;
    private _giftCount: cc.Label;
    private _sexIcon: cc.Sprite;
    private _cityLabel: cc.Label;
    private _ageLabel: cc.Label;
    private _charmLabel: cc.Label;
    private _giftWallItem: cc.Node;
    private _grid: cc.Node;
    private _noGiftTip: cc.Node;
    private _btnSend: cc.Button;        //送礼物按钮
    private _btnAddFriend: cc.Button;    //加好友按钮
    private _btnMask: cc.Button;
    private _content: cc.Node;
    private allGiftWallItem: Array<GiftWallItem> = new Array<GiftWallItem>();

    onLoad() {
        this.initRoot();
        this.initEvent();
    }

    start() {
        this.refreshPanelPosition();
        this.refresh();
    }

    //初始化UI节点
    private initRoot() {
        this._content = cc.find("Content", this.node)
        this._content.active = false;
        this._vipLabel = cc.find("Content/Layout/VIP/Number", this.node).getComponent(cc.Label);
        this._charmLabel = cc.find("Content/Layout/Charm/Number", this.node).getComponent(cc.Label);
        this._giftCount = cc.find("Content/Layout/Gift/Number", this.node).getComponent(cc.Label);
        this._cityLabel = cc.find("Content/InfoLayout/City/Label", this.node).getComponent(cc.Label);
        this._btnMask = cc.find("Mask", this.node).getComponent(cc.Button);
        this._userIcon = cc.find("Content/Icon/Ring/Mask/Icon", this.node).getComponent(cc.Sprite);
        this._userName = cc.find("Content/NameLabel", this.node).getComponent(cc.Label);
        this._sexIcon = cc.find("Content/InfoLayout/Info/SexIcon", this.node).getComponent(cc.Sprite);
        this._ageLabel = cc.find("Content/InfoLayout/Info/Label", this.node).getComponent(cc.Label);
        this._giftWallItem = cc.find("Content/GiftWall/Item", this.node);
        this._giftWallItem.active = false;
        this._noGiftTip = cc.find("Content/NoGiftTip", this.node)
        this._grid = cc.find("Content/GiftWall/ScrollView/view/content", this.node);
        this._btnSend = cc.find("Content/BtnLayout/BtnSend", this.node).getComponent(cc.Button);
        this._btnAddFriend = cc.find("Content/BtnLayout/BtnAddFriend", this.node).getComponent(cc.Button);
    }


    private refreshGiftWall() {
        if (this.xiyouData.GiftWallInfo.length <= 0) {
            this._grid.active = false;
            this._noGiftTip.active = true;
            return;
        }
        this._grid.active = true;
        this._noGiftTip.active = false;
        this.allGiftWallItem = new Array<GiftWallItem>();
        for (let index = 0; index < this.xiyouData.GiftWallInfo.length; index++) {
            let data = this.xiyouData.GiftWallInfo[index];
            let element = cc.instantiate(this._giftWallItem);
            element.setParent(this._grid);
            let item = element.addComponent(GiftWallItem);
            item.Init(data);
            this.allGiftWallItem.push(item);
        }
        if (this.allGiftWallItem.length <= 0) {
            return;
        }
        this.allGiftWallItem.forEach(item => item.Refresh())
    }

    //初始化面板事件
    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnMask, () => this.onBtnMaskClick());
        UIEventCenter.ButtonEvent(this._btnSend, () => this.onBtnSendClick());
        UIEventCenter.ButtonEvent(this._btnAddFriend, () => this.onBtnAddFriendClick());
    }

    private async onBtnAddFriendClick() {
        let isOK = await XiyouAddFriendController.AddFriend(this.banbanData.MomoId)
        if (isOK) {
            this.xiyouData.WhetherFriends = true;
            this.refrshIsShowAddFriendBtn();
        }
    }

    //刷新整个界面
    private async refresh() {
        let isOK = await UserDetailController.GetUserDetail()
        if (!isOK) {
            UIManager.CloseUI(UIUserDetail)
            return;
        }
        this._content.active = true;
        this.refreshUserIcon();
        this.refreshUserName();
        this.refreshUserVip();
        this.refreshUserSex();
        this.refreshGiftWall();
        this.refreshCharmLabel();
        this.refreshGiftCount();
        this.refrshCity();
        this.refreshAge();
        this.refrshIsShowAddFriendBtn();
    }

    private refrshIsShowAddFriendBtn() {
        this._btnAddFriend.node.active = !this.xiyouData.WhetherFriends
    }

    private refrshCity() {
        this._cityLabel.string = this.xiyouData.City;
    }

    //刷新用户头像
    private refreshUserIcon() {
        let url = SS.ImageUrlProxy + this.banbanData.Icon
        UIUtil.LoadRemoteImage(url, this._userIcon)
    }

    //刷新玩家性别
    private refreshUserSex() {
        switch (this.xiyouData.Sex) {
            case EnumSex.Unknow:
                {
                    this._sexIcon.node.active = false;
                    return;
                }
            case EnumSex.Female:
                {
                    UIUtil.ChangeSprite("T_Info_Female", this._sexIcon)
                    return;
                }
            case EnumSex.Male:
                {
                    UIUtil.ChangeSprite("T_Info_Male", this._sexIcon)
                    return;
                }
        }
    }

    private refreshAge() {
        this._ageLabel.string = this.xiyouData.Age.toString() + " " + this.xiyouData.Constellation
    }

    //刷新用户名称
    private refreshUserName() {
        this._userName.string = this.xiyouData.NickName;
    }

    private refreshUserVip() {
        this._vipLabel.string = this.xiyouData.VipValue.toString();
    }

    private refreshCharmLabel() {
        this._charmLabel.string = this.xiyouData.Charm.toString();
    }

    private refreshGiftCount() {
        this._giftCount.string = this.xiyouData.GiftCount.toString();
    }

    //送礼物按钮点击事件
    private onBtnSendClick() {
        Clog.Trace(ClogKey.UI, "OnBtnSendClick")
        //将其它所有玩家的选中态设为false,该玩家的选中态设为true
        XiYouGiftManager.CurSendGiftTarget = new GiftTargetData().Add(UserDetailController.TargetUserId);
        UIManager.OpenUI(UIGift);
        UIManager.CloseUI(UIUserDetail);
    }

    //背景masK点击事件
    private onBtnMaskClick() {
        Clog.Trace(ClogKey.UI, "onBtnMaskClick")
        UIManager.CloseUI(UIUserDetail);
    }

    private refreshPanelPosition() {
        //iphoneX的ui适应
        let bottomWidget = cc.find("Content", this.node).getComponent(cc.Widget);
        EntryController.IphoneXUIFit([bottomWidget], 20);
    }

}