/*
 * @Description: 
 * @Author: luo.fei
 * @Date: 2020-04-26 16:47:39
 */

/**
* 性别
*/
export enum EnumSex {
    Unknow = 0,
    Male = 1,
    Female = 2,
}

/**
 * 礼物背包界面页签
 */
export enum EnumGiftTab {
    Gift = "礼物",
    Bag = "背包",
}

/**
 * 房间类型 对应字段types
 */
export enum EnumRoomTypes {
    Normal = 'normal',
    Radio = 'radio',
    RadioDefend = 'radio-defend',
    Order = 'order',
    Auto = 'auto',
    Joy = 'joy',
    Cp = 'cp',
    CpLove = 'cp-love',
    Private = 'private',
}

/**
 * 房间中座位的role
 * 
 * 用户点击后排队上麦，分普通麦和老板麦
 */
export enum EnumRole {
    ROLE_REG = 0,
    ROLE_NORMAL = 1,
    ROLE_DISABLED = 2,
    ROLE_GOD = 3,
}

/**
 * 房间类型 对应字段type
 */
export enum EnumRoomSubType {

}

/**
 * 房间类型 对应字段mode
 */
export enum EnumRoomMode {
    Auto = "auto",      //自由上麦
    Lock = "lock",      //排队上麦
}

/**
 * 房间商业类型 对应字段business
 */
export enum EnumRoomBusiness {
    Normal = "normal",    //普通
    Order = "order",      //点单
    //娱乐
    //处对象
    //电台
    //唱见
    //点唱
}

export enum RoomProperty {
    Business = 'businss',
    Vip = 'vip',
    Fleet = 'fleet',
    Private = 'private'     //私人房间
}

export enum EnumMessageType {
    Message = 'message',
    Notify = 'notify',              //系统欢迎
    System = 'system',              //系统消息
    Package = 'package',            //有红包消息
    Box = 'box',                    //开箱子
    Local = 'local',                //本地组装消息到公屏
    CloseNotify = 'close-notify',   //关闭房间消息通知
    Guess = 'guess',                //画猜房
    AvatarGift = 'avatargift'       //头像礼物
}


export enum EnumMessageSubType {
    TxtMsg = "RC:TxtMsg",           //文字消息
}

export enum EnumUIRoomManagerTab {
    Online = "Online",
    Admin = "Manager"
}

/**
 * 房间的管理角色
 */
export enum EnumPurview {
    Createor = 'createor',      //创建者
    SuperAdmin = 'superAdmin',  //陈斌说这个就是接待管理员
    Admin = 'admin',            //普通管理员
    Normal = 'normal',          //普通人
    SuperPowerAdmin = 'SuperPowerAdmin' ,//二期新增超管，具有封号，关闭房间等功能
}


export enum EnumOnMicOp {
    ForbiddenMic = "forbiddenMic",
    UnforbiddenMic = "unforbiddenMic",
    UnlockMic = "unlockMic",
    LockMic = "lockMic",
    Timer = "timer",
}


export enum EnumEnv {
    Dev = 'dev',             //测试环境
    Alpha = 'alpha',        //测试环境 Alpha 版本
    Prod = 'prod'            //正式环境 
}

/**
 * 怎么进入游戏的
 */
export enum EnumEntryWay {
    XiYou = 'xiyou',             //西游进入
    Share = 'share',        //分享进入
    Test = 'test'            //测试（提审用的）
}


export enum EnumXiyouItemType{
    XiyouCommodity=1,//Xiyou商品
    XiyouProp=2,//Xiyou道具
}