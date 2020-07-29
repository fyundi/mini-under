import { EnumSex } from "../../other/EnumCenter";


/**
 * 推荐的房间的数据结构
 */
export class RecommendRoomData {


    public RoomId: number;
    public Name: string;
    public Type: string;
    public Icon: string;
    public UserName: string;
    public Sex: number;


    constructor(data?: any) {
        if (data == null) {
            return;
        }
        this.RoomId = data.rid;
        this.Name = data.name;
        this.Type = data.type;
        this.Icon = data.icon;
        this.UserName = data.username;
        this.Sex = data.sex as EnumSex;
    }


}