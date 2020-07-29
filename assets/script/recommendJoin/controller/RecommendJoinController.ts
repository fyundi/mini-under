import Xhr, { XhrUrl } from "../../../base/script/api/http/Xhr";
import { RecommendRoomData } from "../model/RecommendRoomData";


/**
 * 推荐加入房间管理类
 */
export class RecommendJoinController {

    public static AllRecommendRoom: Array<RecommendRoomData>

    /**
    * 获取推荐房间列表
    */
    public static async GetRecommend(): Promise<boolean> {
        return new Promise(async (resolve) => {

            let url = new XhrUrl("xiyou/recommendRooms").Url

            let msg = await Xhr.GetJson(url)
            let success = msg['success']
            if (!success) {
                resolve(false)
                return
            }

            let data = msg['data']
            this.AllRecommendRoom = new Array<RecommendRoomData>();
            for (let index = 0; index < data.rooms.length; index++) {
                const element = data.rooms[index];
                let item = new RecommendRoomData(element)
                this.AllRecommendRoom.push(item);
            }
            resolve(true)
        })
    }
}