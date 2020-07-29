import Xhr, { XhrUrl } from "../../../base/script/api/http/Xhr";
import { BanBanData } from "../model/BanBanData";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { IsNullOrEmpty } from "../../../base/script/util/StringUtil";
import { qq } from "../../../base/script/global/SS";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { UIAuthorize } from "../../authorize/UIAuthorize";
import NetCenterMgr from "../../xiyou/xiyouSDK/utils/NetCenterMgr";
import MsgDefine from "../../xiyou/xiyouSDK/socket/MsgDefine";
import { XiyouSDK } from "../../xiyou/xiyouSDK/XiyouSDK";
import HData from "../../xiyou/xiyouSDK/data/HData";
import { XiyouData } from "../model/XiYouData";
import { Session } from "../model/SessionData";
import { XiYouGiftTable } from "../../xiyou/config/XiYouGiftConfig";
import { Report } from "../../other/Report";


export class LoginController {

    //专用于测试xiyou登录的数据，方便在web中直接测试
    public static DebugXiYouInfo: {
        id: number,
        avatarUrl: string,
        city: string,
        country: string,
        language: string,
        nickName: string,
        province: string,
        gender: number
    }

    //是否已登录
    public static get isLogined() {
        if (Session.BanBan.UId == null) {
            return false
        }
        if (Session.BanBan.Token == null) {
            return false
        }
        return true
    }

    /**
    * 登录流程step1的结果，为qq登录返回的数据
    *参考值如下： 
    {
        errMsg: "login:ok",
        code: "30001"
    }
    */
    private static Step1Result: any

    /**
     * 登录流程step2的结果，为xiyou方返回的数据 
     * 参考数据
     * {
        "ret": true,
        "needAuthorize": true,
        "ChineseUser": false,
        "LiteGameLoginWhiteListUser": false,
        "profile": {
            "momoId": "102329",
            "name": "",
            "age": 0,
            "hometown": "未知",
            "sex": "M",
            "constellation": "",
            "photos": [],
            "vip": "",
            "vipLevel": 0,
            "sign": "",
            "level": 0,
            "headIcon": "",
            "richVal": 0,
            "homeCity": "",
            "wealthVal": "0",
            "unionId": "30001",
            "openId": "30001",
            "playerId": 102329,
            "userIdOnGameHall": "102329",
            "deposit": 10000,
            "charmValue": 0,
            "todayCharmVal": 0,
            "gold": 0,
            "happyRound": 0,
            "standardRound": 0,
            "chatRound": 0,
            "videoRound": 0,
            "winRate": 0,
            "experience": 0,
            "honor": 0,
            "escapeCount": 0,
            "winCount": 0,
            "loseCount": 0,
            "totalCount": 0,
            "worthIndex": 0,
            "worthGiftName": null,
            "popularityVal": 0,
            "freshRouds": 0,
            "conan12Round": 0,
            "videoFreshRound": 0,
            "freshStandRound": 0,
            "seniorRound": 0,
            "guessRound": 0,
            "singGuessRound": 0,
            "drawRound": 0,
            "freshWinRate": 0,
            "happyWinRate": 0,
            "standWinRate": 0,
            "chatWinRate": 0,
            "videoWinRate": 0,
            "conan12WinRate": 0,
            "videoFreshRate": 0,
            "freshStandRate": 0,
            "seniorWinRate": 0,
            "guessScore": 0,
            "singGuessPoint": 0,
            "drawPoint": 0,
            "underCoverRound": 0,
            "underCoverScore": 0,
            "giftNumber": 0,
            "giftList": [],
            "longitude": 0,
            "latitude": 0,
            "distance": "0.00km",
            "hideWealthVal": 0,
            "balance": 0,
            "momoney_tips": "",
            "pa": "",
            "uid": "870679",
            "gift": null,
            "thumbsUpCount": 0,
            "kickRoomId": 0,
            "kickCD": 0,
            "charmLevel": 0,
            "auditionChampionCount": 0,
            "auditionPassportCount": 0,
            "singerHeat": 0,
            "signWorth": 0,
            "multiPlayerDiceRound": 0,
            "multiPlayerDiceScore": 0,
            "hiddenMode": 0,
            "userIp": "117.152.92.134",
            "giftGoto": "goto = \"[|url|https://mvip.immomo.com/s/gift/my_gift_list.html?_bid=1157&src=profile]\"",
            "userRelation": "None",
            "guard": [],
            "selfGuardValue": "0",
            "regionCode": "0",
            "saleLevel": 0,
            "liteGameTotalRound": 0,
            "liteGameEscapeCount": 0,
            "liteGameFrequently": null,
            "isGS": 0,
            "isSp": 0,
            "spId": "0",
            "liteGameHaremLevel": 0,
            "dateGameStarLevel": 0,
            "cared": 0,
            "systemLabels": null,
            "optionaLabels": null,
            "adminAccount": false,
            "vipYear": false
        },
        "session_key": "30001",
        "TestUser": false
    }
     */
    private static Step2Result: any


    /**
     * 从QQ授权的数据
     * 参考如下：
    {
        userInfo:
        {
            avatarUrl: "https://thirdqq.qlogo.cn/qqapp/1109893603/D1C4376E896DCA65BB37B067AAB211FB/100";
            city: "武汉",
            country: "中国",
            language: "中文",
            nickName: "测试玩家" + 30001,
            province: "湖北",
            gender: 1
        }
     }
     */
    private static Step3Result: any;

    /**
     * 第1步，登录QQ服务器
     */
    public static async Step1LoginQQ(): Promise<boolean> {
        Clog.Green(ClogKey.Net, "【第1步，登录QQ服务器】");
        return new Promise(resolve => {
            if (CC_DEV) {
                //方便web中测试，不用真正的去进行qq登录,这个是xiyou那边给的测试号
                this.Step1Result = {
                    errMsg: "login:ok",
                    code: this.DebugXiYouInfo.id
                }
                resolve(true)
                return
            }

            qq.login({
                success: (res: any) => {
                    console.warn("qq login success", res);
                    if (res.errMsg.endsWith(":ok")) {
                        this.Step1Result = res;
                        Clog.Trace(ClogKey.Net, "Step1 登录QQ服务器成功" + JSON.stringify(res));
                        resolve(true);
                        return
                    }
                    Clog.Trace(ClogKey.Net, "Step1 登录QQ服务器失败" + JSON.stringify(res.errMsg));
                    resolve(res.errMsg);
                },
                fail: (res: any) => {
                    Clog.Trace(ClogKey.Net, "Step1 登录QQ服务器失败" + JSON.stringify(res));
                    resolve(false);
                }
            })
        });
    }


    /**
     * 第2步，登录xiyou服务器
     */
    public static async Step2LoginXiyou(): Promise<boolean> {
        Clog.Green(ClogKey.Net, "【第2步，登录xiyou服务器】");
        let sysInfo: any = null;
        //方便web中测试，不用真正的去getSystemInfoSync
        if (CC_DEV) {
            sysInfo =
            {
                errMsg: "getSystemInfoSync:ok",
                brand: "devtools",
                model: "iPhone 5",
                pixelRatio: 2,
                screenWidth: 320,
                screenHeight: 568,
                windowWidth: 320,
                windowHeight: 568,
                statusBarHeight: 20,
                language: "zh_CN",
                version: "6.6.3",
                system: "iOS 12.0.1",
                platform: "devtools",
                fontSizeSetting: 16,
                SDKVersion: "1.14.0",
                benchmarkLevel: 1,
                AppPlatform: "qq",
                devicePixelRatio: 2,
                SDKBuild: "00247"
            }
        }
        else {
            sysInfo = qq.getSystemInfoSync()
        }

        return new Promise(resolve => {
            NetCenterMgr.Ins.registerMsgListener(MsgDefine.U_USER_LOGIN, async (msgkey: string, msgver: string, info: any) => {
                Clog.Trace(ClogKey.Net, "【Step2 登录xiyou服务, info】:" + JSON.stringify(info));
                if (info && info.ec != 0) {
                    resolve(false);
                    return;
                }
                HData.isNeedAuthorize = info.data.needAuthorize || false
                HData.gsToken = info.data.session_key;    //请不要修改HData.gsToken
                this.Step2Result = info.data.profile
                Session.XiYou = new XiyouData(info.data.profile);
                XiYouGiftTable.Init(info.data.gifts.lists[2011])
                Clog.Trace(ClogKey.Net, "【Step2 登录xiyou服务器成功, Result】:" + JSON.stringify(this.Step2Result));
                Clog.Trace(ClogKey.Net, "【Step2 登录xiyou服务器成功, xiyou数据:" + JSON.stringify(Session.XiYou));
                resolve(true);
            }, this, true);

            //正式登录xiyou
            Clog.Trace(ClogKey.Net, "【Step2 登录xiyou服务器参数】\t\n 【data1】:" + JSON.stringify(sysInfo) + "\t\n【data2】:" + JSON.stringify(this.Step1Result));
            XiyouSDK.Ins.login({ data: sysInfo }, { data: this.Step1Result });
        })
    }



    /**
     * 第3步，获取QQ授权信息
     */
    private static async Step3GetQQAuthorize(): Promise<boolean> {
        Clog.Green(ClogKey.Net, "【第3步，获取QQ授权信息】");
        return new Promise(async (resolve) => {

            if (CC_DEV) {
                this.Step3Result = {
                    userInfo: this.DebugXiYouInfo
                }
                XiyouSDK.Ins.sendPlayerInfo({
                    avatarUrl: "",
                    city: "",
                    country: "",
                    language: "",
                    nickName: "",
                    province: "",
                    gender: 2
                }, this.Step3Result);
                resolve(true)
                return
            }

            if (HData.isNeedAuthorize) {

                let authorized = await new Promise(resolve1 => {
                    qq.getSetting({
                        success(res) {
                            resolve1(!!res.authSetting['scope.userInfo']);
                        }
                    });
                });

                if (!authorized) {
                    await UIManager.OpenUI(UIAuthorize);
                    await UIAuthorize.Instance.DonePromise;
                }

                qq.getUserInfo({
                    withCredentials: true,
                    success: (res: any) => {
                        if (res.errMsg.endsWith(":ok")) {
                            this.Step3Result = res;
                            Clog.Trace(ClogKey.Net, "【Step3 QQ授权成功】， res=" + JSON.stringify(res));
                            XiyouSDK.Ins.sendPlayerInfo(
                                {
                                    avatarUrl: "",
                                    city: "",
                                    country: "",
                                    language: "",
                                    nickName: "",
                                    province: "",
                                    gender: 2
                                },
                                res
                            );

                            resolve(true);
                            return
                        }
                        Clog.Trace(ClogKey.Net, "【Step3 QQ授权失败】：" + res.errMsg)
                        resolve(false);
                        return
                    },
                    fail: (res: any) => {
                        Clog.Trace(ClogKey.Net, "【Step3 QQ授权失败】：" + JSON.stringify(res))
                        resolve(false);
                    }
                })
            }
            else {
                resolve(true);
                Clog.Trace(ClogKey.Net, "【Step3 无需QQ授权，这一步pass】")
            }
        })
    }



    /**
     * 第4步，登录我们自己的服务器
     */
    private static async Stpe4LoignAppServer(): Promise<boolean> {
        Clog.Green(ClogKey.Net, "Stpe4 登录我们自己的服务器");
        return new Promise(async (resolve) => {
            let url = new XhrUrl('xiyou/login').Url
            let postData = {
                params: JSON.stringify(this.Step2Result)
            }
            let msg = await Xhr.PostJson(url, postData)
            let success = Boolean(msg['success'])
            if (!success) {
                resolve(false)
            }
            Session.BanBan = new BanBanData(msg['data'])
            Clog.Trace(ClogKey.Net, "Step4，登录我们自己的服务器成功, Session=" + JSON.stringify(Session));
            Session.BanBan.OpenId = msg['openId']
            if (!IsNullOrEmpty(Session.BanBan.Token)) {
                Xhr.SetHeaderToken(Session.BanBan.Token)
                resolve(true);
            }
            resolve(false)
        })
    }

    /**
     * 该类的入口
     */
    public static async Login() {
        await Report.Boot("Login")      //点击登录时，上报一次登录形为

        let isStep1Ok = await this.Step1LoginQQ()
        if (!isStep1Ok) {
            Clog.Error("login step 1 error!");
            return;
        }

        let isStep2Ok = await this.Step2LoginXiyou();
        if (!isStep2Ok) {
            Clog.Error("login step 2 error!");
            return;
        }

        let isStep3Ok = await this.Step3GetQQAuthorize();
        if (!isStep3Ok) {
            Clog.Error("login step 3 error!");
            return;
        }

        let isStep4Ok = await this.Stpe4LoignAppServer();
        if (!isStep4Ok) {
            Clog.Error("login step 4 error!");
            return;
        }

        //登录成功后，再上报一次登录形为
        await Report.Boot("Login")
        //上报用户手机型号等信息
        await Report.Version();
    }



}

