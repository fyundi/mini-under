import { RoomController } from "../../room/controller/RoomController"
import Xhr, { XhrUrl } from "../../../base/script/api/http/Xhr"
import { UIToast } from "../../common/view/UIToast"
import { CheckContentController } from "../../common/controller/checkContent/CheckContentController"

/**
 * 房间设置
 */
export class RoomSettingController {

    /**
     * 设置房间名称及房间公告
     * @param name 房间名称
     * @param content 公告内容
     * @param password 密码
     */
    public static async RoomInfoSetting(name: string, content: string, password: string = ''): Promise<boolean> {
        return new Promise(async (resolve) => {
            let isTitleOk = await CheckContentController.CheckContent(name)
            if (!isTitleOk) {
                UIToast.Show("房间名称不合法")
                resolve(false)
                return;
            }

            let isContetnOk = await CheckContentController.CheckContent(content)
            if (!isContetnOk) {
                UIToast.Show("房间公告不合法")
                resolve(false)
                return;
            }
            // 预先保存一次密码 这里服务器的回复可能比较慢
            RoomController.CurRoom.Password = password;

            let url = new XhrUrl("room/create").Url
            let postData = {
                rid: RoomController.CurRoom.RoomId.toString(),        //房间号
                name: name,
                type: 'music',
                description: content,
                clientVersion: 3,
                password: password
            }
            let msg = await Xhr.PostJson(url, postData)
            let success = msg['success']
            if (!success) {
                UIToast.Show(msg['msg'])
                resolve(false)
                return
            }
            let data = msg['data']
            // 如果设置成功了，则保存一下密码
            RoomController.CurRoom.Password = password;
            resolve(true)
        })
    }

    /**
     * 设置房间主题
     * @param background 背景主题名称
     */
    public static async ChangeTheme(background: string = ''): Promise<boolean> {
        return new Promise(async (resolve) => {
            let rid = '' + RoomController.CurRoom.RoomId;
            let url = new XhrUrl(`room/setting`)
                .Query({ key: 'rid', value: rid })
                .Url;
            let postData = {
                'rid': rid,
                'type': 'background',
                'value': background,
            }
            let msg = await Xhr.PostJson(url, postData)
            let success = msg['success']
            if (!success) {
                UIToast.Show(msg['msg'])
                resolve(false)
                return
            }
            let data = msg['data']

            resolve(true)
        })
    }

}