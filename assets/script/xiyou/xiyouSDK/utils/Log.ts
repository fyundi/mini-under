/**
 * @author zjw_vinnie
 * @time 20170913
 */
import HData from '../data/HData';
import Utils from './Utils';
export default class Log {
    public static showWarn(...arg: any[]) {
        if (!HData.isShowLog) {
            return;
        }
        if (!arg) {
            arg = [];
        } else {
            arg.unshift(Utils.formateTimestamp(Date.now()))
        }
        console.warn.apply(console, arg);
    }

    public static showLog(...arg) {
        if (!HData.isShowLog) {
            return;
        }
        if (!arg) {
            arg = [];
        } else {
            arg.unshift(Utils.formateTimestamp(Date.now()))
        }
        console.log.apply(console, arg);
    }
}