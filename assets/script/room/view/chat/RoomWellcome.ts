import { RoomStyle } from "../../../other/RoomStyle";
import { UIEventCenter } from "../../../../base/script/util/UIEventCenter";
import { UserDetailController } from "../../../userDetail/controller/UserDetailController";
import { UIManager } from "../../../../base/script/frame/ui/UIManager";
import { UIUserDetail } from "../../../userDetail/view/UIUserDetail";
import { Session } from "../../../login/model/SessionData";

/*
 * @Description: 
 * @Author: luo.fei
 * @Date: 2020-04-27 15:28:25
 */
export class RoomWellcome extends cc.Component {


    private _lvIcon: cc.Node;         //玩家等级图片
    private _lvIconBg: cc.Sprite;         //玩家等级图片
    private _lvIconLabel: cc.Label;       //玩家等级
    private _label: cc.Label;           //文字
    private _btn: cc.Button;

    private initRoot(): void {
        this._lvIcon = cc.find("LvIcon", this.node);
        this._lvIconBg = cc.find("LvIcon/Bg", this.node).getComponent(cc.Sprite);
        this._lvIconLabel = cc.find("LvIcon/Label", this.node).getComponent(cc.Label);
        this._label = cc.find("Label", this.node).getComponent(cc.Label);
        this._btn = this.node.getComponent(cc.Button);
    }

    /**
     * 点击玩家名字查看详细信息
     * @param uid 
     */
    private eventLookOtherDetail(uid: number) {
        if (uid == Session.BanBan.UId) {
            return;
        }
        UIEventCenter.ButtonEvent(this._btn, async () => {
            UserDetailController.TargetUserId=uid
            await UIManager.OpenUI(UIUserDetail);
        })
    }

    /**
    * 系统欢迎
    * @param data 需要显示的内容数据
    */
    public Init(data: { id: number, name: string, vip: number }) {
        this.initRoot();
        this._label.string = data.name;
        this._label.node.color = RoomStyle.VipColor(data.vip);
        if (data.vip <= 0) {
            this._lvIcon.active = false;
        }
        else {
            this._lvIcon.active = true;
            this._lvIconBg.node.color = RoomStyle.VipColor(data.vip);
            this._lvIconLabel.string = '' + data.vip;
        }
        this.eventLookOtherDetail(data.id);
    }

}

