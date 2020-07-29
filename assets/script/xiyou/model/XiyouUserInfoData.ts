import { EnumSex } from "../../other/EnumCenter";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";



export class XiyouGiftWallItemData {

    public Id: number;
    public Num: number;
    public Name: string;
    constructor(data?: any) {
        if (!data) {
            return;
        }
        this.Id = data.id;
        this.Num = data.num;
        this.Name = data.name;
    }
}


export class XiyouUserInfoData {

    public Id: number; //momoId
    public NickName: string;
    public Icon: string;
    public Birthday: string;
    public City: string;
    public Sex: EnumSex;
    public Charm: number;
    public VipValue: number;
    public GiftCount: number;
    public WhetherFriends: boolean
    public Age: number
    public Constellation: string;        //星座
    public GiftWallInfo: Array<XiyouGiftWallItemData>
    constructor(data: any) {
        if (data == null) {
            return;
        }
        this.Id = data.id;
        this.Birthday = data.birthday;
        this.Icon = data.headImg;
        this.NickName = data.nickName;
        this.Sex = data.sex as EnumSex;
        this.City = data.city ? data.city : "未知";
        this.Charm = data.charm;
        this.VipValue = data.vipValue;
        this.WhetherFriends = data.whetherFriends;
        this.Age = data.age;
        this.GiftCount = data.giftCount;
        this.Constellation = data.constellation
        this.GiftWallInfo = new Array<XiyouGiftWallItemData>();
        for (let index = 0; index < data.giftList.length; index++) {
            const element = data.giftList[index];
            let item = new XiyouGiftWallItemData(element)
            this.GiftWallInfo.push(item);
        }
    }
}

/**
 * 参考数据
{
    "data": {
        "data": {
            "birthday": "2002-01-01",
            "headImg": "https://imgsa.baidu.com/forum/w%3D580/sign=6462ee959e3df8dca63d8f99fd1072bf/1c8920a4462309f784ff4d70730e0cf3d6cad607.jpg",
            "city": "深圳",
            "nickName": "吴用",
            "idCard": 0,
            "sex": 1,
            "giftCount": 1383,
            "autograph": "",
            "charmGrade": {
                "modifyTime": "2020-07-13 14:13:32.325",
                "createTime": "2020-07-13 14:13:32.325",
                "initial": 500,
                "upGrade": 3000,
                "rank": "魅力1",
                "charmGrade": 1,
                "id": "5f0bfb8ca297f7cf7c5e9691"
            },
            "vipGrade": {
                "modifyTime": "2020-07-13 14:18:44.802",
                "createTime": "2020-07-13 14:18:44.802",
                "initial": 0,
                "upGrade": 1,
                "rank": "无",
                "id": "5f0bfcc4a297f70448ae263f",
                "vipGrade": 0
            },
            "gold": 0,
            "times": 0,
            "giftList": [
                {
                    "num": 1,
                    "icon": "https://res-yqwsq.oclkj.com/game/gift/gift_01_20106.png",
                    "name": "有排面",
                    "id": "20106"
                },
                {
                    "num": 4,
                    "icon": "https://res-yqwsq.oclkj.com/game/gift/gift_01_20101.png",
                    "name": "比心",
                    "id": "20101"
                }
            ],
            "charm": 1469,
            "constellation": "摩羯座",
            "phone": 0,
            "vipValue": 0,
            "deposit": 0,
            "whetherFriends": false,
            "id": "102477",
            "age": 18
        },
        "message": "",
        "msg_key": "202007201124364865",
        "status": 200
    },
    "em": "OK",
    "timesec": 1595215476569,
    "ec": 0
}
 */