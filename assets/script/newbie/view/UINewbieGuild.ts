import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { SS } from "../../../base/script/global/SS";
import { EventCommond } from "../../other/EventCommond";
import { NewbieGuildConfigData } from "../model/NewbieGuildConfigData";
import { ResUtil } from "../../../base/script/frame/res/ResUtil";
import { NewbieGuildController } from "../control/NewbieGuildController";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { EnumUIHierarchy } from "../../../base/script/frame/ui/UIEnum";

export default class UINewbieGuild extends UIBase {

    public PrefabName = "P_UINewbieGuild";
    public HierarchyType = EnumUIHierarchy.Tip;

    private _maskNode: cc.Node;
    private _btnMask: cc.Button;
    private _tipText:cc.Label;
    private _guildTip: cc.Node;
    private _arrow: cc.Node;
    private _icon: cc.Node;

    private data: NewbieGuildConfigData;

    onLoad () {
        this.initRoot();
        this.initEvent();
    }

    onDestroy() {
        this.removeEvent();
    }

    private initRoot() {
        this._maskNode = cc.find("MaskNode",this.node);
        this._btnMask = cc.find("BtnMask",this.node).getComponent(cc.Button);
        this._tipText = cc.find("GuildTip/TipText",this.node).getComponent(cc.Label);
        this._guildTip = cc.find("GuildTip",this.node);
        this._icon = cc.find("GuildTip/Icon",this.node);
        this._arrow = cc.find("GuildTip/Arrow",this.node);
    }

    private initEvent() {
        SS.EventCenter.on(EventCommond.UINewbieGuildStep, this.refreshGuildView, this);
        UIEventCenter.ButtonEvent(this._btnMask,() => this.btnMaskClick());
    }

    private removeEvent() {
        SS.EventCenter.off(EventCommond.UINewbieGuildStep, this.refreshGuildView, this);
    }

    private btnMaskClick() {
        NewbieGuildController.GuildStepExecute();
    }

    private refreshGuildView(data: NewbieGuildConfigData) {
        if(!data) return;
        this.data = data;
        this._maskNode.setPosition(data.maskPos);
        this._guildTip.setPosition(data.guildTipPos);
        this._guildTip.setContentSize(data.guildTipSize);
        this._icon.setPosition(data.iconPos);
        this._arrow.setPosition(data.arrowPos);
        this._arrow.setScale(data.arrowScale);
        this._tipText.string = data.text;
        ResUtil.ChangeSprite(data.iconName, this._icon.getComponent(cc.Sprite));
        this.refreshPanelPosition();
    }

    public refreshPanelPosition() {
        if(!this.data) return;
        let offY: number = cc.winSize.height / 2 - 667;
        Clog.Trace(ClogKey.UI,"上方offY:" + NewbieGuildController.QQTopWidget + "<<<<<winSize.offy:" + offY);
        if(this.data.guildName == "flame") {
            this._maskNode.y += offY;
            this._guildTip.y += offY;
            if(NewbieGuildController.QQTopWidget)this._maskNode.y -= NewbieGuildController.QQTopWidget;
            if(NewbieGuildController.QQTopWidget)this._guildTip.y -= NewbieGuildController.QQTopWidget;
        }
        else {
            this._maskNode.y -= offY;
            this._guildTip.y -= offY;
            if(NewbieGuildController.ButtomWidget)this._maskNode.y += NewbieGuildController.ButtomWidget;
            if(NewbieGuildController.ButtomWidget)this._guildTip.y += NewbieGuildController.ButtomWidget;
        }
    }


}
