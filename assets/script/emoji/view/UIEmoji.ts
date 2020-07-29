import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { EmojiItem } from "./EmojiItem";
import { EmojiController } from "../controller/EmojiController";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { EntryController } from "../../entry/controller/EntryController";
import { EnumUIOpenTween, EnumUICloseTween } from "../../../base/script/frame/ui/UIEnum";

export class UIEmoji extends UIBase {

    public PrefabName = "P_UIEmoji"
    public OpenTween = EnumUIOpenTween.DrawerBottomOpen;
    public CloseTween = EnumUICloseTween.DrawerBottomClose;

    private _item: cc.Node;
    private _grid: cc.Node;

    private allEmoji: Array<EmojiItem>
    private _btnMask: cc.Button;

    onLoad() {
        this.initRoot();
        this.initEvent();
    }
    start() {
        this.refreshPanelPosition();
    }
    private initRoot() {
        this._btnMask = cc.find("Mask", this.node).getComponent(cc.Button);
        this._item = cc.find("Main/Item", this.node)
        this._item.active = false
        this._grid = cc.find("Main/ScrollView/view/content", this.node)

        this.allEmoji = new Array<EmojiItem>();
        for (let index = 0, l = EmojiController.AllEmojisUniqueKeys.length; index < l; index++) {
            const emojiData = EmojiController.AllEmojisUniqueKeys[index];
            let node = cc.instantiate(this._item)
            node.setParent(this._grid)
            node.active = true;
            let item = node.addComponent(EmojiItem);
            item.Init(emojiData);
            this.allEmoji.push(item);
        }
    }

    private refreshPanelPosition() {
        //iphoneX的ui适应
        let bottomWidget = cc.find("Main", this.node).getComponent(cc.Widget);
        EntryController.IphoneXUIFit([bottomWidget], 20);
    }
    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnMask, () => this.onBtnMaskClick())
    }

    private onBtnMaskClick() {
        UIManager.CloseUI(UIEmoji)
    }
}