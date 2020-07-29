export default class HData {

	public static isInitSdk: boolean = false;
	public static isShowLog: boolean = false;
	public static hallSocketUrl: string = "wss://center-yqwsq-xiyou.xiyouchat.com:3000/getServer"//正式服的中心服

	//中心服请求地址
	public static requestAddr: string = "https://apigateway.52xiyou.com/api/center_server/game/version/";
	public static CLIENTVERSION: string = "1.0.0";

	public static appId: string = "";
	public static H5_VERSION: string = "303";

	public static gsToken: string = "";

	//对接者所提供的网络对象
	public static NetObj: any;
	//对接者所提供的发送对象的方法
	public static sendMsg: Function;

	// /**
	//  * 是否需要获取用户信息 若已经获取 则客户端不再主动获取  若未获取 则需要获取
	//  */
	public static isNeedAuthorize: boolean = false;


}
