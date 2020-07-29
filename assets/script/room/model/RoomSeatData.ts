import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { RoomController } from "../controller/RoomController";
import { EnumRole, EnumRoomMode } from "../../other/EnumCenter";

/**
 * 房间上的座位
 */
export class RoomSeatData {

    /**
     * 座位号
     */
    public Position: number;

    /**
     * 该座位上玩家UId
     */
    public UId: number;

    /**
     * qq的openId
     */
    public OpenId: string;

    private _isLock: boolean;
    /**
    * 当前玩家是否被封麦了，只有当前房间是自由上麦时，才能封麦，排队上麦时不能封麦
    */
    public get IsLock(): boolean {
        if (RoomController.CurRoom.Mode == EnumRoomMode.Lock) {
            return false
        }
        return this._isLock;
    }

    /**
    * 当前玩家是否被禁麦了
    */
    public IsForbidden: boolean;

    /**
    * 当前玩家的名称
    */
    public Name: string;

    /**
    * 当前玩家的头像Icon
    */
    public Icon: string;

    /**
    * 当前玩家倒计时
    */
    public Counter: number;

    /**
     * 玩角角色
     */
    public Role: EnumRole

    /**
     * 当前座位是否有玩家
     */
    public get HasPlayer(): boolean {
        return this.UId !== 0;
    }

    /**
     * 当前座位上的人是否是房主
     */
    public get IsCreator(): boolean {
        return this.UId == RoomController.CreateorInfo.UId
    }

    /**
     * 当前座位上的人是否是管理员
     */
    public get IsAdmin(): boolean {
        return RoomController.Admins.indexOf(this.UId) >= 0
    }

    /**
     * 当前座位上是否有人发出声音
     */
    public get IsOpenMicrophone(): boolean {
        Clog.Green(ClogKey.UI, "【IsOpenMicrophone】" + ",this.HasPlayer:" + this.HasPlayer + ",this.IsLock:" + this.IsLock + ",this.IsForbidden:" + this.IsForbidden);
        return this.HasPlayer && !this.IsLock && !this.IsForbidden;
    }

    /**
     * 
      "position": 7,
      "uid": 0,
      "lock": 1,
      "forbidden": 0,
      "counter": 0,
      "package": 0,
      "name": "",
      "icon": "",
      "frame": "",
      "role": 0
     */
    constructor(serverData?: any) {
        if (serverData) {
            this.Position = parseInt(serverData.position);
            this.UId = parseInt(serverData.uid);
            this.OpenId = parseInt(serverData.uid) ? serverData.openid : 0; // 如果uid为0，openId也要清零
            this._isLock = serverData.lock == 0 ? false : true;
            this.IsForbidden = serverData.forbidden == 0 ? false : true;
            this.Counter = parseInt(serverData.counter);
            this.Name = serverData.name;
            this.Icon = serverData.icon;
            this.Role = serverData.role as EnumRole;
        }
    }
}