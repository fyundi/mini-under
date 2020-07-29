import { Session } from "../../login/model/SessionData";
import { ArrayRemove } from "../../../base/script/util/ArrayUtil";



/**
 * 礼物赠送目标
 */
export class GiftTargetData {

    private targetIds: Array<number>

    constructor() {
        this.targetIds = new Array<number>();
    }

    public get UIdList(): Array<number> {
        return this.targetIds;
    }

    public Add(uid: number) {
        if (uid == Session.BanBan.UId) {
            return;
        }
        if (this.Has(uid)) {
            return;
        }
        this.targetIds.push(uid);
        return this;
    }

    public Has(uid: number): boolean {
        return this.targetIds.indexOf(uid) >= 0
    }

    public Del(uid: number) {
        if (!this.Has(uid)) {
            return;
        }
        ArrayRemove(this.targetIds, uid)
        return this;
    }

    public ToString(): Array<string> {
        let toIds = new Array<string>();
        this.targetIds.forEach(item => { toIds.push(item.toString()) })
        return toIds;
    }
}