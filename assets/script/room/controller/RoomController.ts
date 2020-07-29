
import Xhr, { XhrUrl } from "../../../base/script/api/http/Xhr";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { RoomSocketCall } from "../../common/controller/websocket/RoomSocketCall";
import { EnumPurview } from "../../other/EnumCenter";
import { Session } from "../../login/model/SessionData";
import { SS, qq } from "../../../base/script/global/SS";
import { EventCommond } from "../../other/EventCommond";
import { JoinMicController } from "./JoinMicController";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { UIRecommendJoin } from "../../recommendJoin/view/UIRecommendJoin";
import { UIRoom } from "../view/main/UIRoom";
import { UIGiftEffect } from "../../giftEffect/view/UIGiftEffect";
import { XiYouController } from "../../xiyou/controller/XiYouController";
import { UICommDia } from "../../common/view/UICommDia";
import { RoomSocket } from "../../common/controller/websocket/RoomSocket";
import { RoomSocketSync } from "../../common/controller/websocket/RoomSocketSync";
import { RoomHeatBeat } from "../../common/controller/heartBeat/RoomHeatBeat";
import { RoomInfo } from "../model/RoomInfoData";
import { RoomCreatorData as RoomCreator } from "../model/RoomCreatorData";
import { RoomSeatData } from "../model/RoomSeatData";
import { NewbieGuildController } from "../../newbie/control/NewbieGuildController";

/*
* 房间内角色为：创建者(Createor)，玩家（player），访客(Vistor);
* Createor是房主;
* Player是上麦用户，可说可收听;
* Vistor是房间内的访客，只能收听；
* by luo.fei 2020/04/28
*/
export class RoomController {

    /**
    * 当前房间的websocketUrl地址
    */
    private static webscoketUrl: string;
    /**
     * 当前房间的房间信息
     */
    public static CurRoom: RoomInfo;
    /**
     * 当前房间里的访客列表
     */
    public static Vistors: Array<number>;
    /**
     * 当前房间的创建者信息
     */
    public static CreateorInfo: RoomCreator;
    /**
    * 当前房间的所有玩家用户
    */
    public static Seats: Array<RoomSeatData>
    /**
    * 需要进入的房间的Id
    */
    public static OnJoinRoomId: number
    /**
    * 需要加入的房间的密码
    */
    public static OnJoinPassword: string = '';

    /**
     * 房间管理员列表
     */
    public static Admins: Array<number> = new Array<number>();

    /**
    * 房间接待管理员列表
    */
    public static SuperAdmins: Array<number> = new Array<number>()

    /**
     * 我在当前房间中的角色
     */
    public static Purview: EnumPurview



    //获取玩家的位置
    public static GetPositionByUserId(id: number) {
        let seat = this.Seats.find(item => item.UId == id)
        if (seat == null) {
            return -1
        }
        return seat.Position;
    }

    /**
     * 获得自己的座位信息，找不到就为undefined
     */
    public static GetSelfSeat(): RoomSeatData | undefined {
        return this.Seats.find(item => item.UId == Session.BanBan.UId);
    }

    //加入房间新打开房间界面，同时打开礼物面板界面
    public static async JoinRoom() {
        if (!this.OnJoinRoomId) {
            Clog.Error("房间号有误")
            return;
        }

        let isOK = await this.httpJoinRoom(false);
        if (!isOK) {
            return;
        }
        UIManager.CloseAll();
        SS.EventCenter = new cc.EventTarget();
        await UIManager.OpenUI(UIRoom);
        await UIManager.OpenUI(UIGiftEffect);
        NewbieGuildController.JoinRoomEnd = true;
    }

    /**
     * 通过房间号加入房间
     * @param roomId 加入房间房间号
     * @param callback 加入房间后的事件回调
     */
    public static async httpJoinRoom(isrelinke: boolean = false): Promise<boolean> {
        return new Promise(async (resolve) => {
            let url = new XhrUrl("room/config").Url;
            let postData = {
                rid: '' + this.OnJoinRoomId,        //房间号
                init: isrelinke ? 0 : 1,
                password: this.OnJoinPassword
            }
            let msg = await Xhr.PostJson(url, postData)
            let success = msg['success']

            if (success == false) {
                let errMsg = msg['msg']
                if (errMsg.indexOf("被禁止进入该聊天室") >= 0) {
                    UICommDia.Open(
                        errMsg,
                        '确定',
                        '退出',
                        () => { XiYouController.JumpToXiyou(); },
                        () => { XiYouController.JumpToXiyou(); },
                    )
                }
                else if (errMsg.indexOf("房间已关闭") >= 0 || errMsg.indexOf("房间不存在") >= 0) {
                    //  UIManager.CloseAll();
                    //  await UIManager.OpenUI(UIRecommendJoin)
                    if (qq) {
                        qq.showModal({
                            title: '提示',
                            content: '房间不存在',
                            success(res) {
                                if (res.confirm) {
                                    XiYouController.JumpToXiyou();
                                }
                                else if (res.cancel) {
                                    XiYouController.JumpToXiyou();
                                }
                            }
                        })
                    }
                } else if (errMsg.indexOf("请输入房间密码") >= 0 || errMsg.indexOf("房间密码错误") >= 0) {
                    if (qq) {
                        qq.showModal({
                            title: '提示',
                            content: '房间密码错误，请重试',
                            success(res) {
                                if (res.confirm) {
                                    XiYouController.JumpToXiyou();
                                }
                                else if (res.cancel) {
                                    XiYouController.JumpToXiyou();
                                }
                            }
                        })
                    }
                }
                Clog.Trace(ClogKey.Net, "HttpJoinRoom room/config errMsg =" + errMsg);
                resolve(false)
                return
            }

            let data = msg['data']
            Session.BanBan.isSuperAdmin = data.is_super;
            this.CurRoom = new RoomInfo(data.config)
            Clog.Trace(ClogKey.Net, "HttpJoinRoom CurRoomInfo=" + JSON.stringify(this.CurRoom));

            this.Vistors = new Array<number>();
            for (let index = 0; index < data.admins.length; index++) {
                const element = data.admins[index];
                this.Vistors.push(element);
            }
            Clog.Trace(ClogKey.Net, "HttpJoinRoom Vistors=" + JSON.stringify(this.Vistors));

            this.CreateorInfo = new RoomCreator(data.createor)
            Clog.Trace(ClogKey.Net, "HttpJoinRoom CreateorInfo=" + JSON.stringify(this.CreateorInfo));

            this.webscoketUrl = (data.socket as string).replace("https://", "wss://")

            Clog.Trace(ClogKey.Net, "HttpJoinRoom WebscoketUrl=" + this.webscoketUrl);

            this.Seats = new Array<RoomSeatData>();
            for (let index = 0; index < data.list.length; index++) {
                const serverPlayerData = data.list[index];
                let seatData = new RoomSeatData(serverPlayerData)
                this.Seats.push(seatData)
            }
            Clog.Trace(ClogKey.Net, "HttpJoinRoom players=" + JSON.stringify(this.Seats));

            this.Admins = new Array<number>();
            for (let index = 0; index < data.admins.length; index++) {
                const element = data.admins[index];
                this.Admins.push(element)
            }
            Clog.Trace(ClogKey.Net, "HttpJoinRoom admins=" + JSON.stringify(this.Admins));

            this.Purview = data.purview as EnumPurview;
            if (Session.BanBan.isSuperAdmin) this.Purview = EnumPurview.SuperPowerAdmin;

            await this.InitRoomWebSocket();
            await this.GetRoomDescription();
            if (isrelinke) {
                SS.EventCenter.emit(EventCommond.OnRelink);
                SS.EventCenter.emit(EventCommond.UIRoomRefresh);
            }
            SS.EventCenter.emit(EventCommond.UIMicWait);
            SS.EventCenter.emit(EventCommond.UIChatCheck);
            //加入房间后，自动判断并坐上房主位
            this.autoJoinCreatorPos();
            resolve(true)
        })
    }

    public static async Kickout(pos: number, duration: number) {
        var player = RoomController.Seats.find(item => item.Position == pos);
        var url = new XhrUrl("room/kickout").Url;
        var postData = {
            'rid': '' + RoomController.CurRoom.RoomId,
            'uid': player ? '' + player.UId : '',
            'position': '' + pos,
            'time': '' + duration,
        };
        await Xhr.PostJson(url, postData);
    }

    /**
     * 从socket那边来的同步推送
     */
    public static SyncRoomRefresh(data: any) {
        if (!data) return;
        if (cc.js.isString(data)) {
            data = JSON.parse(data);
        }
        //Clog.Error("[SyncRoomRefresh]"+(JSON.stringify(data)));
        if (data.config) {
            //是否需要刷新背景，取决于服务器更新的背景是否与当前背景相同
            let needUIThemeBackground = this.CurRoom.Background != data.background;

            this.CurRoom.From(data.config);
            Clog.Trace(ClogKey.Net, "SyncRoomRefresh CurRoomInfo=" + JSON.stringify(this.CurRoom));

            if (needUIThemeBackground)
                SS.EventCenter.emit(EventCommond.UIThemeBackground);

            //收到超管关闭房间
            if (this.CurRoom.Deleted == 2) {
                // UIManager.CloseAll();
                // UIManager.OpenUI(UIRecommendJoin);
                UICommDia.Open(
                    "该房间已被封",
                    '确定',
                    '退出',
                    () => { XiYouController.JumpToXiyou(); },
                    () => { XiYouController.JumpToXiyou(); },
                )
                return
            }
        }

        if (data.admins) {
            this.Admins = new Array<number>();
            for (let index = 0; index < data.admins.length; index++) {
                const element = data.admins[index];
                this.Admins.push(element);
            }
            Clog.Trace(ClogKey.Net, "SyncRoomRefresh Admins=" + JSON.stringify(this.Admins));
        }

        if (data.superAdmins) {
            this.SuperAdmins = new Array<number>();
            for (let index = 0; index < data.superAdmins.length; index++) {
                const element = data.superAdmins[index];
                this.SuperAdmins.push(element);
            }
            Clog.Trace(ClogKey.Net, "SyncRoomRefresh SuperAdmins=" + JSON.stringify(this.SuperAdmins));
        }

        if (data.wait) {
            Clog.Trace(ClogKey.Net, "SyncRoomRefresh micWait=" + JSON.stringify(data.wait));
            RoomSocketSync.SyncRoomMicWait(data.wait);
        }

        //每次同步时，重新设置自己权限
        switch (this.Purview) {
            case EnumPurview.Createor:
                break;
            case EnumPurview.Admin:
                {
                    if (this.Admins.indexOf(Session.BanBan.UId) < 0) {
                        this.Purview = EnumPurview.Normal;
                        Clog.Red(ClogKey.Net, "【角色改变 admin > Normal");
                    }
                }
                break;
            case EnumPurview.SuperAdmin:
                {
                    if (this.Admins.indexOf(Session.BanBan.UId) < 0) {
                        this.Purview = EnumPurview.Normal;
                        Clog.Red(ClogKey.Net, "【角色改变 admin > Normal");
                    }
                }
                break;
            case EnumPurview.Normal:
                {
                    if (this.Admins.indexOf(Session.BanBan.UId) >= 0 && this.SuperAdmins.indexOf(Session.BanBan.UId) < 0) {
                        this.Purview = EnumPurview.Admin;
                        Clog.Trace(ClogKey.Net, "【角色改变 Normal > Admin");
                    }
                    else if (this.Admins.indexOf(Session.BanBan.UId) >= 0 && this.SuperAdmins.indexOf(Session.BanBan.UId) >= 0) {
                        this.Purview = EnumPurview.SuperAdmin;
                        Clog.Red(ClogKey.Net, "【角色改变 Normal > SuperAdmin");
                    }
                }
                break;
        }
        if (Session.BanBan.isSuperAdmin) this.Purview = EnumPurview.SuperPowerAdmin;

        if (data.createor) {
            this.CreateorInfo = new RoomCreator(data.createor)
            Clog.Trace(ClogKey.Net, "SyncRoomRefresh CreateorInfo=" + JSON.stringify(this.CreateorInfo));
        }

        if (data.list) {
            this.Seats = new Array<RoomSeatData>();
            for (let index = 0; index < data.list.length; index++) {
                const serverPlayerData = data.list[index];
                let playerData = new RoomSeatData(serverPlayerData)
                this.Seats.push(playerData)
            }
            Clog.Trace(ClogKey.Net, "SyncRoomRefresh players=" + JSON.stringify(this.Seats));
        }

        if (data._options && data._options.op) {
            let op = data._options.op;
            if (op == "kickout") {
                let target = data._options.uid
                Clog.Trace(ClogKey.Net, "[kickout] target=" + target);
                if (target == Session.BanBan.UId) {
                    UICommDia.Open(
                        "你已被踢出房间",
                        '确定',
                        '退出',
                        () => { XiYouController.JumpToXiyou(); },
                        () => { XiYouController.JumpToXiyou(); },
                    )
                    return
                }
            }
        }

        SS.EventCenter.emit(EventCommond.UIRoomRefresh);
        SS.EventCenter.emit(EventCommond.UIChatCheck);
        SS.EventCenter.emit(EventCommond.UIMicWait);
    }

    /**
     * 初始化房间WebSocket
     */
    private static async InitRoomWebSocket() {
        Clog.Trace(ClogKey.Net, "InitRoomWebSocket")
        if (RoomSocket.IsOpen) {
            return;
        }

        //step0 初始化WebSocket
        let isOK = await RoomSocket.OnInit(this.webscoketUrl)
        if (!isOK) {
            Clog.Error("初始化RoomSocket Error!");
            return;
        }

        //step1.打开Socket的服务器监听
        RoomSocketSync.Start();
        //step2.打开websocket后，发送的第一个消息一定是joinchanel
        RoomSocketCall.JoinChannel();
        //step3.获取房间历史消息
        RoomSocketCall.GetHistoryMessages();
        //step4.房间人数
        RoomSocketCall.OnLineNum();
        //step5.同时开启心跳
        RoomHeatBeat.Start();
        //step6,加入语音系统
        JoinMicController.OpenAgora();
    }

    /**
     * 退出房间WebSocket
     */
    public static EndBanBanSocket() {
        if (!RoomSocket.IsOpen) {
            return;
        }
        //关闭心跳
        RoomHeatBeat.End();
        //关闭Socket的服务器监听
        RoomSocketSync.End();
        //关闭房间Socket
        RoomSocket.ManulClose();
        //关闭语音系统
        JoinMicController.DisposeAgora();
    }

    private static autoJoinCreatorPos() {
        Clog.Trace(ClogKey.UI, "autoJoinCreatorPos RoomInfoManager.Purview=" + RoomController.Purview);
        if (RoomController.Purview == EnumPurview.Createor) {
            let creatorSeat = RoomController.Seats.find(item => item.Position == 0)
            if (creatorSeat && !creatorSeat.HasPlayer) {
                Clog.Trace(ClogKey.UI, "自动坐房主位");
                JoinMicController.JoinMic(0);
            }
        }
    }

    /**
     * 单独的获取房间公告的接口
     */
    private static async GetRoomDescription(): Promise<boolean> {
        return new Promise(async (resolve) => {
            var url = new XhrUrl("room/description").Query({ key: "rid", value: this.CurRoom.RoomId.toString() }).Url;
            let msg = await Xhr.GetJson(url)
            let success = msg['success']
            if (!success) {
                resolve(false)
                return
            }
            this.CurRoom.Description = msg['data']
            Clog.Trace(ClogKey.Api, "获取房间公告：" + this.CurRoom.Description)
            resolve(true)
        })
    }

    public static async freezeUser(pos: number, duration: number) {
        var player = RoomController.Seats.find(item => item.Position == pos);
        var url = new XhrUrl("room/freezeUser").Url;
        var postData = {
            'rid': '' + RoomController.CurRoom.RoomId,
            'uid': player ? '' + player.UId : '',
            'position': '' + pos,
            'time': '' + duration,
        }
        await Xhr.PostJson(url, postData);
    }

    public static async closeRoom(roomId: number, duration: number) {
        var url = new XhrUrl("room/forbidden").Url;
        var postData = {
            'rid': '' + roomId,
            'time': '' + duration,
            'deleted': '1'  //1:关闭房间；2:解封房间
        }
        await Xhr.PostJson(url, postData);
        // let msg = await Xhr.PostJson(url, postData);
        // let success = msg['success'];
        // if (success == true) {
        //     let errMsg = msg['msg']
        //     if (errMsg.indexOf("操作成功") >= 0) {
        //         UIManager.CloseAll();
        //         await UIManager.OpenUI(UIRecommendJoin);
        //     }
        // }
    }

    /**
     * 
     * @param roomId 公屏开关
     * @param duration 
     */
    public static async ChatCheck(isOpenChat: boolean) {
        var url = new XhrUrl("room/displayMessage").Url;
        var postData = {
            'rid': RoomController.CurRoom.RoomId,
            'display': isOpenChat ? "1" : "0",
        }
        let msg = await Xhr.PostJson(url, postData);
        // let success = msg['success'];
        // if (success == true) {     
        // }
    }
}