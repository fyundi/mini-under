import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { EnumUIHierarchy, EnumUICloseTween, EnumUIOpenTween } from "../../../base/script/frame/ui/UIEnum";
import { RoomController } from "../../room/controller/RoomController";
import { ThemeItem } from "./ThemeItem";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { EntryController } from "../../entry/controller/EntryController";


/**
 * 设置房间主题界面
 */
export class UITheme extends UIBase {

    public PrefabName: string = "P_UITheme"
    public HierarchyType: EnumUIHierarchy = EnumUIHierarchy.Normal;
    public OpenTween = EnumUIOpenTween.PullUp;
    public CloseTween = EnumUICloseTween.PullDown;

    private _maskBtn: cc.Button;
    private _contentLayout: cc.Layout;

    private _item: cc.Node;

    onLoad() {
        this.initRoot();
        this.initList();
    }

    start() {
        this.refresh();
    }

    private initRoot() {
        this._maskBtn = cc.find('Mask', this.node).getComponent(cc.Button);
        this._contentLayout = cc.find('Main/ScrollView/View/Content', this.node).getComponent(cc.Layout);
        this._item = cc.find('Main/ScrollView/View/Content/Item', this.node);
        this._item.active = false;
        UIEventCenter.ButtonEvent(this._maskBtn, () => this.onClose());
    }

    private initList() {
        let list = RoomController.CurRoom.ThemeSwitchBackground;
        for (var i = 0, l = list.length; i < l; i++) {
            let child = cc.instantiate(this._item);
            child.parent = this._contentLayout.node;
            child.active = true;
            let script = child.addComponent(ThemeItem);
            script.Init(list[i]);
        }
    }

    private onClose() {
        UIManager.CloseUI(UITheme);
    }

    private refresh() {
        //iphoneX的ui适应
        let bottomWidget = cc.find("Main", this.node).getComponent(cc.Widget);
        EntryController.IphoneXUIFit([bottomWidget], 20);
    }
}