import { RecommendRoomData } from "../model/RecommendRoomData";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { RoomController } from "../../room/controller/RoomController";
import { UIUtil } from "../../../base/script/frame/ui/UIUtil";
import { EnumSex } from "../../other/EnumCenter";
import { SS } from "../../../base/script/global/SS";
import { StringLimit } from "../../../base/script/util/StringUtil";
import { UILoading } from "../../common/view/UILoading";



export class RecommendJoinItem extends cc.Component {

    private data: RecommendRoomData

    private _icon: cc.Sprite;
    private _sex: cc.Sprite;
    private _tagBg: cc.Sprite;
    private _tagLabel: cc.Label;
    private _roomNameLabel: cc.Label;
    private _creatorNameLabel: cc.Label;
    private _btnJoin: cc.Button;

    public Init(data: RecommendRoomData) {
        this.data = data;
        this.initRoot();
        this.initEvent();
        this.refreshAll();
    }

    private initRoot() {
        this._icon = cc.find("IconMask/Icon", this.node).getComponent(cc.Sprite);
        this._sex = cc.find("Sex", this.node).getComponent(cc.Sprite);
        this._tagBg = cc.find("Layout/Tag/Bg", this.node).getComponent(cc.Sprite);
        this._tagLabel = cc.find("Layout/Tag/Label", this.node).getComponent(cc.Label);
        this._roomNameLabel = cc.find("Layout/RoomName", this.node).getComponent(cc.Label);
        this._creatorNameLabel = cc.find("CreatorName", this.node).getComponent(cc.Label);
        this._btnJoin = cc.find("BtnJoin", this.node).getComponent(cc.Button);
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnJoin, () => this.onBtnJoinClick())
    }

    private refreshAll() {
        this.refreshCreatorIocn();
        this.refreshCreatorName();
        this.refreshRoomName();
        this.refreshSex();
        this.refreshTag();
    }

    private refreshRoomName() {
        this._roomNameLabel.string = StringLimit(this.data.Name, 10);
    }

    private refreshSex() {
        switch (this.data.Sex) {
            case EnumSex.Unknow:
                this._sex.node.active = false;
                return;
            case EnumSex.Female:
                UIUtil.ChangeSprite("T_Com_Female", this._sex)
                return;
            case EnumSex.Male:
                UIUtil.ChangeSprite("T_Com_Male", this._sex)
                return;
        }
    }

    private refreshTag() {
        this._tagLabel.string = this.data.Type;
    }

    private refreshCreatorName() {
        this._creatorNameLabel.string = this.data.UserName;
    }

    private refreshCreatorIocn() {
        let url = SS.ImageUrlProxy + this.data.Icon;
        UIUtil.LoadRemoteImage(url, this._icon);
    }


    private async onBtnJoinClick() {
        Clog.Trace(ClogKey.UI, "onBtnJoinClick")
        RoomController.OnJoinRoomId = this.data.RoomId;
        RoomController.OnJoinPassword='';
        UILoading.Open()
        await RoomController.JoinRoom();
        UILoading.Close()
    }
}