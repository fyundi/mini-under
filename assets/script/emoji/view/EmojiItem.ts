import { EmojiData } from "../model/EmojData";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { UIUtil } from "../../../base/script/frame/ui/UIUtil";
import { SS } from "../../../base/script/global/SS";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { UIEmoji } from "./UIEmoji";
import { EmojiController } from "../controller/EmojiController";

export class EmojiItem extends cc.Component {

    private data: EmojiData

    private _icon: cc.Sprite;
    private _label: cc.Label;
    private _btnThis: cc.Button;

    Init(data: EmojiData) {
        this.data = data;
        this.initRoot();
        this.initEvent();
        this.refreshIcon();
        this.refreshName();
    }

    private initRoot() {
        this._icon = cc.find("Icon", this.node).getComponent(cc.Sprite)
        this._label = cc.find("Label", this.node).getComponent(cc.Label)
        this._btnThis = this.node.getComponent(cc.Button)
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnThis, () => { this.onBtnThisClick() })
    }

    private onBtnThisClick() {
        EmojiController.SendEmojiByKey(this.data.Key);
        UIManager.CloseUI(UIEmoji);
    }

    private refreshIcon() {
        UIUtil.ChangeSprite('emoji/' + this.data.Key, this._icon);

        // //参考地址http://xs-image-proxy.oss-cn-hangzhou.aliyuncs.com/static/emote_new/smill_new.png
        // let url = SS.ImageUrlProxy + "static/emote_new/" + this.data.Key + ".png"
        // UIUtil.LoadRemoteImage(url, this._icon)
    }

    private refreshName() {
        this._label.string = this.data.Name
    }
}