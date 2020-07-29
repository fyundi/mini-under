import { qq } from "../../../../base/script/global/SS";
import { RoomController } from "../../../room/controller/RoomController";
import Clog, { ClogKey } from "../../../../base/script/frame/clog/Clog";

export class ShareManager {

    public static Init() {
        if (!qq) return;
        qq.onShareAppMessage(this.sharePassivity);
        qq.showShareMenu();
    }

    public static Share() {
        if (!qq) return;
        let param = {
            title: '用声音，交朋友，连麦遇见有趣的灵魂。',
            imageUrl: "http://xs-image.oss-cn-hangzhou.aliyuncs.com/static/xiyou/share.png",
            query: "type=shareJoinRoom&roomId=" + RoomController.CurRoom.RoomId + "&password=" + RoomController.CurRoom.Password,
            shareAppType: "qqFastShareList",
        }
        qq.shareAppMessage(param)
        Clog.Trace(ClogKey.Entry, "Share param =" + param);
    }

    // 用户点击了“转发”按钮
    private static sharePassivity() {
        let param = {
            title: '用声音，交朋友，连麦遇见有趣的灵魂。',
            imageUrl: "http://xs-image.oss-cn-hangzhou.aliyuncs.com/static/xiyou/share.png",
            query: "type=shareJoinRoom&roomId=" + RoomController.CurRoom.RoomId + "&password=" + RoomController.CurRoom.Password,
            shareAppType: "qqFastShareList",
        }
        Clog.Trace(ClogKey.Entry, "Share param =" + param);
        return param
    }
}

