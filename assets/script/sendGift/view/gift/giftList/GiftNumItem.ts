// /*
//  * @Description: 
//  * @Author: luo.fei
//  * @Date: 2020-04-26 19:57:19
//  */

// import { UIEventCenter } from "../../../../../base/assets/script/util/UIEventCenter";
// import { GiftSend } from "../giftSend/GiftSend";
// import { SS } from "../../../../../base/assets/script/global/SS";
// import { EventCommond } from "../../../../other/EventCommond";
// import { XiYouGiftManager } from "../../../../manager/xiyou/XiYouGiftManager";

// export class GiftNumItem extends cc.Component {
//     private data: { Id: number, Num: number, Desc: string }
//     private _label: cc.Label;


//     public Init(data: { Id: number, Num: number, Desc: string }) {
//         this.data = data;
//         this.node.active = true;
//         this._label = cc.find("Label", this.node).getComponent(cc.Label)
//         this._label.string = this.data.Desc;
//         UIEventCenter.ButtonEvent(this.node.getComponent(cc.Button), () => { this.OnThisClick() })
//     }

//     private OnThisClick() {
//         XiYouGiftManager.CurSendGiftInfo.Num = this.data.Num;
//         SS.EventCenter.emit(EventCommond.OnSelectGiftNumChange)
//         GiftSend.Instance.CloseNumMenu();
//     }
// }