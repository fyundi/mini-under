import { RoomController } from "../../controller/RoomController";
import { SS } from "../../../../base/script/global/SS";
import { EventCommond } from "../../../other/EventCommond";


/*
 * @Description: 
 * @Author: luo.fei
 * @Date: 2020-04-27 15:28:25
 */
export class RoomDescription extends cc.Component {

    private _label: cc.Label;           //文字
    private initRoot(): void {
        this._label = cc.find("Label", this.node).getComponent(cc.Label);
    }

    initEvent() {      
        SS.EventCenter.on(EventCommond.UIRoomRefresh, this.onRefresh, this);    
    }

    removeEvent() {    
        SS.EventCenter.off(EventCommond.UIRoomRefresh, this.onRefresh, this);        
    }

    onDestroy() {
        this.removeEvent();
    }

    /**
    * 房间公告
    * @param data 需要显示的内容数据
    */
    public Init(): void {
        this.initRoot();
        this.initEvent();
        //刷新聊天内容
        this._label.string = RoomController.CurRoom.Description;
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

    onRefresh()
    {
        //刷新聊天内容
        this._label.overflow = cc.Label.Overflow.NONE;
        this._label.string = RoomController.CurRoom.Description;
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

