import { EnumSex } from "../../other/EnumCenter";

export class MicWaitData {
    public UId: number;
    public Name: string;
    public Icon: string;
    public Sex: EnumSex; 
    public VipNew: number;
    public Dateline:string;         //排了多久时间了

    constructor(data?: any) {
        if (data == null) {
            return;
        }
        if (data.hasOwnProperty('uid'))this.UId = data.uid;     
        if (data.hasOwnProperty('name'))this.Name = data.name;
        if (data.hasOwnProperty('icon'))this.Icon = data.icon;
        if (data.hasOwnProperty('sex'))this.Sex = data.sex as EnumSex;
        if (data.hasOwnProperty('vip'))this.VipNew = data.vip;
        if (data.hasOwnProperty('dateline_diff'))this.Dateline = data.dateline_diff;     
    }
}