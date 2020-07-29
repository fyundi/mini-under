import { UIEventCenter } from "../../../../base/script/util/UIEventCenter";
import { ChatInputController } from "../../controller/ChatInputController";


export class ChatInput extends cc.Component {

    private _editBox: cc.EditBox;
    private _btnSend: cc.Button;
    private _btnClose: cc.Button;

    onLoad(): void {
        this.initRoot();
        this.initEvent();
    }

    start() {
        this.resetInput()
    }

    private initRoot(): void {
        this._btnClose = cc.find("BtnClose", this.node).getComponent(cc.Button)
        this._editBox = cc.find("Input/EditBox", this.node).getComponent(cc.EditBox);
        this._btnSend = cc.find("Input/BtnSend", this.node).getComponent(cc.Button);
    }

    private initEvent(): void {
        UIEventCenter.ButtonEvent(this._btnSend, () => this.onBtnSendClick())
        UIEventCenter.ButtonEvent(this._btnClose, () => this.onBtnCloseClick())
    }

    private onBtnSendClick() {
        let str = this._editBox.string;
        this.node.active = false;
        this.resetInput();
        ChatInputController.InputEnded(str);
    }

    private onBtnCloseClick(): void {
        this.node.active = false;
    }

    private resetInput() {
        this._editBox.string = ""
    }

    public setFocus() {
        this._editBox.focus();
    }
}