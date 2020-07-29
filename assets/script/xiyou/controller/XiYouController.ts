import { SS, qq } from "../../../base/script/global/SS";
import { XiyouSDK } from "../xiyouSDK/XiyouSDK";
import { XiyouSocket } from "./XiyouSocket";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { LoginController } from "../../login/controller/LoginController";
import { RoomController } from "../../room/controller/RoomController";
import { EventCommond } from "../../other/EventCommond";
import { UIManager } from "../../../base/script/frame/ui/UIManager";

export class XiYouController {
    public static XiYouAppId: number;
    public static xiYouSocket: XiyouSocket = new XiyouSocket();

    /**
     * 初始化xiyou
     */
    public static async initXiYou() {
        return new Promise(resolve => {
            if (XiyouSDK.Ins.isInit()) {
                resolve();
                return
            }
            XiyouSDK.Ins.initConfig({
                appId: SS.QQAppId,
                callFunc: async () => {
                    await this.xiYouSocket.Open(XiyouSDK.Ins.getSocketUrl());
                    resolve();
                },
                funcObj: this,
                sendMsgFunc: this.xiYouSocket.sendMsg,
                netObj: this.xiYouSocket,
                isShowLog: Clog.IsOpenLog,
                isDebug: SS.IsDevMode,          //xiyou的模式与游戏的模式保持一致
            });
        });
    }

    /**
     * 关闭xiyou连接
     */
    public static EndXiYouSocket() {
        this.xiYouSocket.Close();
        XiyouSDK.Ins.resetAllParam();
    }

    /**
     * 重连xiyou
     */
    public static async ReconectXiyou() {
        Clog.Green(ClogKey.Net, "【重连xiyou】");
        await this.initXiYou();
        await LoginController.Step1LoginQQ();
        let isLoginXiYouOK = await LoginController.Step2LoginXiyou();
        if (!isLoginXiYouOK) {
            Clog.Error("重连xiyou login失败");
            this.JumpToXiyou();
        }
    }

    public static JumpToXiyou() {
        if (qq) {
            //退出时，关闭房间的websocket
            RoomController.EndBanBanSocket()
            //关闭xiyou
            XiYouController.EndXiYouSocket();
            //重置ui
            SS.EventCenter.emit(EventCommond.UIRoomReset);
            //关闭所有UI
            // UIManager.CloseAll();
            // qq.navigateToMiniProgram({
            //     appId: '1110064712',
            //     // path: 'page/index/index?id=123',
            //     extraData: {  },
            //     envVersion: 'trial',   //develop开发版; trial体验版;release正式版
            //     success(res) { }
            // })

            qq.exitMiniProgram({});
            // if (!Main.IS_ANDROID) {//ios直接退出
            //     if ( Main.is_FROM_HALL) {
            //      MomoHelper_qqNavigateToMiniProgram("1110064712", {})//1110064712
            //     } else {
            //      MomoHelper_exitQQProgreMin();
            //     }
            //    } else {
            //     MomoHelper_exitQQProgreMin();//新加
            //    }
        }
    }

}