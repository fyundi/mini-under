
export class RoomStyle {

    public static VipColor(vip: number) {
        if (vip >= 60) {
            return new cc.Color().fromHEX('#FFEC18')
        }
        if (vip >= 40) {
            return new cc.Color().fromHEX('#FFCE38')
        }
        if (vip >= 20) {
            return new cc.Color().fromHEX('#9c27FF')
        }
        if (vip >= 16) {
            return new cc.Color().fromHEX('#FF52F1')
        }
        if (vip >= 1) {
            return new cc.Color().fromHEX('#72CE76')
        }
        return new cc.Color().fromHEX('#FFFFFF')
    }

}