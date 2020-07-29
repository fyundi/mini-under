import NetCenterMgr from "../xiyouSDK/utils/NetCenterMgr";
import MsgDefine from "../xiyouSDK/socket/MsgDefine";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { XiyouSDK } from "../xiyouSDK/XiyouSDK";
import { XiyouUserInfoData } from "../model/XiyouUserInfoData";

export class XiYouUserDetailController {

    public static async GetXiyouUserInfo(momoId: number): Promise<XiyouUserInfoData> {
        return new Promise(async (reslove) => {
            let req = () => {
                XiyouSDK.Ins.getAccountInfo(momoId);
            }
            let resp = (msg: any) => {
                reslove(new XiyouUserInfoData(msg.data))
            }
            NetCenterMgr.Ins.registerMsgListener(MsgDefine.REQUEST_ACCOUNT_INFO, (msgkey: string, msgver: string, info: any) => {
                
                if (info && info.ec == 0) {
                    resp(info.data)
                }
                else {
                    Clog.Error("GetXiyouFriendInfo resp error")
                }
            }, this, true);
            req();
        })
    }
}