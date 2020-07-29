import { EnumUIHierarchy } from "../../../base/script/frame/ui/UIEnum";
import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { UIManager } from "../../../base/script/frame/ui/UIManager";



export class UIToast extends UIBase {

    public static DURATION_SHORT = 2.5; //s
    public static DURATION_LONG = 5;

    /**
     * 提供打开该界面的API静态方法,方便直接调用
     * @param content 文字内容
     * @param duration 秒
     */
    public static async Show(content: string = '', duration: number = UIToast.DURATION_SHORT) {
        let toast = await UIManager.OpenUI(UIToast) as UIToast;
        toast.OnOpen(content, duration);
    }

    public PrefabName: string = "P_UIToast"
    public HierarchyType: EnumUIHierarchy = EnumUIHierarchy.Toast;

    private _content: cc.Label;

    onLoad() {
        this._content = cc.find("bg/Label", this.node).getComponent(cc.Label);
    }

    private OnOpen(content: string, duration: number) {
        this._content.string = content;

        this.scheduleOnce(() => {
            UIManager.CloseUI(UIToast);
        }, duration);
    }

}