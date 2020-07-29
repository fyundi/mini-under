import { TopicController } from "../controller/TopicController";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { ResUtil } from "../../../base/script/frame/res/ResUtil";




export class TopicItem extends cc.Component {
    private _checkmark: cc.Node = null;
    private _contentLabel: cc.Label = null;
    private _itemBg : cc.Sprite = null; 

    private topic: string = '';
    private topicId:number;

    public Init() {
        this._checkmark = cc.find('Checkmark', this.node);
        this._contentLabel = cc.find('Label', this.node).getComponent(cc.Label);
        this._itemBg = this.node.getComponent(cc.Sprite);

        UIEventCenter.ButtonEvent(this.node.getComponent(cc.Button), () => this.onClickItem());
    }

    public Refresh(topicId:number,topic: string, index : number) {
        this.topic = topic;
        this.topicId=topicId;
        this._contentLabel.string = '' + topic;
        this._checkmark.active = !!TopicController.PendingTopicIds.find(item => item == topicId);

        ResUtil.ChangeSprite(`T_Topic_Item_${index % 10}`, this._itemBg);
    }

    public RefreshSelected() {
        this._checkmark.active = !!TopicController.PendingTopicIds.find(item => item == this.topicId);
    }

    private onClickItem() {
        let selectedList = [];
        //如果勾选了取消勾选
        if (TopicController.PendingTopicIds.find(item => item == this.topicId)) {
            selectedList.push(...TopicController.PendingTopicIds.filter(item => item != this.topicId));
        }
        //如果没勾选就勾上
        else {
            selectedList.push(...TopicController.PendingTopicIds, this.topicId);
        }

        TopicController.SelectTopic(selectedList);
    }

}