/*
 * @Description: 事件命令，一般用于通知UI刷新事件
 * @Author: luo.fei
 * @Date: 2020-04-24 15:32:30
 */
export class EventCommond {
    public static CommDiaEvent = 'CommDiaEvent';
    public static EventLogout = "EventLogout";
    public static UIRoomChat = "EventRoomChat";                       //房间内有人说话
    public static UIRoomWellcome = "UIRoomWellcome";                   //房间内显示欢迎
    public static UIVistorEmoji = "UIVistorEmoji";                     //房间内访客发送表情
    public static UIPlayerEmoji = "UIPlayerEmoji";                     //房间内在玩家发表情
    public static UIRoomOnline = "EventRoomOnline";                   //刷新房间火热度变化的UI
    public static OnRelink = "OnRelink";
    public static UIRoomRefresh = "EventRoomRefresh";                 //刷新整个房间的状态
    public static UIRoomReset = "EventRoomReset";       
    public static UIRoomMicBt = "EventRoomMicBt";                     //刷新房间的麦克风按钮状态
    public static UITopic = "EventTopic";                             //刷新话题卡
    public static UITopicTagChange = "EventTopicTagChange";           //刷新话题卡的选中标签
    public static UIMicWait= "EventUIMicWait";                          //排麦列表
    public static OnXiYouMoneyChange = "OnSessionMoneyChange";           //xiyou的钱改变了，刷新房间内显示钱的数量
    public static OnSelectGiftNumChange = "OnSelectGiftNumChange";         //赠送礼物时，当礼物Num发生改变，刷新UI显示
    public static OnSelectGiftIdChange = "OnSelectGiftIdChange";           //赠送礼物时，当礼物数量Id改变，刷新UI显示
    public static OnSendGiftWordTip = 'OnSendGiftWordTip';                  //赠送了礼物文字通知
    public static OnShowGiftEffect = 'OnShowGiftEffect';                    //显示礼物特效
    public static OnShowGiftCountTip = 'OnShowGiftCountTip';                    //显示礼物数量提示
    public static SubLoadSuccess = 'SubLoadSuccess';                  //分包
    public static OnSelectRoomManagerOnlineTab = "OnSelectRoomManagerOnlineTab"     //当点击房间管理界面里的tab页签
    public static UIThemeBackground = 'UIThemeBackground';                                // 刷新主题背景
    public static OnRoomKick = "OnRoomKick";  
    public static CloseQQChatBack = "CloseQQChatBack";  
    public static UINewbieGuildStep = "UINewbieGuildStep";  
    public static UIChatCheck="UIChatCheck";                            //公屏文字的开关
}