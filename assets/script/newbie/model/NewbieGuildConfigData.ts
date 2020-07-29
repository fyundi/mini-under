export class NewbieGuildConfigData {

    public guildName: string;
    public maskPos: cc.Vec2;
    public guildTipPos: cc.Vec2;
    public guildTipSize: cc.Size;
    public arrowPos: cc.Vec2;
    public arrowScale: cc.Vec2;
    public iconPos: cc.Vec2;
    public iconName:string
    public text: string;

    constructor(data?: any) {
        if (data == null) {
            return;
        }
        this.guildName = data.guildName;
        this.maskPos = data.maskPos;
        this.guildTipPos = data.guildTipPos;
        this.guildTipSize = data.guildTipSize;
        this.arrowPos = data.arrowPos;
        this.arrowScale = data.arrowScale;
        this.iconPos = data.iconPos;
        this.iconName = data.iconName;
        this.text = data.text; 
    }
}
