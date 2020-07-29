
export default class NetCenterMgr {
	constructor() {
	}

	private m_msgListenerList: IMsgListener[] = [];
	private static _ins: NetCenterMgr;
	public static get Ins() {
		if (!this._ins) {
			this._ins = new NetCenterMgr();
		}
		return this._ins;
	}


	/**
 * 为给定的消息类型注册处理接口
 * @param type 消息类型
 * @param listener 回调方法
 * @param thisObject 
 * @param dispatchOnce 是否派发一次后移除 
 * 
 */
	public registerMsgListener(type: string, listener: Function, thisObject: Object, dispatchOnce?: boolean): boolean {
		let length = this.m_msgListenerList.length;
		for (let i = 0; i < length; i++) {
			let bin = this.m_msgListenerList[i];
			if (bin && bin.listener == listener && bin.thisObject == thisObject) {
				return false;
			}
		}

		let listenerBin: IMsgListener = {
			type: type, listener: listener, thisObject: thisObject, dispatchOnce: dispatchOnce
		};

		this.m_msgListenerList.push(listenerBin);
		return true;
	}


	/**
	 * 移除给定消息类型的处理函数
	 * @param type 消息类型
	 * @param listener 回调方法
	 * @param thisObject 
	 */
	public removeMsgListener(type: string, listener: Function, thisObject: Object): void {
		if (!this.m_msgListenerList || !this.m_msgListenerList.length) {
			return;
		}

		let length = this.m_msgListenerList.length;
		for (let i = 0; i < length; i++) {
			let bin = this.m_msgListenerList[i];
			if (bin && bin.type == type && bin.listener == listener && bin.thisObject == thisObject) {
				this.m_msgListenerList.splice(i, 1);
				return;
			}
		}
	}

	/**
	 * 移除给定消息类型的处理函数
	 * 
	 * @param type 消息类型
	 * 
	 */
	public removeMsgListeners(type: string = ""): void {
		if (!this.m_msgListenerList || !this.m_msgListenerList.length) {
			return;
		}

		let length = this.m_msgListenerList.length;
		let tempArray: IMsgListener[] = [];
		for (let i = 0; i < length; i++) {
			let bin = this.m_msgListenerList[i];
			if (bin && bin.type != type) {
				tempArray.push(bin);
			}
		}

		this.m_msgListenerList = tempArray;
	}

	/**
	 * 移除全部消息类型处理
	 * 
	 */
	public removeAllListeners(): void {
		for (let i in this.m_msgListenerList) {
			if (this.m_msgListenerList[i]) {
				this.m_msgListenerList[i] = null;
				delete this.m_msgListenerList[i];
			}
		}
	}


	/**
	 * 派发网络消息
	 * @param msgObj 网络消息
	 */
	public notifyListener(msgObj: any): void {

		if (!this.m_msgListenerList) {
			return;
		}

		let length = this.m_msgListenerList.length;
		if (length == 0) {
			return;
		}

		let msgCode: string = msgObj.header.msgCode;
		let onceList: IMsgListener[] = [];

		for (let i = 0; i < length; i++) {
			let bin = this.m_msgListenerList[i];
			if (bin && bin.type == msgCode) {
				bin.listener.call(bin.thisObject, msgObj.header.msgCode, msgObj.header.version, msgObj.body);
				if (bin.dispatchOnce) {
					onceList.push(bin);
				}
			}
		}

		while (onceList.length) {
			let bin = onceList.pop();
			this.removeMsgListener(bin.type, bin.listener, bin.thisObject);
		}
	}



}

/**
 * @private
 * 网络时间信息对象
 */
interface IMsgListener {

	type: string;
	/**
	 * @private
	 */
	listener: Function;
	/**
	 * @private
	 */
	thisObject: any;
	/**
	 * @private
	 */
	dispatchOnce: boolean;
};