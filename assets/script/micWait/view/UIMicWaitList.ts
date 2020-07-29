import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { EnumUIOpenTween, EnumUICloseTween } from "../../../base/script/frame/ui/UIEnum";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { MicWaitController } from "../controller/MicWaitController";
import { BanBanData } from "../../login/model/BanBanData";
import { UIMicWaitItem } from "./UIMicWaitItem";
import { SS } from "../../../base/script/global/SS";
import { EventCommond } from "../../other/EventCommond";
import Clog from "../../../base/script/frame/clog/Clog";


export class UIMicWaitList extends UIBase {
    public PrefabName = "P_UIMicWaitList";
    public OpenTween = EnumUIOpenTween.NormalOpen;
    public CloseTween = EnumUICloseTween.NormalClose;

    private _btnMask: cc.Button;
    private _item: cc.Node;
    private _content: cc.Node;

    private allItem: Array<UIMicWaitItem> = new Array<UIMicWaitItem>();

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initRoot();    
        this.initEvent();
    }

    start() {
        this.refreshMicWaitList();
    }

    onDestroy() {
        this.removeEvent();
    }

    initRoot() {
        this._btnMask = cc.find("Mask", this.node).getComponent(cc.Button);
        this._item = cc.find("Bg/item", this.node);
        this._item.active = false;
        this._content = cc.find("Bg/Grid/view/content", this.node);
    }   

    initEvent() {
        UIEventCenter.ButtonEvent(this._btnMask, () => this.onBtnMaskClick());     
        SS.EventCenter.on(EventCommond.UIMicWait, this.onRefresh, this);    
    }

    removeEvent() {    
        SS.EventCenter.off(EventCommond.UIMicWait, this.onRefresh, this);        
    }

    onBtnMaskClick() {
        UIManager.CloseUI(UIMicWaitList);
        MicWaitController.micWaitListCheck();
    }

    async onRefresh() {
        await MicWaitController.micWaitListReq();
        this.refreshMicWaitList();
    }

    /**
     * 刷新排麦列表
     */
    refreshMicWaitList()
    {
        if(!this.node)return;
        let data = MicWaitController.JoinMicWaitList;
        if (data.length > 0) {
            this._content.active = true;
            this.allItem = new Array<UIMicWaitItem>();
            for (let index = 0; index < data.length; index++) {
                let userdata = data[index];               
                if(this._content.children[index])
                {
                   let element=this._content.children[index]; 
                   element.active = true;
                   let item = element.getComponent(UIMicWaitItem);
                   item.Init(userdata);
                   this.allItem.push(item);                               
                }
                else
                {
                    let element = cc.instantiate(this._item);
                    element.setParent(this._content);
                    element.active = true;
                    let item = element.addComponent(UIMicWaitItem);
                    item.Init(userdata);
                    this.allItem.push(item);
                }                               
            }

            //把多余的item隐藏
            if(this._content.childrenCount>data.length)
            {               
                for(let i=data.length;i<this._content.childrenCount;i++)
                {
                    this._content.children[i].active=false;
                }
            }
        }
        else {
            this._content.active = false;
            //没人了，直接关闭
            UIManager.CloseUI(UIMicWaitList);
            MicWaitController.micWaitListCheck();
        }
    }
    

    // update (dt) {}
}
