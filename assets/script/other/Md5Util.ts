import { SS } from "../../base/script/global/SS";
import Clog, { ClogKey } from "../../base/script/frame/clog/Clog";
import md5 from "../xiyou/xiyouSDK/utils/md5";


export class Md5Util extends cc.Component{

   	 /**
     * 将数据加密的方法
     * @param data 
     */
    public static GenSign(data: any) {
        let packageName = `im.${SS.CurAppName}.minigame.${SS.CurPlatformStr}`
        var temp = [];
        var keys = Object.keys(data);
        keys.sort();
        keys.forEach((key) => {
            if (data[key] != null) {
                temp.push(key + '=' + data[key]);
            }
        });
        let dataStr = temp.join("&")
        let secretStr = packageName + dataStr;
        Clog.Purple(ClogKey.Net, "[加密]" + secretStr);
        // return Md5.hex_md5(secretStr)  我也不知道为什么这个方案不行
        return new md5().hex_md5(secretStr);
    }

}