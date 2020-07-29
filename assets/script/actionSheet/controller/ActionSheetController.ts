import { RoomController } from "../../room/controller/RoomController";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { UIActionSheet } from "../view/UIActionSheet";
import { JoinMicController } from "../../room/controller/JoinMicController";
import { EnumPurview, RoomProperty, EnumOnMicOp, EnumRoomMode } from "../../other/EnumCenter";
import { UserDetailController } from "../../userDetail/controller/UserDetailController";
import { UIUserDetail } from "../../userDetail/view/UIUserDetail";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { UIToast } from "../../common/view/UIToast";
import { TopicController } from "../../topic/controller/TopicController";
import { UIRoomSetting } from "../../roomSetting/view/UIRoomSetting";
import { ShareManager } from "../../common/controller/qqShare/ShareManager";
import { RoomAdminData, RoomOlineData } from "../../roomAdmin/model/RoomAdminData";
import { RoomAdminController } from "../../roomAdmin/controller/RoomAdminController";
import { Session } from "../../login/model/SessionData";
import { UITheme } from "../../roomSetting/view/UITheme";
import { XiYouGiftManager } from "../../xiyou/controller/XiYouGiftManager";
import { UIRoomAdmin } from "../../roomAdmin/view/UIRoomAdmin";
import { UIGift } from "../../sendGift/view/main/UIGift";
import { ActionSheetData } from "../model/ActionSheetData";
import { GiftTargetData } from "../../sendGift/model/GiftTargetData";
import { UICommDia } from "../../common/view/UICommDia";
import { UIMicWaiting } from "../../micWait/view/UIMicWaiting";
import { MicWaitController } from "../../micWait/controller/MicWaitController";




export class ActionSheetController {

    public static data: ActionSheetData

    //#region 点击的座位的 action sheet

    /**
     * 点击座位后，action sheet的事件
     * @param position 点击的座位号
     */
    public static async OnClickPosition(position: number) {
        Clog.Green(ClogKey.UI, "点击座位号：" + position + ",房间是否开启接待：" + RoomController.CurRoom.Reception + ",自己角色：" + RoomController.Purview);
        let i = 0;
        this.data = { Title: null, List: [] }

        let target = RoomController.Seats.find(item => item.Position == position)
        if (target == null) {
            return;
        }

        // case 该麦位有人
        if (target.HasPlayer) {
            this.data.Title = `你要对${target.UId == Session.BanBan.UId ? '自己' : target.Name}做什么？`

            //自己点自己
            if (target.UId === Session.BanBan.UId) {
                this.data.List.push({ Id: ++i, Desc: "下麦旁听", Action: () => this.authorityLeaveMic(position) });
                UIManager.OpenUI(UIActionSheet);
                return;
            }

            //自己点了别人
            switch (RoomController.Purview) {
                case EnumPurview.Createor:
                    {
                        if (target.IsForbidden) {
                            this.data.List.push({ Id: ++i, Desc: "开麦", Action: () => this.authorityUnforbiddenMic(position) });
                        }
                        else {
                            this.data.List.push({ Id: ++i, Desc: "禁麦", Action: () => this.authorityForbiddonMic(position) });
                        }
                        if (target.IsLock) {
                            this.data.List.push({ Id: ++i, Desc: "解封此麦", Action: () => this.authorityEnableMic(position) });
                        }
                        else {
                            this.data.List.push({ Id: ++i, Desc: "封闭此麦", Action: () => this.authorityDisableMic(position) });
                        }
                        this.data.List.push({ Id: ++i, Desc: "计时", Action: () => this.authorityTimer(position) });
                        this.data.List.push({ Id: ++i, Desc: "打赏", Action: () => this.sentGift(target.UId) });
                        this.data.List.push({ Id: ++i, Desc: "看资料", Action: () => this.authorityLookDetial(target.UId) });
                        this.data.List.push({ Id: ++i, Desc: "踢下麦", Action: () => this.authorityKick(position) });
                        this.data.List.push({ Id: ++i, Desc: "踢出房间", Action: () => this.authorityKickout(position) });
                        await UIManager.OpenUI(UIActionSheet);
                    }
                    return;
                case EnumPurview.Admin:
                    {
                        this.data.List.push({ Id: ++i, Desc: "打赏", Action: () => this.sentGift(target.UId) });
                        this.data.List.push({ Id: ++i, Desc: "看资料", Action: () => this.authorityLookDetial(target.UId) });
                        if (!target.IsAdmin && !target.IsCreator)   //管理员不能踢管理或房主
                        {
                            this.data.List.push({ Id: ++i, Desc: "踢出房间", Action: () => this.authorityKickout(position) });
                        }
                        await UIManager.OpenUI(UIActionSheet);
                    }
                    return;
                case EnumPurview.SuperPowerAdmin:
                    {
                        // this.data.List.push({ Id: ++i, Desc: "封号",Action: ()=> this.freezeUser(position)})
                        this.data.List.push({ Id: ++i, Desc: "打赏", Action: () => this.sentGift(target.UId) });
                        this.data.List.push({ Id: ++i, Desc: "看资料", Action: () => this.authorityLookDetial(target.UId) });
                        await UIManager.OpenUI(UIActionSheet);
                    }
                    return;
                default:
                    {
                        this.authorityLookDetial(target.UId)
                    }
                    return
            }
        }
        // 该麦位上没人
        else {
            const selfSeat = RoomController.GetSelfSeat();
            const isOnMic = !!selfSeat;// 自己在座位上

            switch (RoomController.Purview) {
                case EnumPurview.Createor:
                    {
                        Clog.Red(ClogKey.UI, "房主点了空位：" + target.Position + "号位" + "房主是否在麦上：" + isOnMic + ",座位是否被封：" + target.IsLock)
                        if (!isOnMic) {
                            this.data.List.push({
                                Id: ++i, Desc: "自己上麦", Action: async () => {
                                    await UIManager.CloseUI(UIActionSheet);
                                    JoinMicController.JoinMic(position)
                                }
                            })
                        }
                        if (target.IsLock) //座位锁住了
                        {
                            this.data.List.push({ Id: ++i, Desc: "解封此麦", Action: () => this.authorityEnableMic(position) });
                        }
                        else //座位没锁住，可以封闭此麦以及报人上麦
                        {
                            this.data.List.push({ Id: ++i, Desc: "封闭此麦", Action: () => this.authorityDisableMic(position) });
                            this.data.List.push({
                                Id: ++i, Desc: "抱人上麦", Action: async () => {
                                    await UIManager.CloseUI(UIActionSheet);
                                    await UIManager.OpenUI(UIRoomAdmin)
                                }
                            });
                        }
                        await UIManager.OpenUI(UIActionSheet);
                    }
                    return;
                case EnumPurview.Admin:
                case EnumPurview.SuperPowerAdmin:
                    {
                        if (isOnMic) {
                            UIToast.Show('您已在麦上');
                            return;
                        }

                        //管理员可以直接上麦，无论该座位是否上锁
                        JoinMicController.JoinMic(position);
                    }
                    return
                default:
                    {
                        if (isOnMic) {
                            UIToast.Show('您已在麦上');
                            return;
                        }
                        //空白位被封闭
                        if (target.IsLock && RoomController.CurRoom.Property != RoomProperty.Private) {
                            UIToast.Show('请换个座位');
                            return;
                        }
                        //空白位没有被封闭                   
                        if (RoomController.CurRoom.Mode == EnumRoomMode.Lock) {
                            //请求排队上麦
                            if (!MicWaitController.IsMicWaiting(Session.BanBan.UId)) {
                                UICommDia.Open(
                                    "是否要申请上麦",
                                    '确定',
                                    '取消',
                                    () => {
                                        MicWaitController.JoinMicWait(position);
                                    }
                                )
                            }
                            //在排队中
                            else {
                                await MicWaitController.micWaitListReq();
                                UIManager.OpenUI(UIMicWaiting);
                            }
                        }
                        else {
                            JoinMicController.JoinMic(position);
                        }
                    }
                    return;
            }
        }
    }


    private static async authorityLeaveMic(position: number) {
        Clog.Trace(ClogKey.UI, "下麦旁听");
        JoinMicController.LeaveMic(position);
        await UIManager.CloseUI(UIActionSheet);
    }


    private static async authorityUnforbiddenMic(position: number) {
        Clog.Trace(ClogKey.UI, "开麦");
        JoinMicController.onMic(position, EnumOnMicOp.UnforbiddenMic);
        await UIManager.CloseUI(UIActionSheet);
    }

    private static async authorityForbiddonMic(position: number) {
        Clog.Trace(ClogKey.UI, "禁麦");
        JoinMicController.onMic(position, EnumOnMicOp.ForbiddenMic);
        await UIManager.CloseUI(UIActionSheet);
    }

    private static async authorityEnableMic(position: number) {
        Clog.Trace(ClogKey.UI, "解封此麦");
        JoinMicController.onMic(position, EnumOnMicOp.UnlockMic);
        await UIManager.CloseUI(UIActionSheet);
    }


    private static async authorityDisableMic(position: number) {
        Clog.Trace(ClogKey.UI, "封闭此麦");
        JoinMicController.onMic(position, EnumOnMicOp.LockMic);
        await UIManager.CloseUI(UIActionSheet);
    }


    private static async authorityTimer(position: number) {
        Clog.Trace(ClogKey.UI, "计时");
        await UIManager.CloseUI(UIActionSheet);
        await this.setCountdown(position);
    }

    private static async setCountdown(position: number) {
        this.data.List = [];
        let i = 0;
        this.data.List.push({ Id: ++i, Desc: "1分钟", Action: () => this.timer(position, 1) });
        this.data.List.push({ Id: ++i, Desc: "2分钟", Action: () => this.timer(position, 2) });
        this.data.List.push({ Id: ++i, Desc: "3分钟", Action: () => this.timer(position, 3) });
        this.data.List.push({ Id: ++i, Desc: "4分钟", Action: () => this.timer(position, 4) });
        this.data.List.push({ Id: ++i, Desc: "5分钟", Action: () => this.timer(position, 5) });
        this.data.List.push({ Id: ++i, Desc: "6分钟", Action: () => this.timer(position, 6) });
        await UIManager.OpenUI(UIActionSheet);
    }

    private static timer(position: number, time: number) {
        Clog.Trace(ClogKey.UI, "计时 position=" + position + ",time=" + time);
        JoinMicController.onMic(position, EnumOnMicOp.Timer, time);
        UIManager.CloseUI(UIActionSheet);
    }

    /**
    * 看资料
    * @param uid 查看哪个玩家资料
    */
    private static async authorityLookDetial(uid: number) {
        Clog.Trace(ClogKey.UI, "查看资料");
        UserDetailController.TargetUserId = uid
        await UIManager.OpenUI(UIUserDetail);
        await UIManager.CloseUI(UIActionSheet);
    }

    /**
    * 踢下麦
    * @param position 把哪个座位上的玩家踢下麦
    */
    private static async authorityKick(position: number) {
        Clog.Trace(ClogKey.UI, "踢下麦");
        JoinMicController.LeaveMic(position);
        await UIManager.CloseUI(UIActionSheet);
    }

    /**
    * 踢出房间
    * @param position 把哪个座位上的玩家踢出房间
    */
    private static async authorityKickout(position: number) {
        Clog.Trace(ClogKey.UI, "踢出房间");
        await UIManager.CloseUI(UIActionSheet);
        await this.setKickout(position);
    }

    /**
    * 踢出房间选项
    * @param position 把哪个座位上的玩家踢出房间
    */
    private static async setKickout(position: number) {
        this.data.List = [];
        let i = 0;
        let target = RoomController.Seats.find(item => item.Position == position)
        if (!target) {
            return;
        }
        let uid = target.UId;

        this.data.List.push({ Id: ++i, Desc: "10分钟", Action: () => { this.kickout(uid, position, 600) } });
        this.data.List.push({ Id: ++i, Desc: "1小时", Action: () => { this.kickout(uid, position, 3600) } });
        this.data.List.push({ Id: ++i, Desc: "1天", Action: () => { this.kickout(uid, position, 86400) } });
        this.data.List.push({ Id: ++i, Desc: "1周", Action: () => { this.kickout(uid, position, 86400 * 7) } });
        this.data.List.push({ Id: ++i, Desc: "1个月", Action: () => { this.kickout(uid, position, 86400 * 30) } });
        await UIManager.OpenUI(UIActionSheet);
    }


    /**
    * 踢出房间
    */
    private static async kickout(uid: number, position: number, time: number) {
        Clog.Trace(ClogKey.UI, "踢出房间 position" + position);
        RoomController.Kickout(position, time);
        await UIManager.CloseUI(UIActionSheet);
    }


    /**
     * 自己上麦
     */
    private static async authorityJoinMic(position: number) {
        Clog.Trace(ClogKey.UI, "自己上麦");
        JoinMicController.JoinMic(position);
        await UIManager.CloseUI(UIActionSheet);
    }

    /**
     * 抱人上麦
     */
    private static async authorityJoinMicAnyone(uid: number, openId: string) {
        Clog.Trace(ClogKey.UI, "抱人上麦");
        JoinMicController.JoinMicAuto(uid, openId);
        await UIManager.CloseUI(UIActionSheet);
    }

    //#endregion

    //#region 关闭话题卡 action sheet

    public static async SetCloseTopic() {
        let i = 0;
        this.data = {
            Title: `所有话题将被清楚，是否关闭话题卡？`,
            List: []
        }
        this.data.List.push({ Id: ++i, Desc: `关闭`, Action: () => this.CloseTopic() });
        await UIManager.OpenUI(UIActionSheet);
    }


    /**
     * 关闭话题卡
     */
    private static async CloseTopic() {
        Clog.Trace(ClogKey.UI, "关闭话题卡");
        TopicController.CloseTopic();
        UIManager.CloseUI(UIActionSheet);
    }
    //#endregion

    //#region 更多按钮点击 action sheet
    public static async SetMore() {
        let i = 0;
        this.data = { Title: `更多`, List: [] }
        if (RoomController.Purview == EnumPurview.Createor || RoomController.Purview == EnumPurview.Admin) {
            this.data.List.push({ Id: ++i, Desc: `修改资料`, Action: () => this.modifiyRoom() });
            this.data.List.push({ Id: ++i, Desc: `主题样式`, Action: () => this.theme() });
            this.data.List.push({ Id: ++i, Desc: `分享`, Action: () => this.share() });

            let str1=RoomController.CurRoom.Mode == EnumRoomMode.Auto?'关闭自由上麦':'开启自由上麦';
            this.data.List.push({ Id: ++i, Desc: str1, Action: () => this.joinMicMode() });
            let str2=RoomController.CurRoom.IsOpenChat?'关闭公屏':'开启公屏';
            this.data.List.push({ Id: ++i, Desc: str2, Action: () => this.UIChatCheck() });

        }
        else {
            if (RoomController.Purview == EnumPurview.SuperPowerAdmin) {
                this.data.List.push({ Id: ++i, Desc: `关闭房间`, Action: () => this.closeRoom() });
            }
            this.data.List.push({ Id: ++i, Desc: `分享`, Action: () => this.share() });
        }

        await UIManager.OpenUI(UIActionSheet);
    }

    /**
     * 修改资料
     */
    private static async modifiyRoom() {
        Clog.Trace(ClogKey.UI, "修改资料");
        await UIManager.CloseUI(UIActionSheet);
        await UIManager.OpenUI(UIRoomSetting);
    }

    /**
     * 修改主题
     */
    private static async theme() {
        Clog.Trace(ClogKey.UI, "修改主题");
        await UIManager.CloseUI(UIActionSheet);
        await UIManager.OpenUI(UITheme);
    }

    /**
    * 分享
    */
    private static async share() {
        Clog.Trace(ClogKey.UI, "分享");
        await UIManager.CloseUI(UIActionSheet);
        ShareManager.Share();
    }

    /**
    * 开启还是关闭自由上麦
    */
    private static async joinMicMode() {
        Clog.Trace(ClogKey.UI, "开启还是关闭自由上麦");
        await UIManager.CloseUI(UIActionSheet);
        await JoinMicController.joinMicModeReq(RoomController.CurRoom.Mode != EnumRoomMode.Auto);
    }

    /**
    * 开启还是关闭公屏
    */
   private static async UIChatCheck() {
    Clog.Trace(ClogKey.UI, "开启还是关闭公屏");
    await UIManager.CloseUI(UIActionSheet);
    await RoomController.ChatCheck(!RoomController.CurRoom.IsOpenChat);
    UIToast.Show('操作成功');    
}
    //#endregion

    //#region 针对管理员的 action sheet
    public static async SetAdmin(target: RoomAdminData) {
        let i = 0;
        this.data = {
            Title: `你要对${target.Name}做什么？`,
            List: []
        }

        let position = RoomController.GetPositionByUserId(target.UId);
        const isOnMic = position >= 0;// 针对的管理员是不是在麦上
        if (!isOnMic) {
            this.data.List.push({ Id: ++i, Desc: "抱人上麦", Action: () => this.authorityJoinMicAnyone(target.UId, target.OpenId) });
        }

        this.data.List.push({ Id: ++i, Desc: "踢出房间", Action: () => this.authorityKickout(position) });
        if (isOnMic) {
            this.data.List.push({ Id: ++i, Desc: "打赏", Action: () => this.sentGift(target.UId) });
        }
        this.data.List.push({ Id: ++i, Desc: "看资料", Action: () => this.authorityLookDetial(target.UId) });
        //只有房主能将其它人设为管理员
        if (RoomController.Purview == EnumPurview.Createor) {
            this.data.List.push({ Id: ++i, Desc: "取消管理", Action: () => this.cancelNormalAdmin(target.UId) });
        }
        await UIManager.OpenUI(UIActionSheet);
    }

    //#endregion

    //#region 针对所有在线者的 action sheet

    public static async SetOnline(target: RoomOlineData) {
        let i = 0;
        this.data = {
            Title: `你要对${target.Name}做什么？`,
            List: []
        }

        let position = RoomController.GetPositionByUserId(target.UId);
        const isOnMic = position >= 0;// 针对的管理员是不是在麦上
        if (isOnMic) {
            this.data.List.push({ Id: ++i, Desc: "打赏", Action: () => this.sentGift(target.UId) });
        }
        else {
            this.data.List.push({ Id: ++i, Desc: "抱人上麦", Action: () => this.authorityJoinMicAnyone(target.UId, target.OpenId) });
        }
        if (target.Role == EnumPurview.Normal) //只能T普通人
        {
            this.data.List.push({ Id: ++i, Desc: "踢出房间", Action: () => this.authorityKickout(position) });
        }
        this.data.List.push({ Id: ++i, Desc: "看资料", Action: () => this.authorityLookDetial(target.UId) });

        //只有房主能将其它人设为管理员
        if (RoomController.Purview == EnumPurview.Createor) {
            if (target.Role == EnumPurview.Normal) {
                // this.data.List.push({ Id: ++i, Desc: "设为接待管理", Action: () => this.setAsSuperAdmin(target.UId) });
                this.data.List.push({ Id: ++i, Desc: "设为管理", Action: () => this.SetAsNormalAdmin(target.UId) });
            }
            else if (target.Role == EnumPurview.Admin) {
                this.data.List.push({ Id: ++i, Desc: "取消管理", Action: () => this.cancelNormalAdmin(target.UId) });
            }
        }
        await UIManager.OpenUI(UIActionSheet);
    }

    private static sentGift(uid: number) {
        XiYouGiftManager.CurSendGiftTarget = new GiftTargetData().Add(uid)
        UIManager.OpenUI(UIGift);
        UIManager.CloseUI(UIUserDetail);
        UIManager.CloseUI(UIActionSheet);
    }

    // private static setAsSuperAdmin(uid: number) {
    //     Clog.Trace(ClogKey.UI, "设为接待管理员，uid:" + uid);
    //     RoomAdminManager.SetRoomAdmin(uid, EnumPurview.SuperAdmin);
    //     UIManager.CloseUI(UIActionSheet);
    // }

    // private static cancelSuperAdmin(uid: number) {
    //     Clog.Trace(ClogKey.UI, "取消接待管理:" + uid);
    //     RoomAdminManager.CanelRoomAdmin(uid, EnumPurview.SuperAdmin);
    //     UIManager.CloseUI(UIActionSheet);
    // }

    private static SetAsNormalAdmin(uid: number) {
        Clog.Trace(ClogKey.UI, "设为普通管理:" + uid);
        RoomAdminController.SetRoomAdmin(uid, EnumPurview.Admin);
        UIManager.CloseUI(UIActionSheet);
    }

    private static cancelNormalAdmin(uid: number) {
        Clog.Trace(ClogKey.UI, "取消普通管理:" + uid);
        RoomAdminController.CanelRoomAdmin(uid, EnumPurview.Admin);
        UIManager.CloseUI(UIActionSheet);
    }

    //#endregion

    /**
    * 封号
    */
   private static async freezeUser(position: number) {
        Clog.Trace(ClogKey.UI,"封号位置:" + position);
        await UIManager.CloseUI(UIActionSheet);
        await this .setfreezeUserSheet(position);
    }
    /**
     * 封号选项
     */
    private static async setfreezeUserSheet(position: number) {
        this.data = { Title: `请选择封号时长`, List: [] }
        let i = 0;
        this.data.List.push({ Id: ++i, Desc: "1小时 ", Action: () => { this.freezeUserTime(position, 3600) } });
        this.data.List.push({ Id: ++i, Desc: "12小时", Action: () => { this.freezeUserTime(position, 43200) } });
        this.data.List.push({ Id: ++i, Desc: "24小时", Action: () => { this.freezeUserTime(position, 86400) } });
        this.data.List.push({ Id: ++i, Desc: "7天", Action: () => { this.freezeUserTime(position, 86400 * 7) } });
        this.data.List.push({ Id: ++i, Desc: "30天", Action: () => { this.freezeUserTime(position, 86400 * 30) } });
        await UIManager.OpenUI(UIActionSheet);
    }

    /**
    * 封号操作
    */
    private static async freezeUserTime(position: number, time: number) {
        Clog.Trace(ClogKey.UI, "封号位置:" + position);
        RoomController.freezeUser(position, time);
        await UIManager.CloseUI(UIActionSheet);
    }

    /**
    * 关闭房间
    */
    private static async closeRoom() {
        Clog.Trace(ClogKey.UI, "关闭房间");
        await UIManager.CloseUI(UIActionSheet);
        await this.setCloseRoomSheet();
    }

    /**
    * 关闭房间选项
    */
    private static async setCloseRoomSheet() {
        this.data = { Title: `请选择关闭房间时长`, List: [] }
        let i = 0;
        let roomId = RoomController.CurRoom.RoomId;
        if (!roomId) {
            return;
        }
        this.data.List.push({ Id: ++i, Desc: "1小时 ", Action: () => { this.closeRoomTime(roomId, 3600) } });
        this.data.List.push({ Id: ++i, Desc: "12小时", Action: () => { this.closeRoomTime(roomId, 43200) } });
        this.data.List.push({ Id: ++i, Desc: "24小时", Action: () => { this.closeRoomTime(roomId, 86400) } });
        this.data.List.push({ Id: ++i, Desc: "7天", Action: () => { this.closeRoomTime(roomId, 86400 * 7) } });
        this.data.List.push({ Id: ++i, Desc: "30天", Action: () => { this.closeRoomTime(roomId, 86400 * 30) } });
        await UIManager.OpenUI(UIActionSheet);
    }

    /**
    * 关闭房间
    */
    private static async closeRoomTime(roomId: number, time: number) {
        Clog.Trace(ClogKey.UI, "关闭房间 roomId" + roomId);
        RoomController.closeRoom(roomId, time);
        await UIManager.CloseUI(UIActionSheet);
    }
}