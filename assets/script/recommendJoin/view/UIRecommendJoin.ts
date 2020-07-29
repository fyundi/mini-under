import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { RecommendJoinController } from "../controller/RecommendJoinController";
import { RecommendJoinItem } from "./RecommendJoinItem";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { XiYouController } from "../../xiyou/controller/XiYouController";

export class UIRecommendJoin extends UIBase {

    public PrefabName = "P_UIRecommendJoin"

    private _btnReturn: cc.Button;
    private _roomItem: cc.Node;
    private _grid: cc.Node;
    private allRecomendRoomItem: Array<RecommendJoinItem>

    onLoad() {
        this.initRoot();
        this.initEvent();
    }

    start() {
        this.refreshAll()
    }

    private initRoot() {
        this._btnReturn = cc.find("BtnReturn", this.node).getComponent(cc.Button);
        this._roomItem = cc.find("RoomItem", this.node)
        this._roomItem.active = false;
        this._grid = cc.find("ScrollView/view/content", this.node)
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnReturn, () => { this.OnBtnRetrunClick() })
    }

    private async refreshAll() {
        await RecommendJoinController.GetRecommend()
        this.allRecomendRoomItem = new Array<RecommendJoinItem>()
        for (let index = 0; index < RecommendJoinController.AllRecommendRoom.length; index++) {
            const data = RecommendJoinController.AllRecommendRoom[index];
            let node = cc.instantiate(this._roomItem)
            node.setParent(this._grid)
            node.active = true;
            let item = node.addComponent(RecommendJoinItem)
            item.Init(data);
            this.allRecomendRoomItem.push(item)
        }
    }

    private OnBtnRetrunClick() {
        Clog.Trace(ClogKey.UI, "OnBtnRetrunClick")
        XiYouController.JumpToXiyou();
        UIManager.CloseUI(UIRecommendJoin)
    }
}