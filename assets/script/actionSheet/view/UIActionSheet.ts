import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { EnumUIOpenTween, EnumUICloseTween } from "../../../base/script/frame/ui/UIEnum";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { ActionSheetItem } from "./ActionSheetItem";
import { ActionSheetController } from "../controller/ActionSheetController";
import { EntryController } from "../../entry/controller/EntryController";

/**
 * 权限界面
 */
export class UIActionSheet extends UIBase {
    public static Instance: UIActionSheet;
    public PrefabName = 'P_UIActionSheet';
    public OpenTween = EnumUIOpenTween.PullUp;
    public CloseTween = EnumUICloseTween.PullDown;

    private _item: cc.Node; // 某一个item
    private _titleLabel: cc.Label; // 标题
    private _grid: cc.Node;
    private _btnMask: cc.Button;
    private _btnCancel: cc.Button;

    private allperateItem: Array<ActionSheetItem>;

    onLoad() {
        this.initRoot();
        this.initEvent();
    }
    start() {
        this.refreshPanelPosition();
    }
    private initRoot() {
        this._btnMask = cc.find("Mask", this.node).getComponent(cc.Button);
        this._btnCancel = cc.find("Content/Cancel/BtnThis", this.node).getComponent(cc.Button);
        this._titleLabel = cc.find("Content/Title/Label", this.node).getComponent(cc.Label);
        this._grid = cc.find("Content/Layout", this.node);

        this._item = cc.find("Content/Layout/Item", this.node);
        this._item.active = false;


        // let list = new Array<ActionSheetDataItem>();
        // list.push(...ActionSheetController.data.List);

        // let title = list.find(item => item.Action === EnumSheet.Title);
        if (ActionSheetController.data.Title)
            this._titleLabel.string = '' + ActionSheetController.data.Title;

        // // 删除title和cancel
        // list = list.filter(item => item.Action !== EnumSheet.Title && item.Action !== EnumSheet.Cancel);

        ActionSheetController.data.List.sort((a, b) => a.Id - b.Id);

        this.allperateItem = new Array<ActionSheetItem>();
        for (let index = 0; index < ActionSheetController.data.List.length; index++) {
            let data = ActionSheetController.data.List[index]
            let node = cc.instantiate(this._item);
            node.parent = this._grid;
            node.active = true;
            let item = node.addComponent(ActionSheetItem);
            item.Init(data);
            this.allperateItem.push(item);
        }
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnMask, () => this.onClickClose());
        UIEventCenter.ButtonEvent(this._btnCancel, () => this.onClickClose());
    }

    private onClickClose() {
        UIManager.CloseUI(UIActionSheet);
    }

    private refreshPanelPosition() {
        //iphoneX的ui适应
        let bottomWidget = cc.find("Content", this.node).getComponent(cc.Widget);
        EntryController.IphoneXUIFit([bottomWidget], 20);
    }
}