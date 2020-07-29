import { EnumSex } from "../../other/EnumCenter";



export class BanBanData {
    public UId: number;
    public Name: string;
    public Icon: string;
    public Role: string;
    public Sex: EnumSex;
    // public PayNum: number;
    // public PayMoney: number;
    // public Vip: number;             //已弃用
    public VipNew: number;
    public Title: string;
    // public Birthday: string;
    // public Job: number;
    // public DateLine: number;
    // public Version: number;
    // public Longitude: number;
    // public Latitude: number;
    // public City: string;
    // public CityCode: number;
    public Position: number;
    public Sign: string;
    // public ServerTime: number;
    // public Star: number;
    // public deleted: number;
    // public TmpIcon: string;
    // public GodNum: number;
    // public Friend: number;
    // public CashMin: number;
    // public CashRate: number;
    // public GroupEnabled: number;
    // public GameLoginToken: string;
    public Token: string;
    // public DToken: string;
    public OpenId: string;
    // public Money: number = 0;                  //货币1：余额，该数据由room/config发送
    // public GoldCoin: number = 0;                //货币2：Coin
    public isSuperAdmin: boolean;   //是否是超管，从room/config中is_super获取

    constructor(data = null) {
        if (data == null) {
            return;
        }

        this.UId = data.uid
        this.Name = data.name
        this.Icon = data.icon
        this.Role = data.role
        this.Sex = data.Sex
        // this.PayNum = data.pay_num
        // this.PayNum = data.pay_money
        // this.Vip = data.vip
        this.VipNew = data.vip_new
        this.Title = data.title
        // this.Birthday = data.birthday
        // this.Job = data.job
        // this.DateLine = data.dateline
        // this.Version = data.version
        // this.Longitude = data.longitude
        // this.Latitude = data.latitude
        // this.City = data.city
        // this.CityCode = data.city_code
        this.Position = data.position ? data.position : -1
        this.Sign = data.sign
        // this.ServerTime = data.server_time
        // this.Star = data.star
        // this.deleted = data.deleted
        // this.TmpIcon = data.tmp_icon
        // this.GodNum = data.god_num
        // this.Friend = data.friend
        // this.CashMin = data.cash_min
        // this.CashRate = data.cash_rate
        // this.GroupEnabled = data["group.enabled"]
        // this.GameLoginToken = data.game_login_token
        this.Token = data.token
        // this.DToken = data.dtoken
    }

}