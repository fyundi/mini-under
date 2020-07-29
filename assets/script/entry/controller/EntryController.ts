import { SystemInfoManager } from "../../../base/script/global/SystemInfoManager";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { SS, qq } from "../../../base/script/global/SS";
import { EnumPlatform, EnumAgoraType } from "../../../base/script/global/BaseEnum";
import { LoginController } from "../../login/controller/LoginController";
import { CreateRoomController } from "../../common/controller/createRoom/CreateRoomController";
import { RoomController } from "../../room/controller/RoomController";
import { UILogin } from "../../login/view/UILogin";
import { LaunchManager, EnumSubPackage } from "../../common/controller/subpackage/LaunchManager";
import { Session } from "../../login/model/SessionData";
import { AudioManager } from "../../../base/script/frame/audio/AudioManager";
import { ShareManager } from "../../common/controller/qqShare/ShareManager";
import { XiYouController } from "../../xiyou/controller/XiYouController";
import { UILoading } from "../../common/view/UILoading";
import Xhr, { XhrUrl } from "../../../base/script/api/http/Xhr";
import { EnumEnv } from "../../other/EnumCenter";
import { TopicController } from "../../topic/controller/TopicController";
import { RoomSocket } from "../../common/controller/websocket/RoomSocket";
import { Report } from "../../other/Report";
import { Entry } from "../view/Entry";
import { Time } from "../../../base/script/frame/time/Time";
import { JoinMicController } from "../../room/controller/JoinMicController";


/**
 * qq的相关流程
 * 1.启动：qq.getLaunchOptionsSync
 * 1.1：通过xiyou客户端启动，参数为xiyou创建/加入房间数据
 * 1.2：通过分享链接启动，参数为分享链接中的参数，加入房间
 * 1.3：通过扫码等其它途径启动，无参数，由客户给默认参数启动
 * 
 * 2.切入：qq.GameShow
 * 2.1 切出时，点了xiyou的创建或加入房间，切入时，带入的参数为xiyou创建/加入房间数据,重连并刷新界面进入房间
 * 2.2 切出时，点了分享链接地址，切入时，带入的参数为分享链接中要加入的房间，重连并刷新界面进入新房间
 * 2.3 切出时，但超时了，此时直接退出房间
 * 2.4 切出时，但未超时，什么都不用管
 */


/*
1. qq.getLaunchOptionsSync()获取的参数，为qq的APP启动时带的参数，无论android和IOS都能正常获取
2. qq.onShow获取的参数是切出再切入时带的参数，但目前的状态非常诡异
2.1 在android上，当1获取的参数为A，切出后，做了B操作，qq.ohshow带的参数为B（正常），如果切出后，不做操作，qq.ohshow带的参数为空（正常）
2.2 在IOS上，当1获取的参数为A，切出后，做了B操作，qq.ohshow带的参数为B（正常），如果切出后，不做操作，qq.ohshow带的参数为A但有时为空（不正常）
*/

//游戏的开始管理类
export class EntryController {

    /** 启动参数 */
    public static LaunchOptions = null;



    public static Init() {
        Clog.Init();                            //初始始化日志
        ShareManager.Init();                    //初始化分享
        AudioManager.Init();                    //初始化声音管理
        this.initSystemInfo();
        this.Start();
    }

    //在这里做游戏的初始化工作
    private static async Start() {
        UILoading.Open();                       //打开loading
        await this.readGameConfig();            //读取游戏配置
        await Report.Boot("boot")               //游戏启动，上报服务器 第一个消息，
        await this.GetEnv();                    //获取游戏环境配置
        await XiYouController.initXiYou();

        if (CC_DEV)                             //CC_DEV用测试模式
        {
            UIManager.OpenUI(UILogin);
            UILoading.Close();
            return
        }

        //正常的登录流程
        await LoginController.Login();          //先走登录流程
        //通过xiyou参数进入房间流程
        let xiyouLaunchData = qq.getLaunchOptionsSync()
        EntryController.LaunchOptions = xiyouLaunchData;
        if (xiyouLaunchData.scene == 1037 && xiyouLaunchData && xiyouLaunchData.referrerInfo && xiyouLaunchData.referrerInfo.appId) {
            Clog.Trace(ClogKey.Entry, "【case1】，通过xiyou启动，参数:" + JSON.stringify(xiyouLaunchData))
            let info = xiyouLaunchData.referrerInfo.extraData;
            if (typeof (info) == "string") //这个该死的info，在ios端是个obj，但在android是个string,这是qq的坑
            {
                info = JSON.parse(xiyouLaunchData.referrerInfo.extraData);
            }
            if (info) {
                let type = info.type;
                Clog.Green(ClogKey.Entry, "西游type=" + type)
                if (type == "createRoom") {
                    let roomName = info.data.roomName
                    let roomType = info.data.roomType
                    let identify = info.data.identify
                    // 西游那边自己的房间传-1
                    RoomController.OnJoinPassword = info.data.password === '-1' ? '' : info.data.password
                    Clog.Green(ClogKey.Entry, "【case1.1】，通过xiyou启动创建房间，参数:房间名称:" + roomName + "房间类型:" + roomType + "xiyou identify:" + identify + ', password = ' + RoomController.OnJoinPassword);
                    await CreateRoomController.CreateRoom(roomName, roomType, identify, RoomController.OnJoinPassword);
                }
                else if (type == "joinRoom") {
                    RoomController.OnJoinRoomId = info.data.roomId
                    RoomController.OnJoinPassword = info.data.password === '-1' ? '' : info.data.password
                    Clog.Green(ClogKey.Entry, "【case1.1】，通过xiyou启动加入房间，房间Id:" + RoomController.OnJoinRoomId + ', password = ' + RoomController.OnJoinPassword);
                }
            }
        }
        //通过分享加入房间
        else if (xiyouLaunchData.scene == 1007 && xiyouLaunchData.query.hasOwnProperty('type') && xiyouLaunchData.query.type == "shareJoinRoom") {
            Clog.Green(ClogKey.Entry, "【case2】，通过分享链接启动，有参数:" + JSON.stringify(xiyouLaunchData))
            RoomController.OnJoinRoomId = xiyouLaunchData.query.roomId;
            RoomController.OnJoinPassword = xiyouLaunchData.query.password;
            Clog.Green(ClogKey.Entry, "通过分享加入房间，房间Id" + RoomController.OnJoinRoomId + "房间密码 = " + RoomController.OnJoinPassword);
        }
        else {
            Clog.Green(ClogKey.Entry, "【case3】，其它启动，无参数，默认创建房间");
            let roomName = "扫码测试专用语音房"
            let roomType = "friend"
            let identify = new Date().valueOf().toString();
            RoomController.OnJoinPassword = '';
            Clog.Green(ClogKey.Entry, "使用默认创建房间方案，房间名称:" + roomName + "房间类型:" + roomType + "xiyou identify:" + identify + ', password = ' + RoomController.OnJoinPassword);
            await CreateRoomController.CreateRoom(roomName, roomType, identify, RoomController.OnJoinPassword);
        }
        await RoomController.JoinRoom();        //第一次进入房间
        UILoading.Close();
        if (qq) {
            qq.setKeepScreenOn({ keepScreenOn: true })          //设置是否保持常亮状态
            qq.onShow((obj: any) => { this.GameShow(obj) })
            qq.onHide(() => { this.GameHide() })
            this.resetTimer();
        }
        await this.initSubpackages();           //加载分包
        await this.GetTopicConfig();            //获取话题卡配置,要进入房间后，需要rid
        TopicController.EntryTopic();           //刚进入房间，同步一次话题卡
    }

    private static initSystemInfo() {
        //这个参数用于模拟qq的真实systemInfo,可随意修改用于CC_DEV模式中的测试
        let devSystemInfo = {
            "model": "iPhone X",
            "pixelRatio": 2,
            "windowWidth": 414,
            "windowHeight": 896,
            "system": "iOS 10.0.1",
            "language": "zh_CN",
            "version": "7.0.4",
            "screenWidth": 414,
            "screenHeight": 896,
            "SDKVersion": "2.9.1",
            "brand": "devtools",
            "fontSizeSetting": 16,
            "batteryLevel": 100,
            "statusBarHeight": 44,
            "safeArea": {
                "right": 414,
                "bottom": 896,
                "left": 0,
                "top": 44,
                "width": 414,
                "height": 852
            },
            "deviceOrientation": "portrait",
            "platform": "devtools",
            "devicePixelRatio": 2
        }

        let sysInfo = qq ? qq.getSystemInfoSync() : devSystemInfo
        SystemInfoManager.Init(sysInfo);
    }

    /**
     * 加载分包
     */
    private static async initSubpackages() {
        await LaunchManager.LoadSubPackage(EnumSubPackage.Topic);
        await LaunchManager.LoadSubPackage(EnumSubPackage.Xiyou);
        await LaunchManager.LoadSubPackage(EnumSubPackage.Emoji);
        await LaunchManager.LoadSubPackage(EnumSubPackage.EmojiPart1);
        await LaunchManager.LoadSubPackage(EnumSubPackage.EmojiPart2);
    }
    public static HideTime: number = null;
    public static ShowTime: number = null;
    /**
     * qq切出事件
     */
    private static GameHide() {
        Clog.Red(ClogKey.Entry, "【从游戏切到后台】")
        this.HideTime = new Date().valueOf();           //记录hid的时间
    }

    private static resetTimer() {
        this.ShowTime = null;
        this.HideTime = null;
    }

    /**
     * 是否是启动参数
     * @param qqOnShowInfo QQ onshow参数
     */
    private static isLaunchOptions(qqOnShowInfo) {
        if (!EntryController.LaunchOptions) {
            return false
        }
        if (!qqOnShowInfo) {
            return false
        }
        if (EntryController.LaunchOptions.scene != qqOnShowInfo.scene) {
            return false
        }
        if (!EntryController.LaunchOptions.referrerInfo) {
            return false
        }
        if (!qqOnShowInfo.referrerInfo) {
            return false
        }

        let launchOptionsStr = JSON.stringify(EntryController.LaunchOptions.referrerInfo);
        let onShowOptionsStr = JSON.stringify(qqOnShowInfo.referrerInfo);
        Clog.Trace(ClogKey.Entry, "launchOptionsStr=" + launchOptionsStr)
        Clog.Trace(ClogKey.Entry, "onShowOptionsStr=" + onShowOptionsStr)
        if (launchOptionsStr !== onShowOptionsStr) {
            return false
        }
        return true;
        // if (EntryController.LaunchOptions &&
        //     qqOnShowInfo &&
        //     EntryController.LaunchOptions.scene === qqOnShowInfo.scene &&
        //     EntryController.LaunchOptions.referrerInfo &&
        //     qqOnShowInfo.referrerInfo &&
        //     JSON.stringify(EntryController.LaunchOptions.referrerInfo) === JSON.stringify(qqOnShowInfo.referrerInfo)) {
        //     return true;
        // }
        // else {
        //     return false;
        // }
    }

    /**
     * qq切入事件
     * @param qqOnShowInfo qq切入时，带的参数
     */
    private static async GameShow(qqOnShowInfo: any) {
        //特性1：android时，qq不会kill界面，但ios会
        //特性2：ios切入切出，qqOnShowInfo的参数与qq.getLaunchOptionsSync()是一样的，哪怕你切入切出什么都没做，这个qqOnShowInfo也会带有参数
        if (qqOnShowInfo != null) {
            Clog.Green(ClogKey.Entry, "【qqOnShowInfo】:" + JSON.stringify(qqOnShowInfo))
            if (EntryController.isLaunchOptions(qqOnShowInfo) == false) {

                //case1: 切出去的时候，通过xiyou参数再次切入
                if (qqOnShowInfo.scene == 1037 && qqOnShowInfo && qqOnShowInfo.referrerInfo && qqOnShowInfo.referrerInfo.appId) {
                    Clog.Green(ClogKey.Entry, "【case1】 >>: 切出去的时候，通过xiyou参数再次切入")

                    //打开loading
                    if (SystemInfoManager.IsIOS) {
                        qq.showLoading({})
                    }
                    else {
                        UILoading.Open();
                    }

                    RoomController.EndBanBanSocket()                      //断开1   
                    XiYouController.EndXiYouSocket();                      //断开2  
                    await XiYouController.ReconectXiyou();                  //重连xiyou
                    let info = qqOnShowInfo.referrerInfo.extraData;         //解析xiyou参数
                    if (typeof (info) == "string")                          //这个该死的info，在ios端是个obj，但在android是个string,这是qq的坑
                    {
                        info = JSON.parse(qqOnShowInfo.referrerInfo.extraData);
                    }
                    if (info) {
                        let type = info.type;
                        Clog.Green(ClogKey.Entry, "西游type=" + type)
                        if (type == "createRoom") {
                            let roomName = info.data.roomName
                            let roomType = info.data.roomType
                            let identify = info.data.identify
                            // 西游那边自己的房间传-1
                            RoomController.OnJoinPassword = info.data.password === '-1' ? '' : info.data.password
                            Clog.Green(ClogKey.Entry, "通过xiyou创建房间，房间名称:" + roomName + "房间类型:" + roomType + "xiyou identify:" + identify + ', password = ' + RoomController.OnJoinPassword);
                            await CreateRoomController.CreateRoom(roomName, roomType, identify, RoomController.OnJoinPassword);
                        }
                        else if (type == "joinRoom") {
                            RoomController.OnJoinRoomId = info.data.roomId
                            RoomController.OnJoinPassword = info.data.password === '-1' ? '' : info.data.password
                            Clog.Green(ClogKey.Entry, "通过xiyou加入房间，房间Id:" + RoomController.OnJoinRoomId + ', password = ' + RoomController.OnJoinPassword);
                        }
                    }
                    await RoomController.httpJoinRoom(true);                    //重进房间

                    //关闭loading     
                    if (SystemInfoManager.IsIOS) {
                        qq.hideLoading()
                    }
                    else {
                        UILoading.Close();
                    }
                    TopicController.EntryTopic();                           //刚进入房间，同步一次话题卡
                    return
                }

                //case2: 切出去的时候，点了分享链接切入
                if (qqOnShowInfo.scene == 1007 && qqOnShowInfo.query.hasOwnProperty('type') && qqOnShowInfo.query.type == "shareJoinRoom") {
                    Clog.Green(ClogKey.Entry, "【case2】>>: 切出去的时候，点了分享链接切入")
                    //打开loading
                    if (SystemInfoManager.IsIOS) {
                        qq.showLoading({})
                    } else {
                        UILoading.Open();
                    }
                    RoomController.EndBanBanSocket()                              //断开1   
                    XiYouController.EndXiYouSocket();                                     //断开2  
                    await XiYouController.ReconectXiyou();                          //重连xiyou
                    RoomController.OnJoinRoomId = qqOnShowInfo.query.roomId;        //设置房间号
                    RoomController.OnJoinPassword = qqOnShowInfo.query.password           // 设置密码
                    await RoomController.httpJoinRoom(true);                        //重进房间
                    //关闭loading     
                    if (SystemInfoManager.IsIOS) {
                        qq.hideLoading()
                    }
                    else {
                        UILoading.Close();
                    }
                    TopicController.EntryTopic();                           //刚进入房间，同步一次话题卡
                    return
                }
            }
        }

        this.ShowTime = new Date().valueOf();
        if (this.IsLostRoom) {
            //case3 判断是否断开房间
            Clog.Green(ClogKey.Entry, "【case3.1】>> 切出去什么都没干，5秒才后切回来")
            await this.localRelink()
            return;
        }

        if (this.IsDisconnect) {
            Clog.Green(ClogKey.Entry, "【case3.2】>> 切出去什么都没干，5秒内切回来但是断网了")
            await this.localRelink()
            return;
        }

        // //case4 20秒内什么都没干，连回来
        Clog.Green(ClogKey.Entry, "【case5】 >> 5秒内什么都没干，切回来");
        //什么事也没做也要重连语音
        JoinMicController.OpenAgora();
    }


    //本地主动重连
    private static async localRelink() {
        //打开loading
        if (SystemInfoManager.IsIOS) {
            qq.showLoading({})
        } else {
            UILoading.Open();
        }
        RoomController.EndBanBanSocket()                              //断开1   
        XiYouController.EndXiYouSocket();                                     //断开2  
        await XiYouController.ReconectXiyou();                          //重连xiyou
        RoomController.OnJoinRoomId = RoomController.CurRoom.RoomId
        RoomController.OnJoinPassword = RoomController.CurRoom.Password
        await RoomController.httpJoinRoom(true);                        //重进房间
        //关闭loading     
        if (SystemInfoManager.IsIOS) {
            qq.hideLoading()
        }
        else {
            UILoading.Close();
        }
        TopicController.EntryTopic();                           //刚进入房间，同步一次话题卡
    }

    private static get IsLostRoom(): boolean {
        if (this.ShowTime != null && this.HideTime != null) {
            let isHideLongTime = this.ShowTime - this.HideTime > 5 * 1000;    //是否切入时长太久
            Clog.Trace(ClogKey.Entry, "【切出离开时长】" + (this.ShowTime - this.HideTime) / 1000 + "秒")
            this.resetTimer();
            if (isHideLongTime) {
                Clog.Trace(ClogKey.Entry, "qq 【返回游戏】=>【离开时间太长】")
                return true;
            }
        }
        Clog.Trace(ClogKey.Entry, "qq 【返回游戏】=>【5秒内切回来】")
        return false
    }

    private static get IsDisconnect() {
        if (Session.BanBan.UId)     //是否已初始化过
        {
            if (RoomSocket.IsOpen == false) {
                Clog.Trace(ClogKey.Entry, "qq 【返回游戏】=>【ws网络断开连接】")
                return true;
            }
        }
        return false;
    }

    /**
     * iphoneX的UI适应
     * @param widgetArr 
     * @param bottom 
     */
    public static IphoneXUIFit(widgetArr: Array<cc.Widget>, bottom: number) {
        if (SystemInfoManager.IsIphoneX) {
            for (let i = 0; i < widgetArr.length; i++) {
                widgetArr[i].bottom = bottom;
            }
        }
    }

    /**
     * 读取游戏配置，游戏配置在
     */
    private static async readGameConfig(): Promise<boolean> {
        return new Promise(async (resolve) => {
            cc.loader.loadRes('config/GameConfig', (err: Error, data: cc.JsonAsset) => {
                if (err != null) {
                    Clog.Error('load Config Error!')
                    resolve(false);
                }

                SS.Version = data.json["Version"]                           //当前的版本号
                SS.CurPlatform = EnumPlatform['' + data.json["Platform"]];
                SS.CurAppName = data.json["AppName"];
                SS.CurAgoraType = EnumAgoraType['' + data.json["AgoraType"]];
                SS.QQAppId = data.json["QQAppId"];                              //qq的appId
                XiYouController.XiYouAppId = data.json["XiYouAppId"]            //xiyou的appId
                SS.DevUrl = data.json['DevUrl']
                SS.OfficeUrl = data.json['OfficeUrl']
                Clog.Trace(ClogKey.Entry, "GameVersion=" + SS.Version);
                Clog.Trace(ClogKey.Entry, "CurPlatform=" + SS.CurPlatform);
                Clog.Trace(ClogKey.Entry, "CurAppName=" + SS.CurAppName);
                Clog.Trace(ClogKey.Entry, "CurAgoraType=" + SS.CurAgoraType);
                Clog.Trace(ClogKey.Entry, "DevUrl=" + SS.DevUrl);
                Clog.Trace(ClogKey.Entry, "OfficeUrl=" + SS.OfficeUrl);
                Clog.Trace(ClogKey.Entry, "QQAppId=" + SS.QQAppId);
                resolve(true);
            })
        })
    }

    /**
     * 获取服务器环境
     */
    public static async GetEnv() {
        return new Promise(async (resolve) => {
            var url = new XhrUrl("https://xy.iambanban.com/xiyou/env").Query({ key: "version", value: SS.Version }).Url
            let msg = await Xhr.GetJson(url);
            let success = msg['success']
            if (success == false) {
                resolve(false)
                return
            }
            let data = msg["data"]
            let env = data.env as EnumEnv;
            Clog.IsOpenLog = data.log || CC_DEV;
            SS.IsDevMode = env == EnumEnv.Alpha || env == EnumEnv.Dev || CC_DEV;                       //是否是开发模式
            SS.HttpUrl = SS.IsDevMode ? SS.DevUrl : SS.OfficeUrl;
            Clog.Trace(ClogKey.Entry, "是否是测试环境：" + SS.IsDevMode + ",是否开启日志：" + Clog.IsOpenLog)
            resolve(true)
        })
    }

    /**
     * 获取话题卡配置
     */
    public static async GetTopicConfig() {
        if (!RoomController.OnJoinRoomId) {
            Clog.Error("加入房间失败,不能获取话题卡配置");
            return;
        }
        return new Promise(async (resolve) => {
            var url = new XhrUrl("xiyou/topicConfig").Query({ key: "rid", value: RoomController.OnJoinRoomId.toString() }).Url;
            let msg = await Xhr.GetJson(url);
            let success = msg['success']
            if (success == false) {
                resolve(false)
                return
            }
            let data = msg["data"];
            TopicController.InitTopic(data);
            // Clog.Trace(ClogKey.Entry, "话题卡配置：" + JSON.stringify(data))
            resolve(true)
        })
    }

    //重新进入游戏
    public static ReStartGame() {
        cc.audioEngine.stopAll();
        cc.game.restart();
    }
}