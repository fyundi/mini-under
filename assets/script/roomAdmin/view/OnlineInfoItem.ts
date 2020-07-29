import { RoomAdminData, RoomOlineData } from "../model/RoomAdminData";
import { UIUtil } from "../../../base/script/frame/ui/UIUtil";
import { SS } from "../../../base/script/global/SS";
import { EnumSex, EnumPurview } from "../../other/EnumCenter";
import { StringLimit } from "../../../base/script/util/StringUtil";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { ActionSheetController } from "../../actionSheet/controller/ActionSheetController";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { UIRoomAdmin } from "./UIRoomAdmin";
import { Session } from "../../login/model/SessionData";
import { RoomStyle } from "../../other/RoomStyle";



export class OnlineInfoItem extends cc.Component {

    private data: RoomOlineData

    private _btnThis: cc.Button;
    private _nameLabel: cc.Label;
    private _icon: cc.Sprite;
    private _sexAgeBg: cc.Node;
    private _ageLabel: cc.Label;
    private _sexIcon: cc.Sprite;
    private _tagAdmin: cc.Node;
    private _tagAdminLabel: cc.Label;
    private _tagOnMic: cc.Node;
    private _tagVip: cc.Node;
    private _vipBg: cc.Node;
    private _tagVipLabel: cc.Label;

    public Init(data: RoomOlineData) {
        this.data = data;
        this.node.active = true;
        this.initRoot();
        this.initEvent();
        this.refresh();
    }

    private initRoot() {
        this._btnThis = cc.find("Button", this.node).getComponent(cc.Button);
        this._icon = cc.find("Mask/Icon", this.node).getComponent(cc.Sprite);
        this._nameLabel = cc.find("Name", this.node).getComponent(cc.Label);
        this._sexAgeBg = cc.find("Layout/TagSexAge/Bg", this.node)
        this._sexIcon = cc.find("Layout/TagSexAge/Sex", this.node).getComponent(cc.Sprite);
        this._ageLabel = cc.find("Layout/TagSexAge/Age", this.node).getComponent(cc.Label);
        this._ageLabel.node.active = false;
        this._tagAdmin = cc.find("Layout/TagAdmin", this.node)
        this._tagAdminLabel = cc.find("Layout/TagAdmin/Label", this.node).getComponent(cc.Label);
        this._tagOnMic = cc.find("Layout/TagOnMic", this.node)
        this._tagVip = cc.find("Layout/TagVip", this.node)
        this._vipBg = cc.find("Layout/TagVip/Bg", this.node)
        this._tagVipLabel = cc.find("Layout/TagVip/Label", this.node).getComponent(cc.Label);
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnThis, () => this.onBtnThisClick())
    }

    private async onBtnThisClick() {
        Clog.Green(ClogKey.UI, "OnlineInfoItem onBtnThisClick");
        if (Session.BanBan.UId == this.data.UId) {
            Clog.Green(ClogKey.UI, "OnlineInfoItem 点击自己");
            return;
        }
        ActionSheetController.SetOnline(this.data)
        UIManager.CloseUI(UIRoomAdmin)
    }

    private refresh() {
        this.refreshIcon();
        this.refreshSexIcon();
        this.refreshAgeLabel();
        this.refreshTagAdmin();
        this.refreshTagOnMic();
        this.refreshTagVip();
        this.refreshNameLabel();
    }

    private refreshNameLabel() {
        this._nameLabel.string = StringLimit(this.data.Name, 16);
    }

    private refreshIcon() {
        let url = SS.ImageUrlProxy + this.data.Icon;
        UIUtil.LoadRemoteImage(url, this._icon);
    }

    private refreshSexIcon() {
        switch (this.data.Sex) {
            case EnumSex.Unknow:
                {
                    this._sexIcon.node.active = false;
                    return;
                }
            case EnumSex.Female:
                {
                    UIUtil.ChangeSprite("T_Com_Female", this._sexIcon)
                    this._sexAgeBg.color = new cc.Color(255, 100, 255, 255)
                    return;
                }
            case EnumSex.Male:
                {
                    UIUtil.ChangeSprite("T_Com_Male", this._sexIcon)
                    this._sexAgeBg.color = new cc.Color(75, 110, 255, 255)
                    return;
                }
        }
    }

    private refreshAgeLabel() {
        this._ageLabel.string = this.data.Age.toString();
    }

    private refreshTagAdmin() {
        switch (this.data.Role) {
            case EnumPurview.Createor:
                {
                    this._tagAdmin.active = true;
                    this._tagAdminLabel.string = '房主'
                    return;
                }
            case EnumPurview.Admin:
                {
                    this._tagAdmin.active = true;
                    this._tagAdminLabel.string = '管理'
                    return;
                }
            default:
                this._tagAdmin.active = false;
        }
    }

    private refreshTagOnMic() {
        this._tagOnMic.active = this.data.Mic != 0;
    }

    private refreshTagVip() {
        if (this.data.Vip <= 0) {
            this._tagVip.active = false;
            return;
        }
        this._tagVip.active = true;
        this._vipBg.color = RoomStyle.VipColor(this.data.Vip)
        this._tagVipLabel.string = this.data.Vip.toString()
    }
}


