import { UIUtil } from "../../../base/script/frame/ui/UIUtil";
import { XiyouGiftWallItemData } from "../../xiyou/model/XiyouUserInfoData";


/**
 * 个人详细信息面板中礼物墙的Item
 */
export class GiftWallItem extends cc.Component {

    private data: XiyouGiftWallItemData
    private _icon: cc.Sprite
    private _numLabel: cc.Label;

    private _nameLabel: cc.Label;
    public Init(data: XiyouGiftWallItemData) {
        this.data = data;
        this.node.active = true;
        this.initRoot();
    }

    //初始化节点
    private initRoot() {
        this._icon = cc.find("Gift/Icon", this.node).getComponent(cc.Sprite);
        this._numLabel = cc.find("Number", this.node).getComponent(cc.Label);
        this._nameLabel = cc.find("Name", this.node).getComponent(cc.Label);

    }

    public Refresh() {
        this.refreshIcon();
        this.refreshNum();
        this.refreshName();
    }


    //刷新Icon
    private refreshIcon() {
        UIUtil.ChangeSprite("gift_01_" + this.data.Id, this._icon);
    }

    //刷新名称
    private refreshNum() {
        this._numLabel.string = 'x' + this.data.Num;

    }

    private refreshName() {
        this._nameLabel.string = this.data.Name;
    }

}