export default class MsgDefine {

	//---登陆
	public static U_HEAR_MSG: string = "system.jump";//心跳
	/** 长链打点 未登录 */
	public static U_USER_LOGIN: string = "game.login";//客户端发起登陆大厅

	public static U_INFO_POST: string = "post.platform.info";//发送玩家数据给服务器

	//------------------------小游戏新消息------------------------

	/**
	 * 获取礼物列表
	 */
	public static REQUEST_GET_GIFT_PANEL = "get.gift.panel";
	/**
	 * 送礼物
	 */
	public static REQUEST_QQ_SEND_GIFT = "qq.send.gift";
	/**
	 * 消耗物品
	 */
	public static COST_GOODS = "cost.goods";
	/**
	 * 请求玩家礼物墙等信息
	 */
	public static REQUEST_ACCOUNT_INFO = "request.my.accountInfo.details";
	/**
	 * 添加好友
	 */
	public static ADD_FRIEND = "request.optFriend";

}
