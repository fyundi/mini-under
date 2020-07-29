
import { UIUtil } from "../../../base/script/frame/ui/UIUtil";
import { SS } from "../../../base/script/global/SS";
import { BanBanData } from "../../login/model/BanBanData";
import { EnumSex } from "../../other/EnumCenter";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { JoinMicController } from "../../room/controller/JoinMicController";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { UIMicWaitList } from "./UIMicWaitList";
import { UIToast } from "../../common/view/UIToast";
import { MicWaitData } from "../model/MicWaitData";
import { MicWaitController } from "../controller/MicWaitController";
import Clog from "../../../base/script/frame/clog/Clog";


/**
 * 排麦列表的个人信息
 */
export class UIMicWaitItem extends cc.Component {

    private data: MicWaitData;
    private _userIcon: cc.Sprite;
    private _userName: cc.Label;
    private _sexNode: cc.Node;
    private _sexIcon: cc.Sprite;
    private _vipNode: cc.Node;
    private _vipLabel: cc.Label;
    private _timeLabel: cc.Label;
    private _btnJoinMic:cc.Button;
    
    public Init(data:MicWaitData) {
        this.data = data;
        this.node.active = true;
        this.initRoot();
        this.initEvent();
        this.Refresh();
    }

    //初始化节点
    private initRoot() {
        this._userIcon = cc.find("Icon/Ring/Mask/Icon", this.node).getComponent(cc.Sprite);
        this._userName = cc.find("NameLabel", this.node).getComponent(cc.Label);
        this._sexNode = cc.find("Layout/SexAge", this.node);
        this._sexIcon = cc.find("Layout/SexAge/Sprite", this.node).getComponent(cc.Sprite);
        this._vipNode = cc.find("Layout/Vip", this.node); 
        this._vipLabel = cc.find("Layout/Vip/Label", this.node).getComponent(cc.Label);  
        this._timeLabel = cc.find("dateline", this.node).getComponent(cc.Label);   
        this._btnJoinMic = cc.find("micBtn", this.node).getComponent(cc.Button);
    }

    initEvent() {
        UIEventCenter.ButtonEvent(this._btnJoinMic, () => this.onBtnJoinMicClick());
    }

    async onBtnJoinMicClick()
    {       
        let issuccess = await MicWaitController.JoinMic(this.data.UId);
        if(issuccess)
        {
            UIToast.Show("操作成功");
        } 
        UIManager.CloseUI(UIMicWaitList);        
        MicWaitController.micWaitListCheck();        
    }

    public Refresh() {
        this.refreshUserIcon();
        this.refreshUserSex();
        this.refreshUserName();
        this.refreshUserVip();
        this.refreshTime();
    }


    //刷新用户头像
    private refreshUserIcon() {
        let url = SS.ImageUrlProxy + this.data.Icon
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

    private refreshTime() {
        this._timeLabel.string=this.data.Dateline;
    }


}