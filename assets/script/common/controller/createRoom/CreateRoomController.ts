import Xhr, { XhrUrl } from "../../../../base/script/api/http/Xhr";
import { Md5Util } from "../../../other/Md5Util";
import { RoomController } from "../../../room/controller/RoomController";
import { Session } from "../../../login/model/SessionData";
import { UIToast } from "../../view/UIToast";


export class CreateRoomController {

    public static async CreateRoom(name: string, type: string, identify: string = "e53d1172cdf543bb91c85035143d165d", password: string = '') {
        return new Promise(async (resolve) => {

            var url = new XhrUrl("xiyou/createRoom").Url;
            var postData = {
                subject: name,                       //房间名称
                tag: type,                           //房间类型
                momoId: Session.XiYou.MomoId,
                identify: identify,
                sign: null,
                password: password
            };

            let sign = Md5Util.GenSign(postData)
            postData.sign = sign
            let msg = await Xhr.PostJson(url, postData);
            let success = msg['success']
            if (success == false) {
                let desc = msg['msg']
                UIToast.Show(desc)
                resolve(false)
                return
            }

            RoomController.OnJoinRoomId = msg['data']
            resolve(true)
        })
    }



}