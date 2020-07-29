import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { EnumUIOpenTween, EnumUICloseTween } from "../../../base/script/frame/ui/UIEnum";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { TopicController } from "../controller/TopicController";
import { TopicTag } from "./TopicTag";
import { TopicItem } from "./TopicItem";
import { SS } from "../../../base/script/global/SS";
import { EventCommond } from "../../other/EventCommond";
import { EntryController } from "../../entry/controller/EntryController";




export class UITopic extends UIBase {
    public PrefabName: string = 'P_UITopic';
    public OpenTween = EnumUIOpenTween.PullUp;
    public CloseTween = EnumUICloseTween.PullDown;

    private _btnMask: cc.Button = null; // 点击周围空白处消失
    private _tagsLayout: cc.Layout = null;  // 可以滑动的tag
    private _gridLayout: cc.Layout = null;  // 列表

    onLoad() {
        this.initRoot();
        this.initEvent();
    }

    start() {
        this.refreshPanelPosition();
        this.checkTag();
        this.refreshTag();
        this.refreshGrid();
    }

    onDestroy() {
        this.removeEvent();
    }

    private initEvent() {
        SS.EventCenter.on(EventCommond.UITopicTagChange, this.changeTag, this);
        SS.EventCenter.on(EventCommond.UITopic, this.refreshTopic, this);
    }

    private removeEvent() {
        SS.EventCenter.off(EventCommond.UITopic, this.refreshTopic, this);
        SS.EventCenter.off(EventCommond.UITopicTagChange, this.changeTag, this);
    }

    private initRoot() {
        this._btnMask = cc.find('Mask', this.node).getComponent(cc.Button);
        this._tagsLayout = cc.find('Container/Tags/View/Content', this.node).getComponent(cc.Layout);
        this._gridLayout = cc.find('Container/Grid/View/Content', this.node).getComponent(cc.Layout);

        UIEventCenter.ButtonEvent(this._btnMask, () => this.onCloseBtn());
    }

    private checkTag() {
        if (TopicController.SelectedTag == '') {
            // for (let tag in TopicController.AllTopics) {
            //     if (TopicController.AllTopics.hasOwnProperty(tag)) {
            //         TopicController.SelectedTag = tag;
            //         break;
            //     }
            // }   
            if(TopicController.AllTopics.topics.length>0)
            {
                TopicController.SelectedTag = TopicController.AllTopics.topics[0].topic_category_name; 
            }                       
        }
    }

    private changeTag() {
        this.refreshTag();
        this.refreshGrid();
    }

    private refreshTag() {
        this._tagsLayout.node.children[0].active = false;

        let i = 1;      
        for(var j=0;j<TopicController.AllTopics.topics.length;j++)
        {
            let tag= TopicController.AllTopics.topics[j].topic_category_name;
            let tagChild: cc.Node = null;
            if (i < this._tagsLayout.node.childrenCount) {
                tagChild = this._tagsLayout.node.children[i];
            } else {
                tagChild = cc.instantiate(this._tagsLayout.node.children[0]);
                tagChild.parent = this._tagsLayout.node;

                let script = tagChild.addComponent(TopicTag);
                script.Init();
            }

            tagChild.active = true;

            let script = tagChild.getComponent(TopicTag);
            script.Refresh(tag);

            i++;            
        }
        while (i < this._tagsLayout.node.childrenCount) this._tagsLayout.node.children[i++].active = false;
    }

    private refreshGrid() {
        let topics: any[]=[];
        for (let i = 0; i < TopicController.AllTopics.topics.length; i++) {
            if(TopicController.AllTopics.topics[i].topic_category_name==TopicController.SelectedTag)
            {
                topics=TopicController.AllTopics.topics[i].topics;
            }
        }
        // let topics: string[] = TopicController.AllTopics[TopicController.SelectedTag];
        if (!topics) return; // 以防万一

        this._gridLayout.node.children[0].active = false;

        for (let i = 0, l = topics.length; i < l; i++) {
            let child: cc.Node = null;
            if (i + 1 < this._gridLayout.node.childrenCount) {
                child = this._gridLayout.node.children[i + 1];
            } else {
                child = cc.instantiate(this._gridLayout.node.children[0]);
                child.parent = this._gridLayout.node;

                let script = child.addComponent(TopicItem);
                script.Init();
            }

            child.active = true;

            let script = child.getComponent(TopicItem);
            script.Refresh(Number(topics[i].id),topics[i].name, i);
        }

        let i = topics.length + 1;
        while (i < this._gridLayout.node.childrenCount) this._gridLayout.node.children[i++].active = false;
    }

    private refreshTopic() {
        for (var i = 0; i < this._gridLayout.node.childrenCount; i++) {
            let child = this._gridLayout.node.children[i];
            if (!child.active) continue;
            child.getComponent(TopicItem).RefreshSelected();
        }
    }

    private onCloseBtn() {
        UIManager.CloseUI(UITopic);
    }

    private refreshPanelPosition() {
        //iphoneX的ui适应
        let bottomWidget = cc.find("Container", this.node).getComponent(cc.Widget);
        EntryController.IphoneXUIFit([bottomWidget], 20);
    }
}
