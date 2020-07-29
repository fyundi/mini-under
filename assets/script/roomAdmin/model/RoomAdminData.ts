import { EnumSex, EnumPurview } from "../../other/EnumCenter";

export class RoomAdminData {

    public UId: number;
    public Name: string;
    public Icon: string;
    public Sex: EnumSex;
    public Vip: number;
    public OpenId: string; // qq的openId

    constructor(data?: any) {
        if (data == null) {
            return;
        }
        this.UId = data.uid;
        this.Name = data.name;
        this.Icon = data.icon;
        this.Sex = data.sex as EnumSex;
        this.Vip = data.vip;
        this.OpenId = data.openId; // TODO:
    }
}


/**
 * {"uid":"105000961",
 * "name":"宋江",
 * "icon":"202006/01/5ed4b355b413c2.27948791.bmp",
 * "sex":1,
 * "birthday":"0",
 * "version":0,
 * "title":0,
 * "role":"createor",
 * "mic":0,
 * "position":0,
 * "vip":0,
 * "year":0,
 * "ordering":1591167898
 * }
 */
export class RoomOlineData extends RoomAdminData {
    public Mic: number;
    public Role: EnumPurview;
    public Age: number;
    constructor(data?: any) {
        super();
        if (data == null) {
            return;
        }
        this.UId = data.uid;
        this.Name = data.name;
        this.Icon = data.icon;
        this.Sex = data.sex as EnumSex;
        this.Vip = data.vip;
        this.Mic = data.mic;
        this.Role = data.role as EnumPurview
        this.Age = data.year;
    }
}