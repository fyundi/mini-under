export class XiyouData {
    public MomoId: number
    public Name: string
    public Age: number;
    public HomeCity: string;
    public HeadIcon: string
    public OpenId: string
    public Deposit: number; //西游玩币
    public Gold: number;     //西游金币
    public VIP: number;
    public CharmValue: number;
    constructor(data?: any) {
        if (data == null) {
            return;
        }
        this.MomoId = data.momoId;
        this.Name = data.name;
        this.Age = data.age;
        this.VIP = data.vipLevel;
        this.CharmValue = data.charmValue;
        this.HomeCity = data.homeCity;
        this.OpenId = data.openId;
        this.Deposit = data.deposit;
        this.Gold = data.gold;
    }
}


