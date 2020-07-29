/**
 *
 * @author zjw_vinnie
 * @time 20200411
 * 
 */
export interface BaseSDK {

	/**
	 * 是否已经初始化
	 */
	isInit(): boolean;
	/**
	 * 初始化
	 */
	initConfig(data: any): void;
	/**
	 * 重置参数
	 */
	resetAllParam(): void;
	/**
	 * 获取websocket地址
	 */
	getSocketUrl(): string;
	/**
 * 初始化websocket地址
 * 
 */
	initSocketUrl(isTest: boolean): void
	/**
	 * 发送心跳包
	 */
	sendHeartBeat(): void;
	/**
	 * 登录
	 */
	login(data1: any, data2: any): void;
	/**
	 * 发送本玩家数据
	 */
	sendPlayerInfo(defaultData: any, data: any): void;
	/**
	 * 获取礼物列表
	 */
	getGiftList(): void;

	/**
	 * 消耗物品
	 */
	costGoods(type: string, productId: string, num: number, price: number, toArrs: any, roomId: string, orderNo: string, cbURL: string): void;
	/**
	 * 玩家礼物墙等详请
	 */
	getAccountInfo(id: number): void;
	/**
	 * 添加好友，不用管flag
	 */
	addFriend(id: number, flag: number): void;
	/**
	 * 封装特殊msg
	 */
	baseSendMsg(idx: string, data: any): void;
	/**
	 * 网络发送
	 */
	sendMsg(interfaStr: string, data: any): void;
}