import { XiYouGiftManager } from "../../xiyou/controller/XiYouGiftManager";
import { XiYouGiftTable } from "../../xiyou/config/XiYouGiftConfig";


/**
 * 赠送的礼物的数据结构
 */
export class GiftEffectData {

    public Content: string;
    public GiftId: number;
    public GiftNum: number;
    public From: { UId: number, Vip: number, Name: string, Icon: string }
    public To: { UId: number, Name: string }

    /* 参考
    {
        "content": "待会都会幻想打赏了water",
        "extra": {
            "uuid": "5ebd14a3361ef1.23800596",
            "type": "package",
            "from": "待会都会幻想",
            "uid": 105000700,
            "icon":"202006/16/5ee8daa9675ac6.31716764.bmp"
            "icongray": false,
            "to": "water",
            "to_uid": 100010061,
            "vip": 1,
            "vip_new": 3,
            "title": 0,
            "price": 1,
            "uids": [
                100010061
            ],
            "gift": {
                "id": 81,
                "name": "棒棒糖",
                "price": 1,
                "type": "normal",
                "size": 667570,
                "with_end": 1,
                "_num": 1,
                "_position": -1,
                "displayNormalGiftRatio": "",
                "displayNormalGiftType": "multiframe",
                "size_big": 0,
                "worthy": 0
            },
            "defends": 0,
            "box-gift": 0,
            "giftNumMap": [],
            "boxName": "",
            "defend": 0
        },
        "messageId": 0
    }
    */
    constructor(data?: any) {
        if (!data) {
            return;
        }

        this.GiftId = data.extra.gift.id;
        let giftConfig = XiYouGiftTable.GetGiftConfigById(this.GiftId)
        let giftName = giftConfig.Name
        this.Content = `${data.extra.from}打赏了${data.extra.to}${giftName}`;
        this.GiftNum = data.extra.gift._num;
        this.From = {
            UId: data.extra.uid,
            Name: data.extra.from,
            Vip: data.extra.vip_new,
            Icon: data.extra.icon,
        }
        this.To = {
            UId: data.extra.to_uid,
            Name: data.extra.to,
        }
    }
}