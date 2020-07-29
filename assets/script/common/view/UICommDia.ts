import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { EnumUIHierarchy } from "../../../base/script/frame/ui/UIEnum";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { EntryController } from "../../entry/controller/EntryController";





export class UICommDia extends UIBase {

    /**
     * 提供打开该界面的API静态方法,方便直接调用
     * @param title 文字标题
     * @param content 文字内容
     * @param onSure 确定按钮点击事件
     * @param onCancel 取消按钮点击事件
     */
    public static async Open(content: string, sureStr: string = '确定', cancelStr: string = '', onSure?: Function, onCancel?: Function) {
        let commDia = await UIManager.OpenUI(UICommDia) as UICommDia;
        commDia.OnOpen(content, sureStr, cancelStr, onSure, onCancel)
    }


    public PrefabName: string = "P_UICommDia"
    public HierarchyType: EnumUIHierarchy = EnumUIHierarchy.NetDlg
    private _content: cc.Label;
    private _btnSure: cc.Button;
    private _btnSureLabel: cc.Label;
    private _btnCancel: cc.Button;
    private _btnCancelLabel: cc.Label;

    onLoad() {
        this._content = cc.find("Bg/Content", this.node).getComponent(cc.Label);
        this._btnSure = cc.find("Bg/BtnLayout/BtnSure", this.node).getComponent(cc.Button);
        this._btnSureLabel = cc.find("Bg/BtnLayout/BtnSure/Label", this.node).getComponent(cc.Label);
        this._btnCancel = cc.find("Bg/BtnLayout/BtnCancel", this.node).getComponent(cc.Button);
        this._btnCancelLabel = cc.find("Bg/BtnLayout/BtnCancel/Label", this.node).getComponent(cc.Label);
    }
    start()
    {
        this.refreshPanelPosition();
    }

    private OnOpen(content: string, sureStr: string, cancelStr: string, onSure?: Function, onCancel?: Function) {
        this._content.string = '' + content;

        this._btnSureLabel.string = '' + sureStr;
        this._btnSure.node.active = !!sureStr;
        UIEventCenter.ButtonEvent(this._btnSure, () => {
            if (onSure) onSure();
            UIManager.CloseUI(UICommDia);
        });

        this._btnCancelLabel.string = '' + cancelStr;
        this._btnCancel.node.active = !!cancelStr;
        UIEventCenter.ButtonEvent(this._btnCancel, () => {
            if (onCancel) onCancel();
            UIManager.CloseUI(UICommDia);
        });
    }

    private refreshPanelPosition() {
        //iphoneX的ui适应
        let bottomWidget=cc.find("Bg", this.node).getComponent(cc.Widget);               
        EntryController.IphoneXUIFit([bottomWidget],20);
    }

}