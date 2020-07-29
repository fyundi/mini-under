import * as msgpack from "msgpack-lite";
import { RoomSocketSync } from "./RoomSocketSync";
import Clog, { ClogKey } from "../../../../base/script/frame/clog/Clog";
import { RoomHeatBeat } from "../heartBeat/RoomHeatBeat";
import { UIToast } from "../../view/UIToast";



export class RoomSocket {

    private static ws: WebSocket;
    private static RerlinkTimer: number = 0;                    //重连次数计时器
    private static linkIndex = 0                                //第index初始化连接   
    private static sendIndex = 1;                               //第index发送数据

    //#region ----------- websocket 基础方法----------------------------

    //初始化
    public static async OnInit(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            this.linkIndex++;
            Clog.Purple(ClogKey.Net, "RoomSocket >>> OnInit >>>  url:" + url + ', linkIndex:' + this.linkIndex);
            this.ws = new WebSocket(url);
            this.ws.binaryType = "arraybuffer";

            //长连接打开
            this.ws.onopen = () => {
                Clog.Trace(ClogKey.Net, "RoomSocket open success! url:" + url);

                if (this.RerlinkTimer > 0) {
                    Clog.Trace(ClogKey.Net, 'Websocket 初始化成功，重连次数清零')
                    this.RerlinkTimer = 0;
                }

                resolve(true)
            };

            //有消息过来
            this.ws.onmessage = (event: any) => {

                let msg = msgpack.decode(new Uint8Array(event.data))
                         
                //MMP的，服务器过来的数据没有统一格式，有可能是json，有可能是jsonString

                //case 1.服务器发来的全是数字，表示是回复ping消息，我TM想问，以后要是有人新增一串纯数字消息怎么办？ [服气+1]
                if (Number.isInteger(msg)) {
                    RoomHeatBeat.OnHeatBeat(msg);
                    return;
                }
                else if (cc.js.isString(msg)) {
                    Clog.Purple(ClogKey.Net, "[源数据，jsonString] << " + msg);
                }
                else {
                    Clog.Purple(ClogKey.Net, "[源数据，json] << " + JSON.stringify(msg));
                }

                //case 2.服务器发来的数据有属性s且有i，表示是请求回应，[服气+1 我TM真服这种数据设计]
                if (msg.hasOwnProperty('s') && msg.hasOwnProperty('i')) {
                    Clog.Purple(ClogKey.Net, "【请求响应】");
                    this.onCallResp(msg)
                    return;
                }


                //case 3 看content字段
                if (msg.hasOwnProperty('content') && msg.hasOwnProperty('type')) {

                    let content = msg.content;
                    let msgType: string = msg.type

                    //case 3.1 通过type字段去判断 [服气-1，这TM是服务器数据结构设计中唯一还算比较合理的字段]
                    switch (msgType) {
                        case "RC:TxtMsg":
                            {
                                if (content.hasOwnProperty('extra')) // [服气+1 依然是通过有无字符判断]
                                {
                                    let extra = content.extra

                                    //3.1.1 判断content.content
                                    if (content.hasOwnProperty('content')) // [服气+1 依然是通过有无字判断]
                                    {
                                        let subContent: string = content.content

                                        //系统显示欢迎
                                        //参考数据 {"targetId":193179637,"type":"RC:TxtMsg","content":{"content":"欢迎","extra":{"type":"notify","online":0,"version":58,"vip":0,"vip_new":0,"title":0,"top":0,"top_month":0,"top_week":0,"name":null,"uid":0,"icongray":true,"now":1588735152,"hotNum":0,"mounts":null,"_uuid":"193179637.5eb22cb0e3b3d","defends":0},"messageId":0}}
                                        if (extra.type && extra.type == "notify" && subContent.indexOf("欢迎") >= 0) {
                                            Clog.Purple(ClogKey.Net, "【欢迎】 << " + JSON.stringify(content));
                                            RoomSocketSync.SyncRoomWellcome(content)
                                            return;
                                        }

                                        //系统显示打赏信息
                                        //参考数据 {"targetId":193181082,"type":"RC:TxtMsg","content":{"content":"宋江打赏了公孙胜","extra":{"uuid":"5ef888fadaa1f3.12941617","type":"package","from":"宋江","uid":105000974,"icon":"202006/16/5ee8daa9675ac6.31716764.bmp","icongray":true,"to":"公孙胜","to_uid":105000983,"vip":1,"vip_new":1,"title":0,"price":0.01,"uids":["105000983"],"gift":{"id":20101,"name":"比心","price":1,"type":"normal","size":1603660,"with_end":1,"_num":1,"_position":-1,"displayNormalGiftRatio":"","displayNormalGiftType":"multiframe","size_big":0,"worthy":0},"defends":0,"box-gift":0,"giftNumMap":[],"boxName":"","defend":0},"messageId":0}}
                                        if (extra.type && extra.type == "package" && subContent.indexOf("打赏") >= 0) {
                                            Clog.Purple(ClogKey.Net, "【打赏】 << " + JSON.stringify(content));
                                            RoomSocketSync.SyncRoomSendGift(content)
                                            return;
                                        }

                                        //系统A将B踢出房间
                                        //参考数据{"targetId":193181082,"type":"RC:TxtMsg","content":{"content":"公孙胜被宋江请出房间10分钟","extra":{"type":"system"},"messageId":0}}
                                        if (extra.type && extra.type == "system" && subContent.indexOf("请出房间") >= 0) {
                                            Clog.Purple(ClogKey.Net, "【请出房间】 << " + JSON.stringify(content));
                                            RoomSocketSync.SyncRoomKickInfo(content)
                                            return;
                                        }

                                        //系统推送文字内容不合法
                                        if (extra.type && extra.type == "system" && subContent.indexOf("内容违规") >= 0) {
                                            UIToast.Show(subContent)
                                            return
                                        }
                                    }

                                    //3.1.2 表情
                                    //参考数据 :[receive message ] << {"targetId":193179637,"type":"RC:TxtMsg","content":{"extra":{"duration":0,"emote_data":[],"title":0,"is_guess":false,"emote":"mimi_new","emote_position":-1,"emote_sender":105000448,"vip_new":0,"vip":0,"icongray":true},"content":"色迷迷","user":{"id":105000448,"name":"new","portraitUri":"202002/07/5e3d1090932773.67914860.gif"},"messageId":0}}
                                    if (extra.hasOwnProperty('emote')) // [服气+1 依然是通过有无字判断]
                                    {
                                        Clog.Purple(ClogKey.Net, "【表情】<< " + JSON.stringify(content));
                                        RoomSocketSync.SyncRoomEmoji(content)
                                        return
                                    }

                                    //3.1.3 纯聊天
                                    //参考数据 {"targetId":193179637,"type":"RC:TxtMsg","content":{"extra":{"vip_new":0,"vip":0,"title":0,"is_guess":false,"icongray":true},"content":"abc","user":{"id":105000448,"name":"new","portraitUri":"202002/07/5e3d1090932773.67914860.gif"},"messageId":0}}
                                    //注：该data是json,不是jsonstring
                                    Clog.Purple(ClogKey.Net, "【文字聊天】 << " + JSON.stringify(content));
                                    RoomSocketSync.SyncRoomChat(content)
                                    return;
                                }
                            }
                            break;
                        case "RC:CmdMsg":
                            {
                                //抓包聊天 {"targetId":193179637,"type":"RC:CmdMsg","content":{"name":"Room.Online","data":{"num":1}}}
                                //3.2.1 刷新房间在线人数
                                // RoomSocketSync.OnSyncRoomOnline(content)
                                if (content.hasOwnProperty('name') && content.hasOwnProperty('data')) {
                                    let name = content.name;
                                    let data = content.data;

                                    if (name == "room.Online" || name == "Room.Online") {
                                        let num = data.num
                                        Clog.Purple(ClogKey.Net, "【刷新房间人数】<< " + num);
                                        RoomSocketSync.OnSyncRoomOnline(num);
                                    }
                                    else if (name == "room.refersh") {
                                        //注：该data不是json, 是jsonstring MMP
                                        Clog.Purple(ClogKey.Net, "【刷新房间数据】 << " + JSON.stringify(data));
                                        RoomSocketSync.SyncRoomRefresh(data);
                                    }
                                    else if (name == "topic.refersh") {
                                        //注：该data不是json, 是jsonstring MMP。。。                                       
                                        Clog.Purple(ClogKey.Net, "【刷新话题卡】<< " + data);
                                        RoomSocketSync.SyncRoomTopic(data);
                                    }
                                    else if (name == "user.guide") {
                                        //服务器推送新手指引，"data": ["flame", "more", "topic"]                                   
                                        Clog.Purple(ClogKey.Net, "【新手引导】<< " + data);
                                        RoomSocketSync.SyncUserNewbieGuild(data);
                                    }
                                    return;
                                }

                            }
                            break;
                    }
                }
            };

            // 网络不通
            this.ws.onerror = () => {
                resolve(false)
                Clog.Error("RoomSocket: ws link error !");
            };

            //网络不通或者服务器主动断开连接
            this.ws.onclose = () => {
                Clog.Error("RoomSocket: ws link close !");
            };
        })
    }

    //发送消息的方法
    public static OnSend(data: any) {
        this.ws.send(data);
    }

    //当前网络是否连接 
    public static get IsOpen(): boolean {
        if (this.ws != null && this.ws.readyState == WebSocket.OPEN) {
            return true;
        }
        return false;
    }

    //手动断开
    public static ManulClose(): void {
        if (!this.IsOpen) {
            return;
        }
        //手动断开事件
        //SS.EventCenter.emit()
        this.ws.close();
    }
    //#endregion ---------------------------------

    //#region ----------call 基础方法---------------
    private static CallMap: Map<number, Function> = new Map<number, Function>();
    public static Call(msg: { op: string, data: any }, callback: Function) {
        if (!RoomSocket.IsOpen) {
            return
        }
        let message = JSON.stringify({
            'op': msg.op,
            'data': msg.data == null ? {} : msg.data,
            'index': this.sendIndex,
        })
        if (msg.op != "ping")//ping的日志不打印了，太烦
        {
            Clog.Purple(ClogKey.Net, "[send message call] >> " + message);
        }
        RoomSocket.OnSend(message);
        let key = this.sendIndex
        this.CallMap.set(key, callback)
        this.sendIndex++;
    }

    //这是一个中转方案，因为服务器是通过index去区分的，我也只能这样做
    private static onCallResp(msg: any) {
        let i = msg.i;
        let s = msg.s;
        if (s == false) {
            Clog.Error("[recive message s is false]");
            return;
        }
        if (!this.CallMap.has(i)) {
            Clog.Trace(ClogKey.Net, "[onCallResp] can not find func by i");
            return;
        }
        let func = this.CallMap.get(i)
        func(msg.data);
        this.CallMap.delete(i)
    }
    //#endregion --------------------------------

    //#region ----------input 基础方法---------------
    public static Input(msg: { op: string, data: any }) {
        if (!RoomSocket.IsOpen) {
            return
        }
        let message = JSON.stringify({
            'op': msg.op,
            'data': msg.data == null ? {} : msg.data,
            'index': this.sendIndex,
        })
        Clog.Purple(ClogKey.Net, "[send message input] >> " + message);
        RoomSocket.OnSend(message);
    }
    //#endregion

    //#region ----------自动重连---------------
    // private static RELINK_TIME_MAX: number = 7;              //重连最大次数
    // private static RelinkFailTooMuctch: Function = null;     //达到最大重连次数后，认定为重连失败，并回调 
    // //自动重连
    // public static Relink() {
    //     //不断网不重连
    //     if (this.IsOpen()) {
    //         return;
    //     }
    //     //重连地址不存在不重连
    //     if (RoomInfoManager.WebscoketUrl == null) {
    //         return;
    //     }
    //     //重连多次失败，也不自动发启重连
    //     if (this.RerlinkTimer > this.RELINK_TIME_MAX) {
    //         this.RerlinkTimer = 0;
    //         if (this.RelinkFailTooMuctch != null) {
    //             this.RelinkFailTooMuctch();
    //             return;
    //         }
    //     }
    //     if (this.RerlinkTimer >= 1) //第0次重连不弹提示
    //     {
    //         UIUtil.OpenTip('自动重连 第[' + this.RerlinkTimer + '/' + this.RELINK_TIME_MAX + ']次尝试...')
    //     }
    //     this.RelinkFailTooMuctch = () => {
    //         UIUtil.OpenDlg('当前网络不可用，是检查是否连接了可用的WIFI或移动网络', '确定', () => {
    //             GameCenter.ReStartGame();
    //         });
    //         this.RelinkFailTooMuctch = null;
    //     }
    //     this.OnInit(RoomInfoManager.WebscoketUrl);
    //     this.RerlinkTimer++;       //重连次数++
    //     return;
    // }
    //#endregion
}