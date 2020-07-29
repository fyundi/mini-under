import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { RoomController } from "./RoomController";
import { AgoraApi } from "../../../base/script/api/AgoraApi";
import HData from "../../xiyou/xiyouSDK/data/HData";
import { qq, SS } from "../../../base/script/global/SS";
import Xhr, { XhrUrl } from "../../../base/script/api/http/Xhr";
import { EnumAgoraRole, EventAgora } from "../../../base/script/api/agora/AgoraBase";
import { EnumRole, EnumOnMicOp, EnumRoomMode } from "../../other/EnumCenter";
import { EventCommond } from "../../other/EventCommond";
import { Session } from "../../login/model/SessionData";
import { UIToast } from "../../common/view/UIToast";
import { MicWaitController } from "../../micWait/controller/MicWaitController";
import { UICommDia } from "../../common/view/UICommDia";




export class JoinMicController {

    // web测试的时候就不加载这个
    private static Enable = !!qq;

    /**
     * 房间左下角的按钮状态
     * 与qq的实时语音同步
     */
    public static MicMute = true;

    public static async OpenAgora() {
        if (!JoinMicController.Enable)
            return;     
        await AgoraApi.Agora.Init({
            appId: SS.QQAppId,
            sessionKey: HData.gsToken, // 西游登录给了session_key
        });      
        let selfSeat = RoomController.GetSelfSeat();   
        let res = await AgoraApi.Agora.JoinChannel({
            uid: '',
            rid: '' + RoomController.CurRoom.RoomId,
            token: "",
            role: EnumAgoraRole.HOST,
            muteMicrophone: !selfSeat || !selfSeat.IsOpenMicrophone,     ///selfPlayer没有??       
            muteLoudspeaker: false,
        }); 
        if (res) {
            UIToast.Show('' + res); // 加入语音出错
            return;
        }
        // this.SyncMicrophone();

        //SS.EventCenter.on(EventAgora.EventVoIPChatInterrupted, this.SelfMicMute, this);
        JoinMicController.MicMute = !selfSeat || !selfSeat.IsOpenMicrophone;
        SS.EventCenter.emit(EventCommond.UIRoomMicBt);
    }

    public static async DisposeAgora() {
        if (!JoinMicController.Enable) return;
        this.SelfMicMute();
        // SS.EventCenter.off(EventAgora.EventVoIPChatInterrupted, this.SelfMicMute, this);
        await AgoraApi.Agora.Dispose();
    }

    /**
     * 自动上麦
     * @param uid 
     * @param openid 
     */
    public static JoinMicAuto(uid: number = Session.BanBan.UId, openid: string = Session.BanBan.OpenId) {
        let url = new XhrUrl("room/joinMic").Url;
        let postData = {
            rid: '' + RoomController.CurRoom.RoomId,
            position: '-1',
            boss: '0',
            uid: uid,
            openid: openid,
        }

        // 不需要考虑结果，结果会在socket中分发
        Xhr.PostJson(url, postData);
    }

    /**
     * 点击空位置上麦操作
     * @param pos 座次，-1代表随意
     */
    public static JoinMic(pos: number, uid: number = Session.BanBan.UId, openid: string = Session.BanBan.OpenId) {
        let seat = RoomController.Seats.find(item => item.Position == pos);
        if (!seat) {
            this.JoinMicAuto();
            return;
        }

        let url = new XhrUrl("room/joinMic").Url;
        let postData = {
            rid: '' + RoomController.CurRoom.RoomId,
            position: '' + pos,
            boss: seat.Role == EnumRole.ROLE_GOD ? '1' : '0',
            uid: uid,
            openid: openid,
        }

        // 不需要考虑结果，结果会在socket中分发
        Xhr.PostJson(url, postData);
    }



    public static LeaveMic(pos: number) {
        let seat = RoomController.Seats.find(item => item.Position == pos);
        if (seat && seat.UId) {
            let url = new XhrUrl("room/leavelMic").Url;
            let postData = {
                rid: '' + RoomController.CurRoom.RoomId,
                uid: '' + seat.UId,
            };
            Xhr.PostJson(url, postData);
        }
    }

    public static SyncMicrophone() {
        let selfSeat = RoomController.GetSelfSeat();
        let muteMicrophone = !selfSeat || !selfSeat.IsOpenMicrophone;       ///服务器给的是否可以发麦  
        Clog.Green(ClogKey.UI, "[SyncMicrophone]------" + muteMicrophone + JoinMicController.MicMute);
        if (muteMicrophone) {
            JoinMicController.MicMute = true;
            if (JoinMicController.Enable) AgoraApi.Agora.MuteMicrophone(true);
        }
        else {
            if (JoinMicController.MicMute) {
                if (JoinMicController.Enable) AgoraApi.Agora.MuteMicrophone(true);
            }
            else {
                if (JoinMicController.Enable) AgoraApi.Agora.MuteMicrophone(false);
            }
        }

        SS.EventCenter.emit(EventCommond.UIRoomMicBt);
    }

    /**
     * 继承小程序那边的接口命名
     */
    public static async onMic(pos: number, op: EnumOnMicOp, duration = 0) {
        var url = new XhrUrl("room/opMic").Url;
        var postData = {
            'rid': RoomController.CurRoom.RoomId.toString(),
            'op': op,
            'position': pos.toString(),
            'duration': duration.toString(),
        };
        await Xhr.PostJson(url, postData);
    }

    /**
     * 房间左下角的按钮
     * 自己倾向与不说话
     */
    public static SelfMicMute() {
        if (JoinMicController.MicMute) return;
        JoinMicController.MicMute = true;
        if (JoinMicController.Enable) AgoraApi.Agora.MuteMicrophone(true);
        SS.EventCenter.emit(EventCommond.UIRoomMicBt);
    }

    /**
     * 房间左下角的按钮
     * 自己倾向于说话
     */
    public static SelfMicUnmute() {
        if (!JoinMicController.MicMute) return;
        let selfSeat = RoomController.GetSelfSeat();
        if (!selfSeat || !selfSeat.IsOpenMicrophone) return;

        let fun = () => {
            JoinMicController.MicMute = false;
            if (JoinMicController.Enable) AgoraApi.Agora.MuteMicrophone(false);
            SS.EventCenter.emit(EventCommond.UIRoomMicBt);
        }

        if (qq) {
            //查看QQ设置是否开启了麦克风             
            qq.getSetting({
                success(res) {
                    Clog.Red(ClogKey.UI, "【--------------authSetting】:" + JSON.stringify(res.authSetting));
                    if (!res.authSetting['scope.record']) {
                        qq.authorize({
                            scope: 'scope.record',
                            success() {
                                console.log("授权成功");
                                fun();
                            },
                            fail() {
                                console.log("授权失败");
                                qq.openSetting({
                                    success(res) {
                                        console.log(JSON.stringify(res.authSetting))
                                        console.log("成功打开设置");
                                    },
                                    fail(res) {
                                        console.log("打开设置失败");
                                    }
                                })
                            }
                        })
                    }
                    else {
                        fun();
                    }
                },
                fail() {
                    console.log("获取qq设置失败");
                }
            })

            return;
        }

        fun();
    }

    /**
    * 继承小程序那边的接口命名
    */
    public static async joinMicModeReq(isAuto: boolean) {
        return new Promise(async (resolve) => {
            let rid = '' + RoomController.CurRoom.RoomId;
            let url = new XhrUrl(`room/setting`)
                .Query({ key: 'rid', value: rid })
                .Url;
            let postData = {
                'rid': rid,
                'type': 'mode',
                'value': isAuto ? 1 : 0,
            }
            let msg = await Xhr.PostJson(url, postData);
            let success = msg['success']
            if (!success) {
                UIToast.Show(msg['msg'])
                resolve(false)
                return
            }
            // let data = msg['data']

            resolve(true)
        })
    }
}