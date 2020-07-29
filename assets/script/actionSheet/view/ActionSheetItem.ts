import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { ActionSheetDataItem } from "../model/ActionSheetData";

export class ActionSheetItem extends cc.Component {
    private data: ActionSheetDataItem;

    private _btnThis: cc.Button;
    private _label: cc.Label;

    public Init(data: ActionSheetDataItem) {
        this.data = data;

        this.initRoot();
        this.initEvent();
        this.refreshAll();
    }

    private initRoot() {
        this._btnThis = cc.find("BtnThis", this.node).getComponent(cc.Button);
        this._label = cc.find("Label", this.node).getComponent(cc.Label);
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnThis, () => this.onThisClick());
    }

    private refreshAll() {
        this._label.string = this.data.Desc;
    }


    private async onThisClick() {
        if (this.data.Action != null) {
            this.data.Action();
        }
    }

}