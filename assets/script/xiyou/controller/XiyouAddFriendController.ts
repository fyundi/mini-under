import { XiyouSDK } from "../xiyouSDK/XiyouSDK";
import NetCenterMgr from "../xiyouSDK/utils/NetCenterMgr";
import MsgDefine from "../xiyouSDK/socket/MsgDefine";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { UIToast } from "../../common/view/UIToast";


export class XiyouAddFriendController {


    public static async AddFriend(momoId: number): Promise<boolean> {
        return new Promise(async (reslove) => {
            let req = () => {
                XiyouSDK.Ins.addFriend(momoId);
            }
            let resp = (msg: any) => {
                Clog.Trace(ClogKey.Net, "msg=" + JSON.stringify(msg))
                if (msg.success == true) {
                    UIToast.Show("添加好友成功")
                    reslove(true)
                }
                reslove(false)
            }
            NetCenterMgr.Ins.registerMsgListener(MsgDefine.ADD_FRIEND, (msgkey: string, msgver: string, info: any) => {
                Clog.Trace(ClogKey.Net, "info=" + JSON.stringify(info))
                if (info && info.ec == 0) {
                    resp(info.data)
                }
                else {
                    Clog.Error("Xiyou AddFriend resp error")
                }
            }, this, true);
            req();
        })
    }

}