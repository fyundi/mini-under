import { RoomSeatItem } from "./RoomSeatItem";
import { RoomController } from "../../controller/RoomController";
import { EventCommond } from "../../../other/EventCommond";
import { SS } from "../../../../base/script/global/SS";

/*
 * @Description: 房间里的所有的座位
 * @Author: luo.fei
 * @Date: 2020-04-27 15:04:22
 */
export class RoomSeats extends cc.Component {

    public static Instance: RoomSeats

    private _item: cc.Node;
    private allSeat: Map<number, RoomSeatItem>
    private _seatGrid: cc.Node;
    private _createrRoot: cc.Node;

    onLoad() {
        RoomSeats.Instance = this;
        this.initRoot();
        this.initEvent()
        this.refreshAllSeat();
    }

    onDestroy() {
        this.removeEvent();
    }

    private initEvent() {
        SS.EventCenter.on(EventCommond.UIRoomRefresh, this.refreshAllSeat, this);
        SS.EventCenter.on(EventCommond.UIRoomReset, this.resetAllSeat, this);
    }

    private removeEvent() {
        SS.EventCenter.off(EventCommond.UIRoomRefresh, this.refreshAllSeat, this);
        SS.EventCenter.off(EventCommond.UIRoomReset, this.resetAllSeat, this);
    }

    private initRoot() {
        this._seatGrid = cc.find("Grid", this.node);
        this._createrRoot = cc.find("Creater", this.node)
        this._item = cc.find("Item", this.node);
        this._item.active = false;
        this.allSeat = new Map<number, RoomSeatItem>();
        for (let index = 0; index < RoomController.Seats.length; index++) {
            let data = RoomController.Seats[index]
            let element = cc.instantiate(this._item)
            if (data.Position == 0) //0是最中间的位置
            {
                element.setParent(this._createrRoot);
            }
            else {
                element.setParent(this._seatGrid);
            }
            let item = element.addComponent(RoomSeatItem);
            item.Init(data.Position);
            this.allSeat.set(index, item)
        }
    }

    /**
      * @description: 刷新所有的玩家
      */
    private refreshAllSeat() {
        this.allSeat.forEach((item) => item.Refresh())
    }

    /**
     * 重置所有玩家
     */
    private resetAllSeat()
    {
        this.allSeat.forEach((item) => item.Reset())
    }

    /**
     * 获取玩家坐标
     * @param position 座位号 
     */
    public GetSeatItemPostion(position: number): cc.Vec2 {
        let target = this.allSeat.get(position)
        if (target) {
            let localPos = cc.v2(target.node.position.x, target.node.position.y);
            let worldPos = target.node.parent.convertToWorldSpaceAR(localPos)
            return worldPos;
        }
        return null;
    }
}