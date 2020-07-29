import { SS } from "../../../base/script/global/SS";
import { EventCommond } from "../../other/EventCommond";
import { TopicController } from "../controller/TopicController";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { RoomController } from "../../room/controller/RoomController";
import { EnumPurview } from "../../other/EnumCenter";
import { ActionSheetController } from "../../actionSheet/controller/ActionSheetController";
import Clog from "../../../base/script/frame/clog/Clog";


export class RoomTopic extends cc.Component {

    private _currentTopic: cc.Label = null; // 当前话题
    private _pendingLabel: cc.Label = null; // 剩余话题数量
    private _btnClose: cc.Button = null;
    private _btnNext: cc.Button = null;

    onLoad() {
        this.initRoot();
        this.initEvent();
    }

    static() {
        this.onRefreshTopic();
    }

    onDestroy() {
        this.removeEvent();
    }

    private initRoot() {
        this._currentTopic = cc.find('Content/Current', this.node).getComponent(cc.Label);
        this._pendingLabel = cc.find('Content/Pending', this.node).getComponent(cc.Label);
        this._btnClose = cc.find('Content/CloseBtn', this.node).getComponent(cc.Button);
        this._btnNext = cc.find('Content/NextBtn', this.node).getComponent(cc.Button);
    }

    private initEvent() {      
        UIEventCenter.ButtonEvent(this._btnClose, () => this.onClickClose());
        UIEventCenter.ButtonEvent(this._btnNext, () => this.onClickNext());
        SS.EventCenter.on(EventCommond.UITopic, this.onRefreshTopic, this);
    }

    private removeEvent() {
        SS.EventCenter.off(EventCommond.UITopic, this.onRefreshTopic, this);
    }

    private onRefreshTopic() {      
        let isCreatorOrAdmin = RoomController.Purview == EnumPurview.Createor;
        this._btnClose.node.active = isCreatorOrAdmin;

        this._btnNext.node.active = isCreatorOrAdmin && TopicController.PendingTopicIds.length > 1;

        this._currentTopic.node.y = isCreatorOrAdmin ? -25 : 0;
        let str= TopicController.PendingTopicIds.length > 0 ? TopicController.getTopicByID(TopicController.PendingTopicIds[0]) : '暂无话题'; 
        if(str.length>15)
        {
            this._currentTopic.horizontalAlign=cc.Label.HorizontalAlign.LEFT;
        }
        else
        {
            this._currentTopic.horizontalAlign=cc.Label.HorizontalAlign.CENTER;
        }
        this._currentTopic.string = str;

        this._pendingLabel.node.active = isCreatorOrAdmin;
        this._pendingLabel.string = TopicController.PendingTopicIds.length > 1 ? `${TopicController.PendingTopicIds.length - 1}个待聊` : '无待聊';
    }

    private onClickClose() {
        ActionSheetController.SetCloseTopic();
    }

    private onClickNext() {
        TopicController.NextTopic();
    }

}