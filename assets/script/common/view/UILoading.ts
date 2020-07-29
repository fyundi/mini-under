import { EnumUIHierarchy } from "../../../base/script/frame/ui/UIEnum";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";



/**
 * 说明：loading不能动态加载，必需在entry场景中挂上去，因为是entry启动就要显示这个界面
 */
export class UILoading extends cc.Component {
    private static defaultTime = 0.6;       //默认时间
    private static _instance: UILoading;

    /**
     * 对外Api,用于打开该界面
     */
    public static Open(time?: number) {
        if (time) {
            UILoading.defaultTime = time
        }
        UILoading._instance.onOpen();
    }

    public static Close() {
        UILoading._instance.onClose();
    }

    private _rate: cc.Node
    private _rateIcon: cc.Sprite;
    private time: number;
    private timer: number;
    private isOver: boolean = false;        //结束标记
    private curRate: number;
    public Init() {
        UILoading._instance = this;
        this.node.zIndex = EnumUIHierarchy.Loading;
        this._rateIcon = cc.find("Rate/Process", this.node).getComponent(cc.Sprite);
        this._rate = cc.find("Rate", this.node)
    }

    private onOpen() {
        Clog.Trace(ClogKey.UI, "【打开Loading】")
        this.isOver = false;
        this.node.active = true;
        this._rate.active = true;
        this.time = UILoading.defaultTime;
        this.timer = 0;
    }

    update(dt: number) {
        if (this._rate.active == false) {
            return;
        }
        this.timer += dt

        if (this.isOver) {
            //结束标记开始后，马上走完
            this.curRate = this.timer / this.time;
            if (this.timer > this.time) {
                this.node.active = false;
                return;
            }
        }
        else {
            //当未结束时，前N%正常显示
            if (this.timer < this.time * 0.5) {
                this.curRate = this.timer / this.time;
            }
            //当未结束时，后N%永远无法到达终点，只能无限接近终点
            else {
                this.time += dt;
                this.curRate = this.timer / this.time;
            }
        }
        this._rateIcon.fillRange = -this.curRate;           //负号为顺时针显示
    }

    //结束时，保持原比例不变
    private onClose() {
        Clog.Trace(ClogKey.UI, "【关闭Loading】")
        if (this.isOver == true) {
            return;
        }
        this.time = UILoading.defaultTime;              //重设总时长为1秒
        this.timer = this.time * this.curRate;          //按原先百分比设置当前计时器
        this.isOver = true;                             //标记打开
    }
}