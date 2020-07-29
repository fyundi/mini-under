/**
 * @author zjw_vinnie
 * @time 2019_04_11
 */

export default class QQUtils {

    private static _ins: QQUtils;
    public static get Ins(): QQUtils {
        if (!this._ins) {
            this._ins = new QQUtils();
        }
        return this._ins;
    }

    /**
     * request请求
     * 
     */
    public doRequest(url, method, data, success, fail) {
        let brg = (<any>window).qq;
        if (!brg) {
            return false;
        }
        brg.request({
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: method,
            url: url,
            data: data,
            success: success,
            fail: fail
        });
        return true;
    }

}
