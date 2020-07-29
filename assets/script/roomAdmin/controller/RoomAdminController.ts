import Xhr, { XhrUrl } from "../../../base/script/api/http/Xhr"
import { RoomController } from "../../room/controller/RoomController"
import { RoomAdminData, RoomOlineData } from "../model/RoomAdminData"
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog"
import { EnumPurview } from "../../other/EnumCenter"
import { UIToast } from "../../common/view/UIToast"


/**
 * 房间管理列表controller
 */
export class RoomAdminController {

    public static AllOnlineInfo: Array<RoomOlineData>
    public static AllAdminInfo: Array<RoomAdminData>

    /**
     * 获取房间内的所有在线玩家数据信息
     */
    public static async GetRoomOnlineInfo(): Promise<boolean> {
        return new Promise(async (resolve) => {

            let url = new XhrUrl("room/online").Url
            let postData = {
                rid: RoomController.CurRoom.RoomId.toString()
            }
            let msg = await Xhr.PostJson(url, postData)
            let success = msg['success']
            if (!success) {
                resolve(false)
                return
            }

            let data = msg['data']
            this.AllOnlineInfo = new Array<RoomOlineData>();
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                this.AllOnlineInfo.push(new RoomOlineData(element))
            }
            Clog.Trace(ClogKey.Net, "this.AllOnlineInfo=" + JSON.stringify(this.AllOnlineInfo));
            resolve(true)

        })
    }

    /**
     * 获取房间内的所有管理员数据信息
     */
    public static async GetRoomAdminInfo(): Promise<boolean> {
        return new Promise(async (resolve) => {

            let url = new XhrUrl("room/admins").Url
            let postData = {
                rid: RoomController.CurRoom.RoomId.toString()
            }
            let msg = await Xhr.PostJson(url, postData)
            let success = msg['success']
            if (!success) {
                let data = msg['msg']
                UIToast.Show(data);
                resolve(false)
                return
            }
            let data = msg['data']
            this.AllAdminInfo = new Array<RoomAdminData>();
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                this.AllAdminInfo.push(new RoomAdminData(element))
            }
            Clog.Trace(ClogKey.Net, "this.AllAdminInfo=" + JSON.stringify(this.AllAdminInfo));
            resolve(true)

        })
    }

    /**
     * 设置管理员权限
     * @param uid 给uid的这个人设置成管理员
     * @param type 管理员类型
     */
    public static async SetRoomAdmin(uid: number, type: EnumPurview.SuperAdmin | EnumPurview.Admin): Promise<boolean> {
        return new Promise(async (resolve) => {

            let url = new XhrUrl("room/setAdmin").Url
            let postData = {
                rid: RoomController.CurRoom.RoomId.toString(),
                uid: uid.toString(),
                admin: type == EnumPurview.SuperAdmin ? "1" : "0",
                op: 'add'
            }
            let msg = await Xhr.PostJson(url, postData)
            let success = msg['success']
            if (!success) {
                resolve(false)
                return
            }
            let data = msg['data']

            resolve(true)

        })
    }

    /**
     * 取消管理员权限
     * @param uid 给uid的这个人取消成管理员
     * @param type 管理员类型
     */
    public static async CanelRoomAdmin(uid: number, type: EnumPurview.SuperAdmin | EnumPurview.Admin): Promise<boolean> {
        return new Promise(async (resolve) => {
            let url = new XhrUrl("room/setAdmin").Url
            let postData = {
                rid: RoomController.CurRoom.RoomId.toString(),
                uid: uid.toString(),
                admin: type == EnumPurview.SuperAdmin ? "1" : "0",
                op: 'remove'
            }
            let msg = await Xhr.PostJson(url, postData)
            let success = msg['success']
            if (!success) {
                resolve(false)
                return
            }
            let data = msg['data']
            resolve(true)
        })
    }




} 