import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { EnumUIOpenTween, EnumUICloseTween } from "../../../base/script/frame/ui/UIEnum";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { JoinMicController } from "../../room/controller/JoinMicController";
import { SS } from "../../../base/script/global/SS";
import { UIUtil } from "../../../base/script/frame/ui/UIUtil";
import { Session } from "../../login/model/SessionData";
import { EnumSex } from "../../other/EnumCenter";
import { MicWaitController } from "../controller/MicWaitController";
import { MicWaitData } from "../model/MicWaitData";

export class UIMicWaiting extends UIBase {
    public PrefabName = "P_UIMicWaiting";
    public OpenTween = EnumUIOpenTween.NormalOpen;
    public CloseTween = EnumUICloseTween.NormalClose;

    private _userIcon: cc.Sprite;
    private _userName: cc.Label;
    private _vipNode:cc.Node;
    private _vipLabel: cc.Label;
    private _sexNode:cc.Node;
    private _sexIcon: cc.Sprite;
    private _datelineLabel: cc.Label;

    private _btnMask: cc.Button;
    private _btnCancel: cc.Button;

    private data:MicWaitData;

    onLoad() {
        this.initRoot();
        this.initEvent();
        this.initData();
    }

    start() {
        this.onRefresh();
    }

    onDestroy() {
        this.removeEvent();
    }

    initRoot() {
        this._btnMask = cc.find("Mask", this.node).getComponent(cc.Button);
        this._btnCancel = cc.find("Bg/cancelBtn", this.node).getComponent(cc.Button);
        this._userIcon = cc.find("Bg/item/Icon/Ring/Mask/Icon", this.node).getComponent(cc.Sprite);  
        this._userName = cc.find("Bg/item/NameLabel", this.node).getComponent(cc.Label);
        this._sexNode = cc.find("Bg/item/Layout/SexAge", this.node);
        this._sexIcon = cc.find("Bg/item/Layout/SexAge/Sprite", this.node).getComponent(cc.Sprite);
        this._vipNode = cc.find("Bg/item/Layout/Vip", this.node);
        this._vipLabel = cc.find("Bg/item/Layout/Vip/Label", this.node).getComponent(cc.Label);
        this._datelineLabel = cc.find("Bg/item/dateline", this.node).getComponent(cc.Label); 
    }

    initEvent() {
        UIEventCenter.ButtonEvent(this._btnMask, () => this.onBtnMaskClick());
        UIEventCenter.ButtonEvent(this._btnCancel, () => this.onBtnCancelClick());
    }

    initData()
    {
        for(let i=0;i<MicWaitController.JoinMicWaitList.length;i++)
        {
            if(MicWaitController.JoinMicWaitList[i].UId==Session.BanBan.UId)
            {
                this.data=MicWaitController.JoinMicWaitList[i];
                break;
            }
        }
    }

    private async onBtnCancelClick() {
        await MicWaitController.JoinMicWaitCancel();
        UIManager.CloseUI(UIMicWaiting);
    }

    private onBtnMaskClick() {   
        UIManager.CloseUI(UIMicWaiting);
    }

    removeEvent() {

    }

    onRefresh() {
        this.refreshUserIcon();
        this.refreshUserName();
        this.refreshUserVip();
        this.refreshUserSex();
        this.refreshTime();
    }
    //刷新用户头像
    private refreshUserIcon() {
        let url = SS.ImageUrlProxy + this.data.Icon;
        UIUtil.LoadRemoteImage(url, this._userIcon)
    }

    //刷新玩家性别
    private refreshUserSex() {
        switch (this.data.Sex) {
            case EnumSex.Unknow:
                {
                    this._sexNode.active=false;
                    return;
                }
            case EnumSex.Female:
                {
                    this._sexNode.active=true;
                    UIUtil.ChangeSprite("T_Com_Female", this._sexIcon)
                    return;
                }
            case EnumSex.Male:
                {
                    this._sexNode.active=true;
                    UIUtil.ChangeSprite("T_Com_Male", this._sexIcon)
                    return;
                }
        }
    }

    //刷新用户名称
    private refreshUserName() {
        this._userName.string = this.data.Name;
    }

    private refreshUserVip() {
        if(this.data.VipNew>0)
        {
            this._vipNode.active=true;
        }
        else
        {
            this._vipNode.active=false;
        }
        this._vipLabel.string = this.data.VipNew.toString();
    }

    //
    private refreshTime() {
        this._datelineLabel.string=this.data.Dateline;
    }

}