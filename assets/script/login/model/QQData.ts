
/**
 * 【2020/05/05 21:52:38】【Api】:
 * {"user":
 *  {"uid":105000770,"name":"比较神奇","icon":"202004/27/5ea68adce5d6e8.63273125.jpg","role":0,"sex":1,"pay_num":0,"pay_money":0,"vip":0,"vip_new":0,"title":0,"birthday":"","job":0,"dateline":1587972831,"version":0,"longitude":0,"latitude":0,"city":"","city_code":0,"position":"","sign":"","server_time":1588686758,"star":0,"deleted":1,"tmp_icon":"202004/27/5ea68adce5d6e8.63273125.jpg","god_num":0,"friend":0,"cash_min":10000,"cash_rate":100000,"group.enabled":1,"game_login_token":"4dcawC3znfDE2Ogbrqx3SygD6cauHzfgZJ2ZJD2ut23ebWKvoZKejDWK4uNCJzxrIgIkE1o6qrUKTw","token":"9fb2vJNd0aPOYadmEp89mEpyXoRtPlFSTFA__2BhA6v__2F5ReZUX72Vssa9QYoGSQbU__2FUlwC4mHuMD8Z__2FHs__2Bdlv__2B0DWrabyhMvINegSFkXbX__2FWYX1EvRd","dtoken":""},
 * "is_reg":false,
 * "open_id":"0CB16DF48EDB4BE3917A5C2802BAF52B",
 * "session_key":"SVMzdk9qZWx6dURjYVp4MA=="}
 */
export class QQData {
    SessionKey: string = ''; // 实时语音能够用到

    constructor(data = null) {
        if (data == null) return;

        this.SessionKey = data.session_key;
    }
}