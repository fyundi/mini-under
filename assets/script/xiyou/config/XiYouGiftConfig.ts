import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { EnumXiyouItemType } from "../../other/EnumCenter";

export class XiYouGiftConfig {

    public Id: number;
    public Name: string;
    public get Image(): string{
        return "gift_01_" + this.Id
    }
    public Price: number;
    public AnimName: string;
    public get VipValue(): number //该礼物直接的VIP值如果是商品，就等于其价格，如果是道具，则为0
    {
        switch (this.Type) {
            case EnumXiyouItemType.XiyouCommodity:
                return this.Price;
            case EnumXiyouItemType.XiyouProp:
                return 0;
        }
    }
    public Charm: number;
    public Index: number;
    public Type: EnumXiyouItemType;
    constructor(data: any) {
        this.AnimName = data.ani_name;
        this.Id = data.id;
        this.Name = data.name;
        this.Price = data.price;
        this.Charm = data.charm;
        this.Index = data.index;
        this.Type = data.type as EnumXiyouItemType
    }
}

/**
 * xiyou的礼物配置表
 */
export class XiYouGiftTable {
    public static AllConfig: Array<XiYouGiftConfig>

    public static Init(data: any) {
        this.AllConfig = new Array<XiYouGiftConfig>();
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let item = new XiYouGiftConfig(element);
            this.AllConfig.push(item)
        }
        Clog.Trace(ClogKey.Entry, "XiYouGiftTable.allConfig" + JSON.stringify(this.AllConfig));
    }

    public static GetGiftConfigById(id: number) {
        return this.AllConfig.find(item => item.Id == id)
    }

}