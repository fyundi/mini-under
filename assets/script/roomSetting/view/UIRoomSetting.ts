import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { IsNullOrEmpty } from "../../../base/script/util/StringUtil";
import { RoomSettingController } from "../controller/RoomSettingController";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { UIToast } from "../../common/view/UIToast";
import { RoomController } from "../../room/controller/RoomController";
import { EntryController } from "../../entry/controller/EntryController";

/**
 * 设置房间公告界面
 */
export class UIRoomSetting extends UIBase {
    public PrefabName = "P_UIRoomSetting"
    private _mask: cc.Button;
    private _titleEditor: cc.EditBox;
    private _contentEditor: cc.EditBox;
    /** 密码输入框 */
    private _lockEditor: cc.EditBox;
    private _btnSure: cc.Button;
    private _btnCancel: cc.Button;

    onLoad() {
        this.initRoot();
        this.initEvent();
    }
    start() {
        this.refresh();
    }
    private initRoot() {
        this._mask = cc.find("Mask", this.node).getComponent(cc.Button)
        this._titleEditor = cc.find("Main/TitleInput/EditBox", this.node).getComponent(cc.EditBox);
        this._contentEditor = cc.find("Main/ContentInput/EditBox", this.node).getComponent(cc.EditBox);
        this._lockEditor = cc.find("Main/LockInput/EditBox", this.node).getComponent(cc.EditBox);
        this.resetInput();
        this._btnSure = cc.find("Main/Layout/BtnSure", this.node).getComponent(cc.Button);
        this._btnCancel = cc.find("Main/Layout/BtnCancel", this.node).getComponent(cc.Button);

    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._mask, () => this.onBtnMaskClick())
        UIEventCenter.ButtonEvent(this._btnSure, () => this.onBtnSureClick())
        UIEventCenter.ButtonEvent(this._btnCancel, () => this.onBtnCancelClick())
    }

    private onBtnMaskClick() {
        UIManager.CloseUI(UIRoomSetting)
    }

    private async onBtnSureClick() {
        if (IsNullOrEmpty(this._titleEditor.string)) {
            UIToast.Show("房间名称不能为空")
            return
        }

        if (IsNullOrEmpty(this._contentEditor.string)) {
            UIToast.Show("房间公告不能为空")
            return
        }

        if (this._lockEditor.string.length > 0 &&
            (this._lockEditor.string.length != 4 ||
                isNaN(parseInt(this._lockEditor.string)))) {
            UIToast.Show("密码只能是4位数字")
            return
        }

        Clog.Green(ClogKey.UI, "title:" + this._titleEditor.string + "\n content:" + this._contentEditor.string);
        RoomSettingController.RoomInfoSetting(this._titleEditor.string, this._contentEditor.string, this._lockEditor.string)
        UIManager.CloseUI(UIRoomSetting)
    }

    private onBtnCancelClick() {
        UIManager.CloseUI(UIRoomSetting)
    }

    private resetInput() {
        this._titleEditor.string = RoomController.CurRoom.RoomName;
        this._contentEditor.string = RoomController.CurRoom.Description;
        this._lockEditor.string = RoomController.CurRoom.Password;
    }

    private refresh() {
        //iphoneX的ui适应
        let bottomWidget = cc.find("Main", this.node).getComponent(cc.Widget);
        EntryController.IphoneXUIFit([bottomWidget], 20);
    }
}