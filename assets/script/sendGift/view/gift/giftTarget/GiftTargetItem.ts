import { UIEventCenter } from "../../../../../base/script/util/UIEventCenter";
import { SS } from "../../../../../base/script/global/SS";
import { UIUtil } from "../../../../../base/script/frame/ui/UIUtil";
import { XiYouGiftManager } from "../../../../xiyou/controller/XiYouGiftManager";
import { GiftTarget } from "./GiftTarget";
import { RoomSeatData } from "../../../../room/model/RoomSeatData";

/**
 * 礼物赠送对象，与房间上的座位一致
 */
export class GiftTargetItem extends cc.Component {
   private data: RoomSeatData
   private _icon: cc.Sprite;
   private _name: cc.Label;
   private _onselect: cc.Node
   private _btnThis: cc.Button

   public Init(data: RoomSeatData) {
      this.data = data
      this.node.active = true;
      this.initRoot();
      this.initEvent();
      this.refreshUserIcon();
      this.refreshUserName();
      this.RefreshOnSelect();
   }

   private initRoot() {
      this._icon = cc.find("Mask/Icon", this.node).getComponent(cc.Sprite);
      this._name = cc.find("Name", this.node).getComponent(cc.Label);
      this._onselect = cc.find("OnSelect", this.node);
      this._btnThis = cc.find("BtnThis", this.node).getComponent(cc.Button);
   }

   private initEvent() {
      UIEventCenter.ButtonEvent(this._btnThis, () => this.onBtnThisClick());
   }

   public RefreshOnSelect() {
      this._onselect.active = XiYouGiftManager.CurSendGiftTarget.Has(this.data.UId);
      // 选中 黄色 没选中 白色
      this._name.node.color = this._onselect.active ? new cc.Color(250, 194, 0) : new cc.Color(255, 255, 255);
   }

   private refreshUserIcon() {
      let url = SS.ImageUrlProxy + this.data.Icon;
      UIUtil.LoadRemoteImage(url, this._icon);
   }

   private refreshUserName() {
      this._name.string = this.data.Name;
   }

   private onBtnThisClick() {
      if (XiYouGiftManager.CurSendGiftTarget.Has(this.data.UId)) {
         XiYouGiftManager.CurSendGiftTarget.Del(this.data.UId);
      }
      else {
         XiYouGiftManager.CurSendGiftTarget.Add(this.data.UId);
      }
      this.RefreshOnSelect();
      GiftTarget.Instance.RefreshAllSelectIcon();
   }
}