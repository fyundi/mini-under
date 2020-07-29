import { EnumSex } from "../../other/EnumCenter";




export class BanBanUserInfo {
    public Icon: string;
    public UId: number;
    public MomoId: number;
    public IsFllow: boolean;
    constructor(data?: any) {
        if (!data) {
            return;
        }
        this.UId = data.uid;
        this.MomoId = data.momo_id;
        this.Icon = data.icon;
        this.IsFllow = data.follow;
    }
}

/* 参考数据
{
    "success": true,
    "data": {
        "uid": 105000968,
        "name": "卢俊义",
        "icon": "202006/01/5ed4df909b15e5.26952125.png",
        "age": 0,
        "birthday": "",
        "sign": "",
        "city": "",
        "online_status": 1,
        "online_dateline": 1591009171,
        "online_dateline_diff": "2天前",
        "job": 0,
        "sex": 2,
        "title": 0,
        "star": 0,
        "god_num": 0,
        "god_category": "",
        "deleted": 0,
        "block_un_auther_message": 0,
        "position": "",
        "service_pause": 0,
        "service_busy": 0,
        "credit_god_level": 1,
        "credit_user_level": 1,
        "tag": 0,
        "friend_state": 0,
        "has_video": 0,
        "role": 0,
        "vipLevel": 0,
        "longitude": 0,
        "latitude": 0,
        "self": {
            "video": false,
            "pay_num": 0
        },
        "photos": [
            "202006/01/5ed4df909b15e5.26952125.png"
        ],
        "skill": [],
        "videos": [],
        "room": {
            "rid": "193181987",
            "prefix": "",
            "uid": 193181987,
            "name": "替天行道",
            "type": "music",
            "weight": "0",
            "types": "auto",
            "online_num": 3,
            "icon": "",
            "version": 131,
            "dateline": "1591079890",
            "password": 0,
            "boss_uid": "0",
            "uname": "宋江",
            "utitle": "0",
            "pay_room_money": "14",
            "deleted": 0,
            "vip": 0,
            "typeName": {
                "label": "点唱",
                "val": "music",
                "color": "#8D61F7",
                "show": "点唱厅"
            },
            "guestEnable": 0,
            "tag": "点唱",
            "real": 14
        },
        "follow": 0,
        "games": [
            {
                "id": "16",
                "name": "怪怪跳",
                "icon": "201806/07/19162147645b18e013c9b719.65826216.png",
                "game_id": "16",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "15",
                "name": "公路赛车",
                "icon": "201806/14/19162147645b21db23d3b532.80422209.png",
                "game_id": "15",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "14",
                "name": "灵魂迷宫",
                "icon": "201806/11/19162147645b1de64a806129.95244180.png",
                "game_id": "14",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "12",
                "name": "九死一生",
                "icon": "201805/24/19162147645b067f476863a7.65599956.png",
                "game_id": "12",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "11",
                "name": "Bang",
                "icon": "201805/29/19162147645b0d35254b1f81.24425106.png",
                "game_id": "11",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "10",
                "name": "笨鸟飞飞",
                "icon": "201806/01/19162147645b10e993a08325.20443743.png",
                "game_id": "10",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "9",
                "name": "你行你跳",
                "icon": "201806/05/19162147645b165d49e31134.64338221.png",
                "game_id": "9",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "8",
                "name": "一步两步",
                "icon": "201805/24/19162147645b066bb44bd286.31854635.png",
                "game_id": "8",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "7",
                "name": "俄罗斯方块",
                "icon": "201805/16/19162147645afbb0389e4528.92040640.png",
                "game_id": "7",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "6",
                "name": "中国象棋",
                "icon": "201805/16/19162147645afbb042b47900.31839917.png",
                "game_id": "6",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "5",
                "name": "五子棋",
                "icon": "201803/22/19162147645ab34b7ee99e76.21075376.png",
                "game_id": "5",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "4",
                "name": "连连看",
                "icon": "201803/22/19162147645ab34b89cd8915.66764325.png",
                "game_id": "4",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "3",
                "name": "消砖块",
                "icon": "201805/24/19162147645b0671ec40d086.74776688.png",
                "game_id": "3",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "2",
                "name": "教室大战",
                "icon": "201803/14/19162147645aa8ea630107b0.34109978.png",
                "game_id": "2",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            },
            {
                "id": "1",
                "name": "斗兽棋",
                "icon": "201803/14/19162147645aa8ea54b60d46.81227495.png",
                "game_id": "1",
                "num": 0,
                "dateline": 0,
                "escape_num": 0
            }
        ],
        "game_success": -1,
        "game_complete": -1,
        "authentication": 0,
        "authenticationScore": 0,
        "authenticationSign": "",
        "defend": 0,
        "defendMax": null,
        "gifts": [
            {
                "gid": 20102,
                "num": 1,
                "name": "鸡蛋",
                "sum": 6
            },
            {
                "gid": 20101,
                "num": 5,
                "name": "比心",
                "sum": 5
            }
        ],
        "interest": [],
        "mark_name": "",
        "icongray": true,
        "topic": 0,
        "need_verify": 3
    }
}

*/