

export class EmojiData {

    public Name: string;
    public Id: string;              // 针对剪子包袱锤这种，可能有多个，但面板上就显示一个
    public Key: string;
    public Duration: number;        //单位，秒
    public Subpackage: string;     // 分属那个分包
    public OnlyInMic: boolean;
    public Data: [] = [];               // 居然[]

    public ChatScale: number;    // 在聊天上的缩放
    public SeatScale: number;    // 在座位上的缩放

    constructor(data?: any) {
        if (data == null) {
            return
        }
        this.Name = data.name;
        this.Id = data.id;
        this.Key = data.key;
        this.Duration = data.duration / 1000;
        this.Subpackage = data.subpackage;
        this.OnlyInMic = data.onlyInMic;
        this.Data = data.data;
        this.ChatScale = data.chatScale;
        this.SeatScale = data.seatScale;
    }

}