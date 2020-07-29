import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { TopicController } from "../controller/TopicController";
import { SS } from "../../../base/script/global/SS";
import { EventCommond } from "../../other/EventCommond";



export class TopicTag extends cc.Component {
    private _tagLabel: cc.Label = null;
    private _indicator: cc.Node = null;

    private tag: string = '';

    public Init() {
        this._tagLabel = this.node.getComponent(cc.Label);
        this._indicator = cc.find('Indicator', this.node);

        UIEventCenter.ButtonEvent(this.node.getComponent(cc.Button), () => this.onClickTag());
    }

    public Refresh(tag: string) {
        this.tag = tag;

        this._tagLabel.string = '' + tag;
        this._tagLabel.node.opacity = tag == TopicController.SelectedTag ? 255 : 178;
        this._indicator.active = tag == TopicController.SelectedTag;
    }

    private onClickTag() {
        if (TopicController.SelectedTag == this.tag) return;

        TopicController.SelectedTag = this.tag;
        SS.EventCenter.emit(EventCommond.UITopicTagChange);
    }

}