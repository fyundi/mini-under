import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { RoomController } from "../../room/controller/RoomController";
import Xhr, { XhrUrl } from "../../../base/script/api/http/Xhr";
import { XiyouSDK } from "../xiyouSDK/XiyouSDK";
import NetCenterMgr from "../xiyouSDK/utils/NetCenterMgr";
import MsgDefine from "../xiyouSDK/socket/MsgDefine";
import { UIToast } from "../../common/view/UIToast";
import { SS } from "../../../base/script/global/SS";
import { Md5Util } from "../../other/Md5Util";
import { Session } from "../../login/model/SessionData";
import { ArrayRemove } from "../../../base/script/util/ArrayUtil";
import { EventCommond } from "../../other/EventCommond";
import { GiftTargetData } from "../../sendGift/model/GiftTargetData";
import { XiYouGiftConfig, XiYouGiftTable } from "../config/XiYouGiftConfig";





interface step1PostData {
    appId: string,
    giftId: number,
    giftName: string,
    giftNum: number,
    giftPrice: number,
    money: number,
    from: number,
    to: string[],
    rid: number,
    sign: string
}

interface Step1Restul {
    orderNo: string,
    to: any   //服务器返回的数据是kv结构，k为banban服务器的uid,v为对应的xiyou的momoId
}

interface step2PostData {
    type: string, 				//1：赠送物品 2：个人道具消耗   
    toArrs: string[],           //当type为1时，为接收方玩家momoId数组，当type为2时，toArrs无意义   
    roomId: string, 		    //房间id
    productId: string, 			//商品id 
    num: number,  				//数量
    price: number 			    //价格,分为单位   
    orderNo: string, 	        //订单号
    cbURL: string,               //西游回调地址
    param: string                //回调地址所传参数
}

interface step3PostData {
    orderNo: string,
    success: number,
    message: string,
    sign: string
}


export class XiYouGiftManager {


    /**
    * 当前赠送的礼物的数据结构,Id:礼物的Id,Num礼物的数量
    */
    public static CurSendGiftInfo: { Num: number, Id: number; }

    /**
    * 当前赠送的礼物的玩家对象
    */
    public static CurSendGiftTarget: GiftTargetData = new GiftTargetData();

    //重置选择到默认值
    public static ResetCurSendGiftInfo() {
        this.CurSendGiftInfo = {
            Id: XiYouGiftTable.AllConfig[0].Id,
            Num: 1
        }
    }

    /**
     * 赠送礼物的api
     */
    public static async GiftSend() {
        Clog.Green(ClogKey.Net, "[gift send] from:" + Session.BanBan.UId + ", to:" + this.CurSendGiftTarget.UIdList.toString() + ",giftId:" + this.CurSendGiftInfo.Id);

        let isStep1Ok = await this.Step1GetGiftOrderNo()
        if (!isStep1Ok) {
            UIToast.Show("获取礼物订单错误")
            return;
        }

        let isStep2Ok = await this.Step2XiyouCostItem()
        if (!isStep2Ok) {
            UIToast.Show("赠送礼物失败")
            return;
        }

        let isStep3Ok = await this.Step3SendGiftResult()
        if (!isStep3Ok) {
            UIToast.Show("同步礼物结果错误")
            return;
        }

        let isStep4Ok = await this.Setp4GetXiyouUserInfo()
        if (!isStep4Ok) {
            UIToast.Show("同步数据出错")
            return;
        }
    }

    /**
     * 送礼物step1的结果
     */
    private static step1Result: Step1Restul;


    /**
    * 第1步，获取礼物订单号
    */
    private static Step1GetGiftOrderNo(): Promise<boolean> {
        return new Promise(async (reslove) => {
            let url = new XhrUrl("xiyou/createOrder").Url

            let giftConfig = XiYouGiftTable.GetGiftConfigById(this.CurSendGiftInfo.Id)
            let postData: step1PostData = {
                appId: SS.QQAppId,
                giftId: this.CurSendGiftInfo.Id,
                giftName: giftConfig.Name,
                giftNum: this.CurSendGiftInfo.Num,
                giftPrice: giftConfig.Price,
                money: giftConfig.Price * this.CurSendGiftTarget.UIdList.length,
                from: Session.BanBan.UId,
                to: this.CurSendGiftTarget.ToString(),
                rid: RoomController.CurRoom.RoomId,
                sign: null
            }
            let sign = Md5Util.GenSign(postData)
            postData.sign = sign

            let msg = await Xhr.PostJson(url, postData)
            let success = msg['success']
            if (!success) {
                reslove(false)
                return
            }

            this.step1Result = msg['data']
            Clog.Trace(ClogKey.Net, "[Step1 success, resp]:" + JSON.stringify(this.step1Result))
            reslove(true)
        })
    }


    private static step2Result: { success: number, gold: number, deposit: number, message: string }
    private static Step2XiyouCostItem() {
        return new Promise(async (reslove) => {
            let req = () => {
                let giftConfig = XiYouGiftTable.GetGiftConfigById(this.CurSendGiftInfo.Id)

                let momoIds = []
                for (let index = 0; index < this.CurSendGiftTarget.UIdList.length; index++) {
                    const uid = this.CurSendGiftTarget.UIdList[index];
                    if (this.step1Result.to[uid]) {
                        momoIds.push(this.step1Result.to[uid])
                    }
                }

                let postData: step2PostData = {
                    type: "1",
                    toArrs: momoIds,
                    roomId: RoomController.CurRoom.RoomId.toString(),
                    productId: this.CurSendGiftInfo.Id.toString(),
                    num: this.CurSendGiftInfo.Num,
                    price: giftConfig.Price * this.CurSendGiftTarget.UIdList.length,           //总价
                    orderNo: this.step1Result.orderNo,
                    cbURL: SS.HttpUrl + "xiyou/payCallback",                              //通知xiyou服务器，消耗的回调地址
                    param: "",
                }
                Clog.Green(ClogKey.Net, "[Step2XiyouCostItem req], postData=" + JSON.stringify(postData));
                XiyouSDK.Ins.costGoods(postData.type, postData.productId, postData.num, postData.price, postData.roomId, postData.orderNo, postData.cbURL, postData.param, postData.toArrs)
            }
            let resp = (msg: any) => {
                this.step2Result = {
                    success: msg["success"],
                    deposit: msg["deposit"],
                    message: msg["message"],
                    gold: msg["gold"],
                }
                if (this.step2Result.success != 0) {
                    UIToast.Show(this.step2Result.message)
                    reslove(false)
                    return
                }
                Session.XiYou.Deposit = this.step2Result.deposit;
                Session.XiYou.Gold = this.step2Result.gold;
                SS.EventCenter.emit(EventCommond.OnXiYouMoneyChange)
                Clog.Green(ClogKey.Net, "礼物赠送成功，Deposit=" + Session.XiYou.Deposit);
                reslove(true)
            }
            NetCenterMgr.Ins.registerMsgListener(MsgDefine.COST_GOODS, (msgkey: string, msgver: string, info: any) => {
                Clog.Green(ClogKey.Net, "[Step2XiyouCostItem resp], info=" + JSON.stringify(info));
                if (info && info.ec == 0) {
                    resp(info.data)
                }
            }, this, true);
            req();
        })
    }

    /**
     * 第3步，通知banban服务器，在xiyou那边的消耗结果,方便banban服务器与xiyou服务器就消耗结果进行对账
     */
    private static Step3SendGiftResult() {
        return new Promise(async (reslove) => {
            let url = new XhrUrl("xiyou/sendGiftResult").Url

            let orderResult: step3PostData = {
                orderNo: this.step1Result.orderNo,
                success: this.step2Result.success,
                message: this.step2Result.message,

                sign: null
            }

            let sign = Md5Util.GenSign(orderResult)
            orderResult.sign = sign;

            let msg = await Xhr.PostJson(url, orderResult)
            let success = msg['success']
            if (!success) {
                reslove(false)
                return
            }
            let data = msg['data']

            reslove(true)
        })
    }

    private static Setp4GetXiyouUserInfo() {
        return new Promise(async (reslove) => {
            let req = () => {
                XiyouSDK.Ins.getAccountInfo(Session.XiYou.MomoId);
            }
            let resp = (msg: any) => {
                Session.XiYou.VIP = msg.data.vipGrade.vipGrade;
                Clog.Green(ClogKey.Net, "[Setp4更新玩家VIP],Session.XiYou.VIP " + Session.XiYou.VIP);
            }
            NetCenterMgr.Ins.registerMsgListener(MsgDefine.REQUEST_ACCOUNT_INFO, (msgkey: string, msgver: string, info: any) => {
                Clog.Green(ClogKey.Net, "[Setp4GetXiyouUserInfo resp], info=" + JSON.stringify(info));
                if (info && info.ec == 0) {
                    resp(info.data)
                }
                else {
                    Clog.Error("Setp4GetXiyouUserInfo error")
                }
            }, this, true);
            req();
        })
    }

}

