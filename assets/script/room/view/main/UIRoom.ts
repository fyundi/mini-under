import { UIBase } from "../../../../base/script/frame/ui/UIBase";
import Clog, { ClogKey } from "../../../../base/script/frame/clog/Clog";
import { UIEventCenter } from "../../../../base/script/util/UIEventCenter";
import { UIManager } from "../../../../base/script/frame/ui/UIManager";

import { UIUtil } from "../../../../base/script/frame/ui/UIUtil";
import { Chat } from "../chat/Chat";
import { RoomSeats } from "../seat/RoomSeats";
import { RoomController } from "../../controller/RoomController";
import { SS, qq } from "../../../../base/script/global/SS";
import { ChatInput } from "../chat/ChatInput";
import { EventCommond } from "../../../other/EventCommond";
import { UIEmoji } from "../../../emoji/view/UIEmoji";
import { JoinMicController } from "../../controller/JoinMicController";

import { PlatformApi } from "../../../../base/script/api/PlatformApi";
import { QQSystemInfo } from "../../../other/QQSystemInfo";
import { UITopic } from "../../../topic/view/UITopic";
import { RoomTopic } from "../../../topic/view/RoomTopic";
import { TopicController } from "../../../topic/controller/TopicController";
import { UIRoomAdmin } from "../../../roomAdmin/view/UIRoomAdmin";
import { EnumPurview, EnumRoomMode } from "../../../other/EnumCenter";
import { ActionSheetController } from "../../../actionSheet/controller/ActionSheetController";
import { XiYouGiftManager } from "../../../xiyou/controller/XiYouGiftManager";
import { XiYouController } from "../../../xiyou/controller/XiYouController";
import { UICommDia } from "../../../common/view/UICommDia";
import { UIGift } from "../../../sendGift/view/main/UIGift";
import { GiftTargetData } from "../../../sendGift/model/GiftTargetData";
import { EntryController } from "../../../entry/controller/EntryController";
import { UIMicWaiting } from "../../../micWait/view/UIMicWaiting";
import { MicWaitController } from "../../../micWait/controller/MicWaitController";
import { Session } from "../../../login/model/SessionData";
import { UIMicWaitList } from "../../../micWait/view/UIMicWaitList";
import { ChatInputController } from "../../controller/ChatInputController";
import { ShareManager } from "../../../common/controller/qqShare/ShareManager";
import { SystemInfoManager } from "../../../../base/script/global/SystemInfoManager";
import { NewbieGuildController } from "../../../newbie/control/NewbieGuildController";

/**
 * TODO: 需要考虑到被踢出房间之后不能进入的情况
 * [url]:https://dev.iambanban.com/room/config?package=im.9chat.minigame.qq&_ipv=0&_platform=qq&_model=iPhone_XR&_timestamp=1589793140.745&_index=2	
 * [msg]:{"success":false,"msg":"被禁止进入该聊天室,直到2020-05-18 17:21:46"}
 */
export class UIRoom extends UIBase {

    public PrefabName = 'P_UIRoom'

    private _roomName: cc.Label;
    private _roomId: cc.Label;
    private _btnReturn: cc.Button;
    private _topWidget: cc.Widget;
    private _bottomWidget: cc.Widget;
    private _chatInput: cc.Node;
    private _btnMore: cc.Button;
    private _btnChat: cc.Button;
    private _btnTopic: cc.Button;
    private _btnGift: cc.Button;
    private _btnEmoji: cc.Button;
    private _btnOnMic: cc.Button;        //上麦按钮
    private _btnMicMute: cc.Button;      //上麦之后静音
    private _btnMicUnmute: cc.Button;    //上麦之后开麦
    private _btnHot: cc.Button;
    private _hotLabel: cc.Label;
    private _roomTypeLabel: cc.Label;
    private _chat: cc.Node;
    private _seat: cc.Node
    private _background: cc.Sprite;
    private _topic: cc.Node;
    private _topicBg: cc.Node;
    private _btnShare: cc.Button;
    private _joinMicTip: cc.Node;        //排麦模式下上麦的提示
    private _btnMicWait: cc.Button;      //排麦模式下查看排队的人的入口
    private _micWaitLabel: cc.Label;     //排麦模式下排队的人数    
    private _qqChatCloseBtn: cc.Button; //用于关闭qq调起的输入法

    //#region -----------------房间初始化--------------------
    //初始化节点，初始化事件
    onLoad() {
        this.initRoot();
        this.initEvent();
    }

    start() {
        this.refreshPanelPosition();
        this.refreshPanel();
    }

    onDestroy() {
        this.removeEvent();
    }

    //初始化所有UI节点
    private initRoot() {
        this._btnReturn = cc.find("Top/BtnReturn", this.node).getComponent(cc.Button);
        this._hotLabel = cc.find("Top/Hot/Label", this.node).getComponent(cc.Label);
        this._roomName = cc.find("Top/RoomName", this.node).getComponent(cc.Label);
        this._roomId = cc.find("Top/RoomId/Number", this.node).getComponent(cc.Label);
        this._topWidget = cc.find("Top", this.node).getComponent(cc.Widget);
        this._bottomWidget = cc.find("Bottom", this.node).getComponent(cc.Widget);
        this._btnMore = cc.find("Bottom/Right/BtnMore", this.node).getComponent(cc.Button);
        this._btnTopic = cc.find("Bottom/Right/BtnTopic", this.node).getComponent(cc.Button);
        this._btnGift = cc.find("Bottom/Right/BtnGift", this.node).getComponent(cc.Button);
        this._btnChat = cc.find("Bottom/Right/BtnChat", this.node).getComponent(cc.Button);
        this._btnEmoji = cc.find("Bottom/Right/BtnEmoji", this.node).getComponent(cc.Button);
        this._btnOnMic = cc.find("Bottom/Left/BtnOnMic", this.node).getComponent(cc.Button);
        this._btnMicMute = cc.find("Bottom/Left/BtnMicMute", this.node).getComponent(cc.Button);
        this._btnMicUnmute = cc.find("Bottom/Left/BtnMicUnmute", this.node).getComponent(cc.Button);
        this._btnHot = cc.find("Top/Hot", this.node).getComponent(cc.Button);
        this._roomTypeLabel = cc.find('Top/Type/Label', this.node).getComponent(cc.Label);
        this._btnShare = cc.find("BtnShare", this.node).getComponent(cc.Button);
        this._seat = cc.find("Player", this.node);
        this._seat.addComponent(RoomSeats);
        this._chat = cc.find("Chat", this.node);
        this._chat.addComponent(Chat);
        this._chatInput = cc.find("ChatInput", this.node);
        this._chatInput.addComponent(ChatInput);
        this._background = cc.find("Bg", this.node).getComponent(cc.Sprite);
        this._topic = cc.find('Topic', this.node);
        this._topicBg = cc.find('Topic/Content', this.node);
        this._topic.addComponent(RoomTopic);
        this._chatInput.active = false;
        this._topicBg.active = TopicController.IsOpenTopic;
        this._btnTopic.node.active = RoomController.Purview == EnumPurview.Createor; // TODO: 当后台写完了接口之后，开启这个
        // this._btnTopic.node.active = false;
        this._joinMicTip = cc.find('Bottom/Left/BtnOnMic/joinMicTip', this.node);
        this._joinMicTip.active = false;
        this._btnMicWait = cc.find('Player/MicWaitBtn', this.node).getComponent(cc.Button);
        this._btnMicWait.node.active = false;
        this._micWaitLabel = cc.find('Player/MicWaitBtn/img/label', this.node).getComponent(cc.Label);
        this._qqChatCloseBtn = cc.find("QQChatCloseBtn", this.node).getComponent(cc.Button);
        this._qqChatCloseBtn.node.active = false;
    }

    //初始化面板点击事件
    private initEvent() {
        //按钮点击事件
        UIEventCenter.ButtonEvent(this._btnReturn, () => this.onBtnReturnClick());
        UIEventCenter.ButtonEvent(this._btnMore, () => this.onBtnMoreClick());
        UIEventCenter.ButtonEvent(this._btnChat, () => this.onBtnChatClick());
        UIEventCenter.ButtonEvent(this._btnGift, () => this.onBtnGiftClick());
        UIEventCenter.ButtonEvent(this._btnEmoji, () => this.onBtnEmojiClick());
        UIEventCenter.ButtonEvent(this._btnOnMic, () => this.onBtnOnMicClick());
        UIEventCenter.ButtonEvent(this._btnMicMute, () => this.onBtnMicMuteClick());
        UIEventCenter.ButtonEvent(this._btnMicUnmute, () => this.onBtnMicUnmuteClick());
        UIEventCenter.ButtonEvent(this._btnTopic, () => this.onBtnTopic());
        UIEventCenter.ButtonEvent(this._btnHot, () => { this.onBtnHotClick() })
        UIEventCenter.ButtonEvent(this._btnShare, () => { this.onBtnShareClick() })
        UIEventCenter.ButtonEvent(this._btnMicWait, () => { this.onBtnMicWaitClick() });
        UIEventCenter.ButtonEvent(this._qqChatCloseBtn, () => { this.onQQChatBtnCloseClick() })

        //界面刷新事件
        SS.EventCenter.on(EventCommond.UIRoomOnline, this.refreshHotLabel, this);
        SS.EventCenter.on(EventCommond.UIRoomMicBt, this.refreshMicBtn, this);
        SS.EventCenter.on(EventCommond.UITopic, this.refreshTopic, this);
        SS.EventCenter.on(EventCommond.UIRoomRefresh, this.refreshHotLabel, this);
        SS.EventCenter.on(EventCommond.UIRoomRefresh, this.refreshRoomName, this);
        SS.EventCenter.on(EventCommond.UIRoomRefresh, this.refreshRoomId, this);
        SS.EventCenter.on(EventCommond.UIRoomRefresh, this.refreshBackground, this);
        SS.EventCenter.on(EventCommond.UIMicWait, this.refreshMicWait, this);
        SS.EventCenter.on(EventCommond.UIThemeBackground, this.refreshBackground, this);      
        SS.EventCenter.on(EventCommond.CloseQQChatBack, this.closeQQChatBack, this);
        SS.EventCenter.on(EventCommond.UIChatCheck, this.refreshChatCheck, this);
    }

    private removeEvent() {
        SS.EventCenter.off(EventCommond.UIRoomOnline, this.refreshHotLabel, this);
        SS.EventCenter.off(EventCommond.UIRoomMicBt, this.refreshMicBtn, this);
        SS.EventCenter.off(EventCommond.UITopic, this.refreshTopic, this);
        SS.EventCenter.off(EventCommond.UIRoomRefresh, this.refreshHotLabel, this);
        SS.EventCenter.off(EventCommond.UIRoomRefresh, this.refreshRoomName, this);
        SS.EventCenter.off(EventCommond.UIRoomRefresh, this.refreshRoomId, this);
        SS.EventCenter.off(EventCommond.UIRoomRefresh, this.refreshBackground, this);
        SS.EventCenter.off(EventCommond.UIMicWait, this.refreshMicWait, this);
        SS.EventCenter.off(EventCommond.UIThemeBackground, this.refreshBackground, this);  
        SS.EventCenter.off(EventCommond.CloseQQChatBack, this.closeQQChatBack, this);
        SS.EventCenter.off(EventCommond.UIChatCheck, this.refreshChatCheck, this);
    }

    /**
     * 布局自适应方法
     * 1. 在浏览器中，只有一个固定样式显示，
     * 2. 发布QQ平台时，通过调用QQ的api，获取systemInfo后，重新布局主界面内容
     */
    private refreshPanelPosition(isOpenTopic: boolean = false) {

        //房间名在布局的top所在的高度
        let roomNameTop = 0;
        if (qq) {

            let res = qq.getMenuButtonBoundingClientRect();
            let centerHeight = (res.top + res.height / 2) / SystemInfoManager.CurSystemInfo.screenHeight * cc.winSize.height; // 中心线
            roomNameTop = centerHeight - this._topWidget.node.height / 2;

            //iphoneX的ui适应
            let chatInputWidget = this._chatInput.getComponent(cc.Widget);
            EntryController.IphoneXUIFit([chatInputWidget, this._bottomWidget], 20);
        }
        this._topWidget.top = roomNameTop;

        //玩家列表所在的高度
        let seatWidget = this._seat.getComponent(cc.Widget);
        seatWidget.top = roomNameTop + 100;

        //主题所在高度
        let topicWidget = this._topic.getComponent(cc.Widget);
        topicWidget.top = roomNameTop + 700;

        let shareWidget = this._btnShare.node.getComponent(cc.Widget);
        shareWidget.top = roomNameTop + 100;

        //聊天栏所在高度
        let chatWidget = this._chat.getComponent(cc.Widget);
        if (isOpenTopic) {
            chatWidget.top = roomNameTop + 1050;
        }
        else {
            chatWidget.top = roomNameTop + 700;
        }
        chatWidget.bottom = 120;
        NewbieGuildController.QQTopWidget = roomNameTop;
        NewbieGuildController.ButtomWidget = this._bottomWidget.bottom;
    }


    //#endregion 

    //#region ------------ 加载远程图片------------------------------------

    //加载远程图片
    private loadRemoteImage() {
        this.refreshBackground();
    }

    //刷新背景图片
    private refreshBackground() {
        let url = SS.ImageUrlProxy + 'static/background/room_background_' + RoomController.CurRoom.Background + '.jpg?v=2';
        UIUtil.LoadRemoteImage(url, this._background);
    }

    //#endregion

    //#region --------------按钮点击事件----------------
    /**
     * @description: 返回按钮点击事件
     */
    private onBtnReturnClick() {
        Clog.Trace(ClogKey.UI, "UIRoom, OnBtnCloseClick");
        UICommDia.Open(
            "是否退出语音派对",
            '再玩会',
            '退出',
            () => { },                  // 无事发生
            () => {

                XiYouController.JumpToXiyou();
            },
        )
    }

    /**
     * @description: 更多按钮点击事件（页面右下角的...按钮）
     */
    private onBtnMoreClick() {
        Clog.Trace(ClogKey.UI, "UIRoom, onBtnMoreClick");
        ActionSheetController.SetMore();
    }

    /**
     * @description: 聊天按钮点击事件
     */
    private async onBtnChatClick() {
        Clog.Trace(ClogKey.UI, "UIRoom, onBtnChatClick");
        //公屏关闭是不能发言的
        if (!RoomController.CurRoom.IsOpenChat) {
            return;
        }
        if (qq) {
            let isKeyBoardShow = await ChatInputController.QQInputHandler();
            this._qqChatCloseBtn.node.active = isKeyBoardShow;
        }
        else {
            this._chatInput.active = true;
            let chatInput = this._chatInput.getComponent(ChatInput);
            chatInput.setFocus();
        }
    }

    private closeQQChatBack() {
        this._qqChatCloseBtn.node.active = false;
    }

    /**
     * @description: 聊天按钮点击事件
     */
    private onQQChatBtnCloseClick() {
        this._qqChatCloseBtn.node.active = false;
        if (qq) {
            ChatInputController.QQHideKeyBoard();
        }
    }

    private onBtnTopic() {
        Clog.Trace(ClogKey.UI, "UIRoom, onBtnChatClick");
        UIManager.OpenUI(UITopic);
    }

    private onBtnHotClick() {
        //是房主或管理员才能打开界面
        if (RoomController.Purview != EnumPurview.Normal) {
            UIManager.OpenUI(UIRoomAdmin);
        }
    }

    private onBtnShareClick() {
        Clog.Trace(ClogKey.UI, "UIRoom, onBtnShareClick");
        ShareManager.Share();
    }

    /**
     * @description: 礼物按钮点击事件
     */
    private onBtnGiftClick() {
        Clog.Trace(ClogKey.UI, "UIRoom, onBtnGiftClick");
        XiYouGiftManager.CurSendGiftTarget = new GiftTargetData()
        // 如果房主在座位上 则默认选中房主 如果房主不在座位上 则默认不选中
        for (let index = 0; index < RoomController.Seats.length; index++) {
            const element = RoomController.Seats[index];
            // 如果房主在座位上 则选中房主
            if (element.HasPlayer && element.UId === RoomController.CreateorInfo.UId) {
                XiYouGiftManager.CurSendGiftTarget.Add(element.UId)
                break;
            }
        }
        //打开礼物赠送面板
        UIManager.OpenUI(UIGift)
    }

    /**
     * @description: 表情按钮点击事件
     */
    private onBtnEmojiClick() {
        Clog.Trace(ClogKey.UI, "UIRoom, onBtnEmojClick");
        //公屏关闭并且不在麦上，不能发表情
        if (!RoomController.CurRoom.IsOpenChat && !RoomController.Seats.find(item => item.UId == Session.BanBan.UId)) {
            return;
        }
        UIManager.OpenUI(UIEmoji)
    }

    /**
    * @description: 上麦按钮点击事件
    */
    private async onBtnOnMicClick() {
        Clog.Trace(ClogKey.UI, "UIRoom, onBtnOnMicClick");
        //排麦
        if (RoomController.CurRoom.Mode == EnumRoomMode.Lock && RoomController.Purview != EnumPurview.Createor
            &&RoomController.Purview != EnumPurview.Admin) {
            //请求上麦排队
            if (!MicWaitController.IsMicWaiting(Session.BanBan.UId)) {
                UICommDia.Open(
                    "是否要申请上麦",
                    '确定',
                    '取消',
                    () => {
                        MicWaitController.JoinMicWait(-1);
                    }
                )
            }
            //正在排队
            else {
                await MicWaitController.micWaitListReq();
                UIManager.OpenUI(UIMicWaiting);
            }

        }
        //自由上麦
        else {
            {
                UICommDia.Open(
                    "是否要申请上麦",
                    '确定',
                    '取消',
                    () => {
                        //自动上麦
                        JoinMicController.JoinMicAuto();
                    }
                )
            }
        }
    }

    /**
    * @description: 上麦后自己主动禁言
    */
    private onBtnMicMuteClick() {
        Clog.Trace(ClogKey.UI, "UIRoom, onBtnMicMuteClick");
        JoinMicController.SelfMicUnmute();
    }

    /**
     * @description: 上麦之后自己主动发言
     */
    private onBtnMicUnmuteClick() {
        Clog.Trace(ClogKey.UI, "UIRoom, onBtnMicUnmuteClick");
        JoinMicController.SelfMicMute();
    }

    /**
     * 打开排麦人列表
     */
    private async onBtnMicWaitClick() {        
        await MicWaitController.micWaitListReq();     
        UIManager.OpenUI(UIMicWaitList);
    }

    //#endregion

    //#region  ------------刷新界面方法---------------

    //刷新整个面板
    private refreshPanel() {
        this.refreshRoomName();
        this.refreshRoomId();
        this.refreshHotLabel();
        this.loadRemoteImage();
        this.refreshMicBtn();
        this.refreshRoomType();
        this.refreshChatCheck();
    }

    /**
     * @description: 刷新房间火热度
     */
    private refreshHotLabel() {
        if (RoomController.CurRoom.Hot > 10000) {
            this._hotLabel.string = (RoomController.CurRoom.Hot / 10000).toFixed(2) + 'w';
            return
        }
        this._hotLabel.string = '' + RoomController.CurRoom.Hot;
    }

    private refreshRoomName() {
        this._roomName.string = RoomController.CurRoom.RoomName;
    }

    private refreshRoomId() {
        this._roomId.string = "房号ID:" + RoomController.CurRoom.RoomId.toString();
    }

    private refreshMicBtn() {
        Clog.Green(ClogKey.UI, "[refreshMicBtn]----------JoinMicManager.MicMute:" + JoinMicController.MicMute);
        let selfseat = RoomController.GetSelfSeat();
        if (!selfseat) {
            this._btnOnMic.node.active = true;
            this._btnMicMute.node.active = false;
            this._btnMicUnmute.node.active = false;
            return
        }
        if (JoinMicController.MicMute) {
            this._btnOnMic.node.active = false;
            this._btnMicMute.node.active = true;
            this._btnMicUnmute.node.active = false;
            return
        }
        this._btnOnMic.node.active = false;
        this._btnMicMute.node.active = false;
        this._btnMicUnmute.node.active = true;
    }

    private refreshRoomType() {
        this._roomTypeLabel.string = '' + RoomController.CurRoom.TypeLabel;
    }

    private refreshTopic() {
        if (TopicController.IsOpenTopic !== this._topicBg.active) {
            this._topicBg.active = TopicController.IsOpenTopic;
            this.refreshPanelPosition(TopicController.IsOpenTopic);
        }

        if (RoomController.Purview == EnumPurview.Createor) {
            this._btnTopic.node.active = true;
        }
        else {
            this._btnTopic.node.active = false;
        }
    }

    /**
     * 刷新房间ui的排麦提示
     */
    private refreshMicWait() {
        if (RoomController.CurRoom.Mode != EnumRoomMode.Lock) {
            this._joinMicTip.active = false;
            this._btnMicWait.node.active = false;
            return;
        }
        //排麦模式下,正在排麦中
        if (MicWaitController.IsMicWaiting(Session.BanBan.UId)) {
            this._joinMicTip.active = true;
        }
        else {
            this._joinMicTip.active = false;
        }

        if (RoomController.Purview == EnumPurview.Createor) {
            if (MicWaitController.JoinMicWaitIDList.length > 0) {
                this._btnMicWait.node.active = true;
                this._micWaitLabel.string = MicWaitController.JoinMicWaitIDList.length.toString();
            }
            else {
                this._btnMicWait.node.active = false;
            }
        }
        else {
            this._btnMicWait.node.active = false;
        }
    }


    /**
     * 公屏开或关对应的ui效果
     */
    public refreshChatCheck() {
        if (RoomController.CurRoom.IsOpenChat) {
            let emoji = this._btnEmoji.node.getChildByName("Icon");
            emoji.color = new cc.Color(255, 255, 255, 255);
            let chatInput = this._btnChat.node.getChildByName("Icon");
            chatInput.color = new cc.Color(255, 255, 255, 255);
        }
        else {
            let emoji = this._btnEmoji.node.getChildByName("Icon");
            let res = RoomController.Seats.find(item => item.UId == Session.BanBan.UId);  //自己是否在麦上
            if (res) {
                emoji.color = new cc.Color(255, 255, 255, 255);
            }
            else {
                emoji.color = new cc.Color(155, 155, 155, 255);
            }
            let chatInput = this._btnChat.node.getChildByName("Icon");
            chatInput.color = new cc.Color(155, 155, 155, 255);
        }
    }
    //#endregion
}