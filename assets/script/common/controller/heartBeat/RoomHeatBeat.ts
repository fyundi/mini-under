import { RoomController } from "../../../room/controller/RoomController";
import Clog, { ClogKey } from "../../../../base/script/frame/clog/Clog";
import { RoomSocket } from "../websocket/RoomSocket";
import { RoomSocketCall } from "../websocket/RoomSocketCall";


/**
 * 房间心跳类
 */
export class RoomHeatBeat {

    private static handle: number;
    private static readonly heatBeatInterval: number = 5     //发送心跳时间间隔
    private static heatBeatTimer: number = 0                //心跳计时器
    private static lostTimeMax: number = 20;                //判定心跳丢失时长

    public static Start() {
        this.handle = window.setInterval(() => { this.HeatBeat() }, this.heatBeatInterval * 1000)
    }

    public static End() {
        window.clearInterval(this.handle);
    }

    public static OnHeatBeat(msg: number) {
        RoomController.CurRoom.ServerTimeStamp = msg
        Clog.Trace(ClogKey.Net, "Heart Beat, Pong :" + RoomController.CurRoom.ServerTime);
        //计时器清零
        this.heatBeatTimer = 0;
    }

    private static HeatBeat() {
        if (!RoomSocket.IsOpen) {
            return;
        }

        if (this.heatBeatTimer >= this.lostTimeMax) {
            this.heatBeatTimer = 0;
            Clog.Error('心跳丢失')
            RoomSocket.ManulClose();
            return
        }

        //发送心跳
        RoomSocketCall.HeartBeat();
        //计时器累加
        this.heatBeatTimer += this.heatBeatInterval;
    }



}

