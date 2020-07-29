import { SS } from "../../../base/script/global/SS";
import { EventCommond } from "../../other/EventCommond";
import Xhr, { XhrUrl } from "../../../base/script/api/http/Xhr";
import { RoomController } from "../../room/controller/RoomController";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";


export class TopicController {

    public static AllTopics = {
        topics: [
            {
                "topic_category_name": "恋爱那些事",
                "topics": [
                    {
                        "id": 1,
                        "topic_category_id": 1,
                        "name": "你暗恋中什么时候最心酸"
                    }
                ]
            },
            {
                "topic_category_name": "沙雕网友",
                "topics": [
                    {
                        "id": 2,
                        "topic_category_id": 2,
                        "name": "生活已经被工作填满，是否该辞职"
                    }
                ]
            },
            {
                "topic_category_name": "回忆往事",
                "topics": [
                    {
                        "id": 3,
                        "topic_category_id": 3,
                        "name": "童年最不堪回首的经历是什么"
                    }
                ]
            },
            {
                "topic_category_name": "吐槽大会",
                "topics": [
                    {
                        "id": 4,
                        "topic_category_id": 4,
                        "name": "你见过最邋遢的人是怎样的"
                    }
                ]
            },
            {
                "topic_category_name": "真心话大冒险",
                "topics": [
                    {
                        "id": 5,
                        "topic_category_id": 5,
                        "name": "讲一个你认为好笑的笑话"
                    }
                ]
            },
            {
                "topic_category_name": "吃瓜群众",
                "topics": [
                    {
                        "id": 6,
                        "topic_category_id": 6,
                        "name": "为什么现在的歌越来越难听"
                    }
                ]
            },
            {
                "topic_category_name": "闺蜜私语",
                "topics": [
                    {
                        "id": 7,
                        "topic_category_id": 7,
                        "name": "你会怎样和绿茶婊相处"
                    }
                ]
            }
        ]
    }

    public static PendingTopicIds: number[] = [];  // 潜在话题卡序列,根据id选取
    public static IsOpenTopic: boolean = false;  // 是否开启话题卡

    public static SelectedTag: string = '';  // 选中的tag标签

    public static InitTopic(data: any) {
        // TODO: 根据服务器的覆盖
        TopicController.AllTopics = data;
    }

    public static RefreshTopic(ids: number[], openTopic: boolean = false) {
        let idsCopy = [];
        for (var i = 0; i < ids.length; i++) {
            idsCopy.push(Number(ids[i]));
        }
        TopicController.PendingTopicIds = idsCopy;
        TopicController.IsOpenTopic = openTopic;

        SS.EventCenter.emit(EventCommond.UITopic);
    }

    /**
     * 通过id查找具体话题
     * @param id 
     */
    public static getTopicByID(id: number): string {
        // Clog.Red(ClogKey.UI,"【getTopicByID】id:"+id);
        let str = "";
        for (var i = 0; i < TopicController.AllTopics.topics.length; i++) {
            let find = false;
            for (let j = 0; j < TopicController.AllTopics.topics[i].topics.length; j++) {
                if (TopicController.AllTopics.topics[i].topics[j].id == id) {
                    find = true;
                    str = TopicController.AllTopics.topics[i].topics[j].name;
                    break;
                }
            }
            if (find) {
                break;
            }
        }
        return str;
    }

    /**
     * 刚进入房间需要向服务器同步一次话题卡
     */
    public static EntryTopic() { 
        if(!RoomController.CurRoom)
        {
            Clog.Error("加入房间失败,不能同步话题卡配置");
            return;
        }
        return new Promise(async (resolve) => {
            var url = new XhrUrl("xiyou/roomTopics").Query({ key: "rid", value: RoomController.CurRoom.RoomId.toString() }).Url
            let msg = await Xhr.GetJson(url);
            let success = msg['success']
            if (success == false) {
                resolve(false)
                return
            }
            let data = msg["data"]
            Clog.Red(ClogKey.Entry, "【EntryTopic】：" + JSON.stringify(data));
            if (data.hasOwnProperty("topics") && data.hasOwnProperty("status")) {
                let topics = data.topics;
                let status = data.status;
                let arr = [];
                for (var i = 0; i < topics.length; i++) {
                    arr.push(topics[i].id);
                }
                TopicController.RefreshTopic(arr, status > 0);
            }
            resolve(true)
        })
    }

    public static NextTopic() {
        if (TopicController.PendingTopicIds.length == 0) return;

        let url = new XhrUrl("xiyou/nextRoomTopic").Url;
        let postData = {
            rid: '' + RoomController.CurRoom.RoomId
        }
        // 不需要考虑结果，结果会在socket中分发
        Xhr.PostJson(url, postData);
    }

    public static SelectTopic(selected: number[]) {

        for (var i = 0; i < selected.length; i++) {
            selected[i] = Number(selected[i]);
        }
        let url = new XhrUrl("xiyou/setRoomTopic").Url;
        let postData = {
            rid: '' + RoomController.CurRoom.RoomId,
            // topicIds:JSON.stringify(selected)   
            topic_ids: JSON.stringify(selected)
        }
        // 不需要考虑结果，结果会在socket中分发
        Xhr.PostJson(url, postData);
    }

    public static CloseTopic() {

        let url = new XhrUrl("xiyou/closeRoomTopic").Url;
        let postData = {
            rid: '' + RoomController.CurRoom.RoomId
        }
        // 不需要考虑结果，结果会在socket中分发
        Xhr.PostJson(url, postData);
    }

}