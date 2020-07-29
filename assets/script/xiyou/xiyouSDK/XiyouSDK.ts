/**
 *
 * @author zjw_vinnie
 * @time 2020_04_11
 * @Copyright 2020 Chengdu QLD Technology Co.,LTD.
 * XiyouSDK 详细方法作用请查看BaseSDK接口
 * 请条必参照文档进行对接，地址：http://wiki.xiyoudoc.com/sdk/pages/sdk/mini/game_hall_client.html
 * 
 */
import Log from './utils/Log';
import HData from './data/HData';
import QQUtils from './utils/QQUtils';
import Utils from './utils/Utils';
import NetCenterMgr from './utils/NetCenterMgr';
import md5 from './utils/md5';
import MsgDefine from './socket/MsgDefine';
import { BaseSDK } from './base/BaseSDK';
export class XiyouSDK implements BaseSDK {
    private static _ins: XiyouSDK;
    public static get Ins(): XiyouSDK {
        if (!this._ins) {
            this._ins = new XiyouSDK();
        }
        return this._ins;
    }

    constructor() {
    }


    /**
     * 是否已经初始化
     */
    public isInit(): boolean {
        return HData.isInitSdk;
    }

    /**
     * 重置所有
     * 
     */
    public resetAllParam(): void {
        HData.isInitSdk = false;		//是否初始化
        HData.isShowLog = false;			//是否显示log
        HData.appId = "";					//对接方appId
        HData.gsToken = "";					//除了登录外，其余所有消息发送时所带的标志
        HData.sendMsg = null;				//对接方提供发送消息的方法
        HData.NetObj = null;				//对接方提供发送消息方法所在类的对象
        HData.isNeedAuthorize = false;		//是否需要授权，默认false

        NetCenterMgr.Ins.removeAllListeners();	//移除所有监听
    }

    /**
     * 初始化
     */
    public initConfig(data: any): void {
        if (!data.appId ||
            !data.callFunc || !data.funcObj ||
            !data.sendMsgFunc || !data.netObj) {
            Log.showWarn("XYSDK - 初始化缺少参数")
            return;
        }
        Log.showWarn("XYSDK - 开始初始化：", data)
        HData.isInitSdk = true;
        HData.appId = data.appId;
        HData.sendMsg = data.sendMsgFunc;
        HData.NetObj = data.netObj;
        HData.isShowLog = !!data.isShowLog;
        let isTest: boolean = !!data.isDebug;
        if (isTest) {
            HData.hallSocketUrl = "wss://testcenter-yqwsq-xiyou.xiyouchat.com:3000/getServer";
        }
        HData.requestAddr = "https://apigateway.52xiyou.com/api/center_server/game/version/";
        HData.requestAddr = HData.requestAddr + HData.appId + "/" + HData.CLIENTVERSION;
        let hasObj: boolean = QQUtils.Ins.doRequest(HData.requestAddr, 'GET', null, function (res) {
            if (res.data && res.data.status === 200 && res.data.data && res.data.data.center_addr) {
                if (!isTest) {
                    HData.hallSocketUrl = res.data.data.center_addr;
                }
            }
            if (data.callFunc && data.funcObj) {
                data.callFunc.apply(data.funcObj);
            }
        }, function (res) {
            if (data.callFunc && data.funcObj) {
                data.callFunc.apply(data.funcObj);
            }
        })
        if (!hasObj) {
            if (data.callFunc && data.funcObj) {
                data.callFunc.apply(data.funcObj);
            }
        }
    }

    /**
     * 初始化websocket地址
     * 
     */
    public initSocketUrl(isTest: boolean = false): void {
        if (!HData.appId) {
            Log.showWarn("XYSDK - 初始化websocket地址，缺少appId");
            return;
        }
        if (isTest) {
            HData.hallSocketUrl = "wss://testcenter-yqwsq-xiyou.xiyouchat.com:3000/getServer"
        } else {
            HData.requestAddr = HData.requestAddr + HData.appId + "/" + HData.CLIENTVERSION;
            QQUtils.Ins.doRequest(HData.requestAddr, 'GET', null, function (res) {
                if (res.data && res.data.status === 200 && res.data.data && res.data.data.center_addr) {
                    HData.hallSocketUrl = res.data.data.center_addr;
                }
            }, function (res) {
                //失败
            })
        }
    }
	/**
	 * 获取websocket地址
	 */
    public getSocketUrl(): string {
        return HData.hallSocketUrl;
    }
	/**
	 * 发送心跳包
	 */
    public sendHeartBeat(): void {
        this.sendMsg(MsgDefine.U_HEAR_MSG, {});
    }

	/**
	 * 登录
	 */
    public login(data1: any, data2: any): void {
        Log.showWarn("XYSDK - 开始登录 - ", "data1：", data1, "data2：", data2);
        if (!data1) {
            Log.showWarn("XYSDK - 获取 qq.getSystemInfoSync() 数据失败，请检查");
            return;
        }
        if (!data2) {
            Log.showWarn("XYSDK - 获取 qq.login() 数据失败，请检查");
            return;
        }
        if (!HData.appId) {
            Log.showWarn("XYSDK - 登录，缺少appId");
            return;
        }
        let tData: any = {};
        let userAgent = navigator.userAgent.toLowerCase();
        let arr: any[] = userAgent.split(";");
        let model: string = (arr && arr.length > 4) ? arr[arr.length - 5] : "";
        if (model != "") {
            model = model.substr(model.lastIndexOf("(") + 1, model.length);
        }

        tData.appId = HData.appId;
        //说明，这个data1是qq.getSystemInfoSync()获取的data1
        //data2是登录qq.login获取的data2
        let ua = '{"client":"' + data1.data.system + '","rom":"' + data1.data.SDKVersion
            + '","mac":"","gversion":"' + HData.H5_VERSION
            + '","gversion_str":"' + HData.H5_VERSION
            + '","rom_str":"6","version":"' +
            + '","model":"' + model
            + '","uid":"' + data1.data.model
            + '","kid":"' + data1.data.model
            + '","realVersion":"' + HData.H5_VERSION
            + '","h5_version":"' + ""//LrsHallConst.H5HALL_VERSION
            + '","mversion":"' + data1.data.version
            + '","appToken":""' +
            ',"clientApp":""}'
        tData.ua = ua;
        tData.code = data2.data.code;
        tData.isFromIM = false;
        HData.gsToken = "";
        this.sendMsg(MsgDefine.U_USER_LOGIN, tData);
    }
	/**
	 * 发送玩家数据
	 */
    public sendPlayerInfo(defaultData: any, data: any): void {
        Log.showWarn("XYSDK - 发送玩家信息：", defaultData, data);
        if (data && data.userInfo) {
            defaultData.avatarUrl = data.userInfo.avatarUrl;
            defaultData.city = data.userInfo.city;
            defaultData.country = data.userInfo.country;
            defaultData.language = data.userInfo.language;
            defaultData.nickName = data.userInfo.nickName;
            defaultData.province = data.userInfo.province;
            defaultData.gender = data.userInfo.gender;
        }
        this.sendMsg(MsgDefine.U_INFO_POST, defaultData);
    }
	/**
	 * 获取礼物列表
	 */
    public getGiftList(): void {
        Log.showWarn("XYSDK - 获取礼物列表")
        this.sendMsg(MsgDefine.REQUEST_GET_GIFT_PANEL, { types: "2011" });
    }

    /**
     * 消耗物品
     */
    public costGoods(type: string, productId: string, num: number, price: number, roomId: string, orderNo: string, cbURL: string, param: string = "", toArrs: any = []): void {
        Log.showWarn("XYSDK - 消耗物品：", type, productId, num, price, roomId, orderNo, cbURL, param, toArrs);
        this.sendMsg(MsgDefine.COST_GOODS, { type: type, productId: productId, num: num, price: price, roomId: roomId, orderNo: orderNo, cbURL: cbURL, param: param, toArrs: toArrs });
    }

    /**
     * 玩家礼物墙等详请
     */
    public getAccountInfo(id: number): void {
        Log.showWarn("XYSDK - 玩家详请：", id);
        this.sendMsg(MsgDefine.REQUEST_ACCOUNT_INFO, { userId: id });
    }

    /**
     * 添加好友，不用管flag
     */
    public addFriend(id: number, flag: number = 1): void {
        Log.showWarn("XYSDK - 玩家详请：", id);
        this.sendMsg(MsgDefine.ADD_FRIEND, { momoId: id, flag: flag });
    }

	/**
	 * 封装特殊msg
	 */
    public baseSendMsg(idx: string, msg: any): any {
        if (!msg) {
            msg = {};
        }

        if (HData.gsToken) {
            msg.code = HData.gsToken;
        }

        let newMsg = Utils.calcSumStr(msg);
        if (HData.gsToken) {
            if (HData.gsToken.length >= 16) {
                newMsg = newMsg + HData.gsToken.slice(0, 16);
            } else {
                newMsg = newMsg + HData.gsToken;
            }
        }
        let md5Str: string = new md5().hex_md5(newMsg).toLocaleLowerCase();
        let obj: any = { header: { msgCode: idx, version: HData.H5_VERSION }, body: { data: msg, sum: md5Str } };
        let data: string = JSON.stringify(obj);
        return data;
    }
	/**
	 * 网络发送
	 */
    public sendMsg(interfaStr: string, data: any): void {
        if (HData.sendMsg && HData.NetObj) {
            HData.sendMsg.apply(HData.NetObj, [interfaStr, data]);
        } else {
            Log.showWarn("XYSDK - 对接方网络方法丢失，请检查")
        }

    }

}