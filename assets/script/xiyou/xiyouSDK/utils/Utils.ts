/**
 * @author zjw_vinnie
 * @time 20170913
 */
export default class Utils {

    public static calcSumStr(_json) {

        if (_json == undefined || _json == null) {
            return "";
        }

        if (Array.isArray(_json)) {

            let sumStr = "";

            for (let key in _json) {
                sumStr = sumStr + this.calcSumStr(_json[key]);
            }

            return sumStr;

        } else if (_json instanceof Object) {

            let keys: Array<string> = [];
            for (let index in _json) {
                keys.push(index);
            }

            keys.sort(function (a: string, b: string): number {
                if (a > b) {
                    return 1;
                }
                else if (a < b) {
                    return -1;
                }
                return 0;
                // return a.localeCompare(b);
            })

            let sumStr = "";
            for (let _key in keys) {
                let key = keys[_key];

                if (_json[key] == undefined || _json[key] == null) {
                    continue;
                }

                sumStr = sumStr + key;
                sumStr = sumStr + this.calcSumStr(_json[key]);
            }

            return sumStr;

        } else {
            return _json;
        }

    }

    public static getTenStr(value: number): string {
        return (value >= 10 ? "" : "0") + value;
    }

    //时间戳转日期 ms
    public static formateTimestamp(timeStamp: number): string {
        var time = new Date(timeStamp);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + this.getTenStr(m) + '-' + this.getTenStr(d) + ' ' + this.getTenStr(h) + ':' + this.getTenStr(mm) + ':' + this.getTenStr(s);
    }
}