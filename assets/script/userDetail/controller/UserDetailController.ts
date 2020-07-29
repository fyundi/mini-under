import Xhr, { XhrUrl } from "../../../base/script/api/http/Xhr"
import { BanBanUserInfo as BanBanUserInfoData } from "../model/UserDetailData"
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog"
import { XiYouUserDetailController } from "../../xiyou/controller/XiYouUserInfoController"
import { XiyouUserInfoData } from "../../xiyou/model/XiyouUserInfoData"
import { UIToast } from "../../common/view/UIToast"



export class UserDetailController {

    //妈蛋，一个界面分两部分数据，这部分数据从BanBan服务器获取
    public static CurBanBanUserDetail: BanBanUserInfoData

    //妈的，一个界面分两部分数据，这部分数据从xiyou服务器获取
    public static CurXiyouUserInfo: XiyouUserInfoData

    //当前玩家id
    public static TargetUserId: number


    /**
     * 从服务器获取玩家详细信息
     * @param uid 玩家UId
     */
    public static async GetUserDetail(): Promise<boolean> {
        return new Promise(async (resolve) => {
            let url = new XhrUrl("profile/home")
                .Query({ key: 'version', value: '10' })
                .Query({ key: 'uid', value: this.TargetUserId.toString() })
                .Url
            let msg = await Xhr.GetJson(url)
            let success = msg['success']
            if (!success) {
                resolve(false)
                UIToast.Show(msg['msg'])
                return
            }
            let data = msg['data']
            this.CurBanBanUserDetail = new BanBanUserInfoData(data)
            Clog.Trace(ClogKey.Net, "CurBanBanUserDetail=" + JSON.stringify(this.CurBanBanUserDetail))
            this.CurXiyouUserInfo = await XiYouUserDetailController.GetXiyouUserInfo(this.CurBanBanUserDetail.MomoId)
            Clog.Trace(ClogKey.Net, "CurXiyouUserInfo=" + JSON.stringify(this.CurXiyouUserInfo))
            resolve(true)
        })
    }

    /**
     * 关注玩家
     * @param uid 玩家UId
     */
    public static async FollowUser(uid: number): Promise<boolean> {
        return new Promise(async (resolve) => {
            let url = new XhrUrl("friend/follow").Url
            let msg = await Xhr.PostJson(url, { uid: uid })
            let success = msg['success']
            if (!success) {
                resolve(false)
                return
            }
            let data = msg['data']
            Clog.Green(ClogKey.Net, "FollowUser result=" + JSON.stringify(data));
            this.CurBanBanUserDetail.IsFllow = true;
            resolve(true)
        })
    }

    /**
     * 取关玩家
     * @param uid 玩家UId
     */
    public static async UnFollowUser(uid: number): Promise<boolean> {
        return new Promise(async (resolve) => {
            let url = new XhrUrl("friend/unfollow").Url
            let msg = await Xhr.PostJson(url, { uid: uid })
            let success = msg['success']
            if (!success) {
                resolve(false)
                return
            }
            let data = msg['data']
            Clog.Green(ClogKey.Net, "UnFollowUser result=" + JSON.stringify(data));
            this.CurBanBanUserDetail.IsFllow = false;
            resolve(true)
        })
    }
}