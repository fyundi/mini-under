import { RoomSocket } from "./RoomSocket";
import Clog, { ClogKey } from "../../../../base/script/frame/clog/Clog";
import { Time } from "../../../../base/script/frame/time/Time";
import { RoomController } from "../../../room/controller/RoomController";
import { Session } from "../../../login/model/SessionData";

/**
 *1.有req有resp的方法叫Call，即客户端发送数据给服务器，同时服务器也响应数据给客户端
* 2.有req无resp的方法叫Input，即客户端发送数据给服务器
* 3.无req有resp的方法叫Sync,即服务器同步数据给客户端
* 4.本类为call
 */
export class RoomSocketCall {

    public static JoinChannel() {
        // 抓包req数据  {"op":"joinChannel","data":{"rid":"106609000","token":"7558gC8z9__2BCk9i2gqHJboOFfYb7949YyNApD9xhzNImpkII5MeUvtcrA4Y1TA5MvFW8ZSP5__2F5hMmCDx__2FSLHer9BoxI8aY5xBZKOBrMoKqp1MZD__2FI"},"index":1}
        // 抓包resp数据  {"s":true,"i":1,"data":"005AQAoAEU4MDAxQzI3RkNERDEwOEE2MUU5NzMwM0QwRUVGQUQ4MjQyMTA4MTMQAHnwjJiNKkTGlG4Bkvjh7KmXgKpePU0WQJcN0l4AAA=="}
        let msg = {
            op: "joinChannel",
            data: {
                "rid": RoomController.CurRoom.RoomId.toString(),
                "token": Session.BanBan.Token
            }
        }

        RoomSocket.Call(msg, (data: any) => {
            RoomController.CurRoom.VoiceToken = data;
            Clog.Trace(ClogKey.Net, "JoinChannel resp , voiceToken:" + RoomController.CurRoom.VoiceToken);
        })
    }


    public static GetHistoryMessages() {
        //参考数据{"op":"getHistoryMessages","data":{"rid":"105597925"},"index":2}
        let msg = {
            op: "getHistoryMessages",
            data: {
                "rid": RoomController.CurRoom.RoomId.toString(),
            }
        }
        RoomSocket.Call(msg, (data: any) => {
            Clog.Trace(ClogKey.Net, "GetHistoryMessages , data:" + data);
        })
    }


    public static OnLineNum() {
        //参考数据 {"op":"onlineNum","data":{"rid":"100028746"},"index":3}
        let msg = {
            op: "onlineNum",
            data: {
                "rid": RoomController.CurRoom.RoomId.toString(),
            }
        }
        RoomSocket.Call(msg, (data: any) => {
            Clog.Trace(ClogKey.Net, "OnLineNum , data:" + JSON.stringify(data));
        })
    }

    //向服务器发送心跳
    public static HeartBeat() {
        // Clog.Trace(ClogKey.Net, "Heart Beat, Ping :" + Time.TimestampToTime(new Date().valueOf()));

        let msg = {
            op: "ping",
            data: null
        }
        //心跳回调是专门的方法，我也很奇怪服务器为什么这样做
        RoomSocket.Call(msg, null);
    }


}