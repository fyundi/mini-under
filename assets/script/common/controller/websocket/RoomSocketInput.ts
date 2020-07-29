
import { RoomSocket } from "./RoomSocket";
import { RoomController } from "../../../room/controller/RoomController";
import { EmojiData } from "../../../emoji/model/EmojData";
import { Session } from "../../../login/model/SessionData";



/**
 *1.有req有resp的方法叫Call，即客户端发送数据给服务器，同时服务器也响应数据给客户端
* 2.有req无resp的方法叫Input，即客户端发送数据给服务器
* 3.无req有resp的方法叫Sync，即服务器同步数据给客户端
* 4.本类为Input
 */
export class RoomSocketInput {

    //向服务器发送聊天文字
    public static InputChat(message: string) {
        // 抓包数据 { "op": "sendMessage", "data": { "content": "haha", "extra": "{\"vip\":0,\"vip_new\":0,\"title\":0,\"defends\":0,\"is_guess\":0,\"position\":-1}", "user": { "id": "116311979", "name": "鸣", "portraitUri": "202004/14/5e957d2a5eff97.41902569.jpg" } }, "index": 224 }
        let extra = {
            // 'vip': Session.Vip,
            'vip_new': Session.XiYou.VIP,
            'title': Session.BanBan.Title,
            'defends': 0,
            'is_guess': 0,
            'position': RoomController.GetPositionByUserId(Session.BanBan.UId),
        }

        let data = {
            op: "sendMessage",
            data: {
                "content": message,             //就这个有用，我也不知道为什么发这么长
                "user": {
                    "id": Session.BanBan.UId,
                    "name": Session.BanBan.Name
                },
                "extra": JSON.stringify(extra)
            }
        }
        RoomSocket.Input(data)
    }

    //向服务器发送表情
    public static InputEmoji(emojiData: EmojiData) {
        // 抓包数据   {"op":"sendMessage","data":{"content":"送花","extra":"{\"vip\":0,\"vip_new\":0,\"title\":0,\"emote\":\"flower_new\",\"emote_sender\":116311979,\"emote_position\":0,\"emote_data\":[],\"duration\":1540,\"now\":1588145550,\"defends\":0}","user":{"id":"116311979","name":"鸣","portraitUri":"202004/14/5e957d2a5eff97.41902569.jpg"}},"index":317}
        //{"op":"sendMessage","data":{"content":"晕倒","extra":"{\"vip\":0,\"vip_new\":0,\"title\":0,\"emote\":\"faint_new\",\"emote_sender\":116311979,\"emote_position\":0,\"emote_data\":[],\"duration\":3960,\"now\":1588820620,\"defends\":0}","user":{"id":"116311979","name":"鸣","portraitUri":"202004/14/5e957d2a5eff97.41902569.jpg"}},"index":7}

        let extra = {
            vip_new: Session.XiYou.VIP,
            title: Session.BanBan.Title,
            emote: emojiData.Key,
            emote_sender: Session.BanBan.UId,
            emote_position: RoomController.GetPositionByUserId(Session.BanBan.UId),
            emote_data: emojiData.Data,
        }

        let data = {
            op: "sendMessage",
            data: {
                "content": emojiData.Name,
                "user": {
                    "id": Session.BanBan.UId,
                    "name": Session.BanBan.Name
                },
                "extra": JSON.stringify(extra)
            }
        }
        RoomSocket.Input(data)
    }
}

 