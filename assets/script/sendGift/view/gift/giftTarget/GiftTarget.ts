import { RoomController } from "../../../../room/controller/RoomController";
import { Session } from "../../../../login/model/SessionData";
import { GiftTargetItem } from "./GiftTargetItem";
import { UIEventCenter } from "../../../../../base/script/util/UIEventCenter";
import { XiYouGiftManager } from "../../../../xiyou/controller/XiYouGiftManager";
import { RoomSeatData } from "../../../../room/model/RoomSeatData";
import { GiftTargetData } from "../../../model/GiftTargetData";




export class GiftTarget extends cc.Component {
    public static Instance:GiftTarget
    private _btnAllSelect: cc.Button;
    private _stateSelectOn: cc.Node;
    private _stateSelectOff: cc.Node;
    private _playerItem: cc.Node;
    private _playerRoot: cc.Node;
    private allGiftPlayerItem: Array<GiftTargetItem>

    //除自己外的其它玩家
    private get others():Array<RoomSeatData>{
        return RoomController.Seats.filter(item => item.HasPlayer && item.UId != Session.BanBan.UId)
    }

    private get isAllSelect(): boolean  //是否全送, false显示黄 true显示白
    {
        if(XiYouGiftManager.CurSendGiftTarget.UIdList.length==this.others.length){
            return true
        }
        return false
    }

    onLoad() {
        GiftTarget.Instance=this;
        this.initRoot();
        this.initEvent(); 
    }

    start(){
        this.initAllPlayers();
        this.RefreshAllSelectIcon();
    }

    private initRoot() {
        this._playerItem = cc.find("PlayerItem", this.node)
        this._playerItem.active = false;
        this._playerRoot = cc.find("ScrollView/view/content", this.node)
        this._btnAllSelect = cc.find("BtnAllSelect", this.node).getComponent(cc.Button);
        this._stateSelectOn = cc.find("BtnAllSelect/On", this.node);
        this._stateSelectOff = cc.find("BtnAllSelect/Off", this.node);
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnAllSelect, () => this.onBtnAllSelectClick())
    }

    //初始化礼物赠送目标（即房间的玩家）
    private initAllPlayers() {
        if (this.others.length <= 0) {
            this.node.active = false;
            return;
        }
        //显示其它玩家列表
        this.node.active = true;
        this.allGiftPlayerItem = new Array<GiftTargetItem>();
        for (let index = 0; index < this.others.length; index++) {
            const playerData = this.others[index];
            const node = cc.instantiate(this._playerItem);
            node.setParent(this._playerRoot);
            let item = node.addComponent(GiftTargetItem);
            item.Init(playerData);
            this.allGiftPlayerItem.push(item);
        }
    }

    private onBtnAllSelectClick() {
        if (this.isAllSelect) {
            XiYouGiftManager.CurSendGiftTarget = new GiftTargetData();
        }
        else {
            XiYouGiftManager.CurSendGiftTarget = new GiftTargetData();
            for (let index = 0; index < this.others.length; index++) {
                const element = this.others[index];
                XiYouGiftManager.CurSendGiftTarget.Add(element.UId)
            }
        }
        this.RefreshAllSelectIcon();
        this.allGiftPlayerItem.forEach(item=>item.RefreshOnSelect())
    }

    /**
     * 刷新送全场的Icon
     */
    public RefreshAllSelectIcon() {
        // 用户全选 按钮黄色底黑色字 未全选 按钮灰色底白色字
        this._stateSelectOff.active = !this.isAllSelect;
        this._stateSelectOn.active = this.isAllSelect;
    }
}