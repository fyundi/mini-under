export class RoomKick extends cc.Component {

    private _label: cc.Label;           //文字
    private initRoot(): void {
        this._label = cc.find("Label", this.node).getComponent(cc.Label);
    }

   
    public Init(data:string): void {
        this.initRoot();
        //刷新聊天内容
        this._label.string = data;
        this._label.node.color = new cc.Color(180, 180, 180, 255);

        (this._label as any)._forceUpdateRenderData();
        if (this._label.node.width > 616) {
            this._label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this._label.node.width = 616;
            (this._label as any)._forceUpdateRenderData();
        }
        else {
            this._label.overflow = cc.Label.Overflow.NONE;
            (this._label as any)._forceUpdateRenderData();
        }
    }
}
