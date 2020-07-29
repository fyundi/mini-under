import { EnumUIHierarchy, EnumUIOpenTween, EnumUICloseTween } from "../../../base/script/frame/ui/UIEnum";
import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { UIManager } from "../../../base/script/frame/ui/UIManager";



export class UIWaiting extends UIBase {



   
    public static async Show(tips: string = '网络出现问题') {
        let toast = await UIManager.OpenUI(UIWaiting) as UIWaiting;
        toast.OnOpen(tips);
    }

    public PrefabName: string = "P_UIWaiting"
    public HierarchyType: EnumUIHierarchy = EnumUIHierarchy.Waiting;
    public OpenTween = EnumUIOpenTween.NormalOpen;
    public CloseTween = EnumUICloseTween.NormalClose;

    private _wire: cc.Node;
    private _content: cc.Label;

    onLoad() {
        this._wire = cc.find("Bg/Wire", this.node);
        this._content = cc.find("Label", this.node).getComponent(cc.Label);
    }

    private OnOpen(tips: string) {
        this._content.string = '';
        this._content.node.runAction(cc.repeatForever(cc.sequence(
            cc.callFunc(() => {
                this._content.string = tips + '·';
            }),
            cc.delayTime(0.8),
            cc.callFunc(() => {
                this._content.string = tips + '··';
            }),
            cc.delayTime(0.8),
            cc.callFunc(() => {
                this._content.string = tips + '···';
            }),
            cc.delayTime(0.8),
        )));

        this._wire.runAction(cc.repeatForever(cc.rotateBy(3, -360)));
    }

}