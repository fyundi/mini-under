import { SS } from "../../base/script/global/SS";
import md5 from "../xiyou/xiyouSDK/utils/md5";
import { SystemInfoManager } from "../../base/script/global/SystemInfoManager";
import { Session } from "../login/model/SessionData";
import Xhr, { XhrUrl } from "../../base/script/api/http/Xhr";
import Clog, { ClogKey } from "../../base/script/frame/clog/Clog";
import { LocalStorageUtil } from "../../base/script/frame/storage/LocalStorage";


//上报服务器
export class Report {

	private static get s4(): string {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}

	private static get guid(): string {
		return (this.platform + this.s4 + this.s4 + "-" + this.s4 + "-" + this.s4 + "-" + this.s4 + "-" + this.s4 + this.s4);
	}


	//模拟设备号
	private static _mac: string = null;
	public static get mac(): string {
		if (this._mac == null) {
			this._mac = LocalStorageUtil.GetString('mac', null)
			if (this._mac == null) {
				this._mac = this.guid;
				LocalStorageUtil.SetString('mac', this._mac)
			}
		}
		return this._mac;
	}


	private static get platform(): string {
		return SS.CurPlatformStr
	}

	//沟通后，说这个也是的模拟出来的sessionId，但一直不会变的
	private static _sid: string = null;
	public static get sid(): string {
		if (this._sid == null) {
			this._sid = LocalStorageUtil.GetString('sid', null)
			if (this._sid == null) {
				let sidStr = (this.ct + '555_' + this.guid).toString();
				this._sid = new md5().hex_md5(sidStr);
				LocalStorageUtil.SetString('sid', this._sid)
			}
		}
		return this._sid;
	}

	//每次发送完+1
	private static _son: number = null
	private static get son() {
		if (this._son == null) {
			this._son = LocalStorageUtil.GetNumber('son', 0)
			this._son++;
			LocalStorageUtil.SetNumber('son', this._son)
		}
		return this._son;
	}

	//当前时间
	private static get ct(): number {
		return Math.floor(new Date().getTime() / 1000);
	}

	//上报boot的url
	private static get reportBootUrl(): string {
		return 'https://log.iambanban.com/xs'
	}

	//上报version的url
	private static get reportVersionUrl(): string {
		return 'https://api.iambanban.com/cloud/uversion'
	}

	//上报boot
	public static async Boot(type: string, params?: any) {
		let info = SystemInfoManager.CurSystemInfo.system.split(' ');
		let systemVersion = info.length > 1 ? info[1] : '1.0.0'
		let url = new XhrUrl(this.reportBootUrl)
			.Query({ key: "ct", value: this.ct.toString() })
			.Query({ key: "sid", value: this.sid })
			.Query({ key: "son", value: this.son.toString() })
			.Query({ key: "mt", value: SystemInfoManager.CurSystemInfo.model })
			.Query({ key: "sys", value: SystemInfoManager.IsIOS ? "ios" : "android" })
			.Query({ key: "syv", value: systemVersion })
			.Query({ key: "mac", value: this.mac })
			.Query({ key: "ch", value: SS.CurPlatformStr + "_xiyou" })
			.Query({ key: "pname", value: `im.${SS.CurAppName}.minigame.${SS.CurPlatformStr}` })
			.Query({ key: "ver", value: SS.Version })
			.Query({ key: "jv", value: '1.0.0.0' })
			.Query({ key: "uid", value: Session.BanBan.UId ? Session.BanBan.UId.toString() : "" })
			.Query({ key: "tm", value: "0" })
			.Query({ key: "tp", value: type })
			.Query({ key: "net", value: "" })
			.Query({ key: "idfa", value: "" })
			.Url
		//https://log.iambanban.com/?package=im.9chat.minigame.qq&_ipv=0&_platform=qq&_model=&_timestamp=1595560183&_index=3&ct=1595560183&sid=29aa9312832407a5f4691c064038e67c&son=1&mt=iPhone_XR&sys=ios&syv=1.0.0&mac=qq0394900c-de8a-edc8-370a-b89d3bf8&ch=qq_xiyou&pname=im.9chat.minigame.qq&ver=1.0.1&jv=1.0.0.0&uid=105003288&tm=0&tp=login&net=&idfa=
		Clog.Trace(ClogKey.Net, "Report Boot url=" + url);

		//浏览器测试前提下不发送了
		if (CC_DEV) {
			return;
		}
		await Xhr.GetJson(url)
	}

	private static _localStorageVerionUrl: string = null
	private static get localStorageVerionUrl() {
		if (this._localStorageVerionUrl == null) {
			this._localStorageVerionUrl = LocalStorageUtil.GetString("reportVersion", null)
		}
		return this._localStorageVerionUrl;
	}
	private static set localStorageVerionUrl(value: any) {
		this._localStorageVerionUrl = value;
		LocalStorageUtil.SetString("reportVersion", value)
	}

	//上服用户手机信息
	public static async Version() {
		let info = SystemInfoManager.CurSystemInfo.system.split(' ');
		let systemVersion = info.length > 1 ? info[1] : '1.0.0'
		let url = new XhrUrl(this.reportVersionUrl)
			.Query({ key: "version", value: SS.Version })
			.Query({ key: "jversion", value: "2.0.0.0" })
			.Query({ key: "platform", value: SystemInfoManager.CurSystemInfo.platform })
			.Query({ key: "channel", value: SS.CurPlatformStr + "_xiyou" })
			.Query({ key: "mac", value: this.mac })
			.Query({ key: "idfa", value: SystemInfoManager.CurSystemInfo.model })
			.Query({ key: "syv", value: systemVersion })
			.Query({ key: "imei", value: "" })
			.Query({ key: "oaid", value: "" })
			.Query({ key: "pname", value: `im.${SS.CurAppName}.minigame.${SS.CurPlatformStr}` })
			.Query({ key: "simulator", value: SystemInfoManager.CurSystemInfo.platform == 'devtools' ? '1' : '0' })
			.Query({ key: "size", value: `${SystemInfoManager.CurSystemInfo.screenWidth}*${SystemInfoManager.CurSystemInfo.screenHeight}` })
			.Query({ key: "pixelRatio", value: `${SystemInfoManager.CurSystemInfo.pixelRatio || ''}` })
			.Query({ key: "root", value: "0" })
			.Url

		Clog.Trace(ClogKey.Net, "Report Version url=" + url);

		//浏览器测试前提下不发送了
		if (CC_DEV) {
			return;
		}

		//从localstorage取出来的url为空，则赋上新的地址
		if (this.localStorageVerionUrl == null) {
			this.localStorageVerionUrl = url
		}
		else {
			//如果地址不同空，则判断其与当前地址及所带query参数有无区别，无区别则不发送
			if (this.localStorageVerionUrl == url) {
				return;
			}
		}

		await Xhr.GetJson(url)
	}
}