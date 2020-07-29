
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { EntryController } from "../controller/EntryController";
import { UILoading } from "../../common/view/UILoading";


const { ccclass } = cc._decorator;
@ccclass
export class Entry extends cc.Component {
    onLoad() {
        (window as any).CC_ENGINE_VERSION = cc.ENGINE_VERSION;
        cc.game.setFrameRate(30)                //初始化帧率
        cc.debug.setDisplayStats(false);        //浏览器左下角是否显示FPS
        cc.game.addPersistRootNode(this.node);  //设为驻留节点
        this.InitLoading();
        this.InitUIManager();
        this.InitGameEvent();
        EntryController.Init();
    }

    //初始化UIManger
    private InitUIManager() {
        let uiRoot = cc.find("UIManager", this.node)
        UIManager.Init(uiRoot);
    }

    //初始化UIloading
    private InitLoading() {
        cc.find("UIManager/UILoading", this.node).addComponent(UILoading).Init()
    }

    private InitGameEvent() {
        cc.game.on(cc.game.EVENT_HIDE, () => { this.OnGameHide(); });
        cc.game.on(cc.game.EVENT_SHOW, () => { this.OnGameShow(); });
    }

    //从游戏返回后台
    private OnGameHide() {

    }

    //从后台返回游戏
    private OnGameShow() {

    }
}

