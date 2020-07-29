import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { XiyouSDK } from "../xiyouSDK/XiyouSDK";
import NetCenterMgr from "../xiyouSDK/utils/NetCenterMgr";
import { UIToast } from "../../common/view/UIToast";


export class XiyouSocket {

    private ws: WebSocket = null;

    private needOpen: boolean = false; // 是否需要保持open，保持的话自动断线重连
    private retriedOpenImmediately: boolean = false;

    private retryTimerId: number = 0;
    private heartbeatTimerId: number = 0;

    /**
     * 自动重试策略：
     * 如果断线，立马重试一次，如果不行，在继续每5s一次的轮训重试
     * 
     * @param socketUrl 西游sdk提供的socket url
     */
    public async Open(socketUrl: string) {
        return new Promise(resolve => {
            // 相同的不会重复创建
            if (this.ws && this.ws.url == socketUrl && (this.ws.readyState == WebSocket.OPEN || this.ws.readyState == WebSocket.CONNECTING)) {
                resolve();
                return;
            }

            this.needOpen = true;
            if (this.ws) this.ws.close();

            this.ws = new WebSocket(socketUrl);
            // this.ws.binaryType = "arraybuffer";

            //长连接打开
            this.ws.onopen = () => {
                resolve();

                this.retriedOpenImmediately = false;
                this.stopConnectRetry();
                this.startHeartbeat();

                Clog.Trace(ClogKey.Net, "XiyouSocket open success! url:" + socketUrl);
            };

            this.ws.onmessage = (event) => {
                // {state: "message", socketTaskId: 1, data: "{"header":{"msgCode":"game.login","version":"303"}…known error","timesec":1588845002380,"ec":99999}}"}
                if (event && event.data) {
                    let msg = event.data
                    try {
                        let data = JSON.parse(msg);
                        NetCenterMgr.Ins.notifyListener(data);
                    }
                    catch (e) {
                        Clog.Warn(ClogKey.Net, "msg type=" + typeof (msg))
                        Clog.Warn(ClogKey.Net, "西游socket数据返回有问题", event);
                    }
                }
            };

            this.ws.onclose = () => {
                Clog.Trace(ClogKey.Net, "XiyouSocket close! url:" + socketUrl);
                resolve();
                if (!this.needOpen) return;
                if (this.retriedOpenImmediately) return;
                this.stopHeartbeat();
                this.retriedOpenImmediately = true;
                this.Open(socketUrl);
                this.startConnectRetry(socketUrl);
            };
        });
    }

    private relinkXiyouTimer: number = 0;
    private startConnectRetry(socketUrl: string) {
        this.stopConnectRetry();
        this.retryTimerId = window.setInterval(() => {
            if (!this.needOpen) {
                this.relinkXiyouTimer = 0;
                return;
            }
            if (this.relinkXiyouTimer >= 3) {
                UIToast.Show("与服务器失去连接")
                return;
            }

            this.relinkXiyouTimer += 1;
            this.Open(socketUrl);
        }, 5000);
    }

    private stopConnectRetry() {
        if (this.retryTimerId) window.clearInterval(this.retryTimerId);
        this.retryTimerId = 0;
    }

    private startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimerId = window.setInterval(() => {
            if (this.ws && this.ws.readyState == WebSocket.OPEN) {
                XiyouSDK.Ins.sendHeartBeat();
            }
        }, 10000);
    }

    private stopHeartbeat() {
        if (this.heartbeatTimerId) window.clearInterval(this.heartbeatTimerId);
        this.heartbeatTimerId = 0;
    }

    public Close() {
        this.stopHeartbeat();
        this.stopConnectRetry();
        this.needOpen = false;
        if (this.ws) {
            Clog.Trace(ClogKey.Net, "XiyouSocket 调用了 Close");
            this.ws.close();
        }
        this.ws = null;
    }

    /**
     * 
     * 第一个参数是服务端接口（string），第二个参数是所发送的数据（json对象），参数顺序必须固定，以上两个参数详细内容对接者不用关心，sdk内已封装
     */
    public sendMsg(idx: string, data: any) {
        let newData: string = XiyouSDK.Ins.baseSendMsg(idx, data);
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(newData);
        } else {
            Clog.Warn(ClogKey.Net, "attempt to send data when ws not ready");
        }
    }
}