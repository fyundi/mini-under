import { EnumRole } from "../../other/EnumCenter";

//房间的创建者数据
export class RoomCreatorData {
    public Name: string;
    public Icon: string;
    public Role: EnumRole;
    public UId: number;

    constructor(serverData?: any) {
        if (serverData) {
            this.Name = serverData.name;
            this.Icon = serverData.icon;
            this.Role = serverData.role as EnumRole;
            this.UId = parseInt(serverData.uid);
        }
    }
}