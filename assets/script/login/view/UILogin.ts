import { UIBase } from "../../../base/script/frame/ui/UIBase";
import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { LoginController } from "../controller/LoginController";
import { RoomController } from "../../room/controller/RoomController";
import { CreateRoomController } from "../../common/controller/createRoom/CreateRoomController";
import { EntryController } from "../../entry/controller/EntryController";
import { TopicController } from "../../topic/controller/TopicController";


export class UILogin extends UIBase {

    public PrefabName = 'P_UILogin'
    private _btns: cc.Node;
    private _grid: cc.Node;
    private _btnLoign: cc.Button;

    onLoad() {
        this.initRoot();
        this.initEvent();
    }

    private xiyouDebugInfo = [
        {
            id: 30001,
            avatarUrl: "https://imgsa.baidu.com/forum/w%3D580/sign=f51cb67563d0f703e6b295d438fa5148/c19bd109b3de9c82ae5719ed6d81800a18d843e1.jpg",
            city: "济南",
            country: "中国",
            language: "中文",
            nickName: "宋江",
            province: "山东",
            gender: 1
        },
        {
            id: 30002,
            avatarUrl: "https://imgsa.baidu.com/forum/w%3D580/sign=53f7590695eef01f4d1418cdd0ff99e0/d5db367adab44aedc90b5e86b21c8701a08bfb4b.jpg",
            city: "武汉",
            country: "中国",
            language: "",
            nickName: "卢俊义",
            province: "湖北",
            gender: 2
        },
        {
            id: 30003,
            avatarUrl: "https://imgsa.baidu.com/forum/w%3D580/sign=6462ee959e3df8dca63d8f99fd1072bf/1c8920a4462309f784ff4d70730e0cf3d6cad607.jpg",
            city: "深圳",
            country: "中国",
            language: "",
            nickName: "吴用",
            province: "广东",
            gender: 1
        },
        {
            id: 30004,
            avatarUrl: "https://imgsa.baidu.com/forum/w%3D580/sign=f0696e5c7aec54e741ec1a1689399bfd/a4f5afc379310a55624f3d96b64543a9832610a8.jpg",
            city: "石家庄",
            country: "中国",
            language: "",
            nickName: "公孙胜",
            province: "河北",
            gender: 2
        },
        {
            id: 30005,
            avatarUrl: "https://imgsa.baidu.com/forum/w%3D580/sign=e180daa1d6ca7bcb7d7bc7278e086b3f/820ba786c9177f3ef4871f6f71cf3bc79e3d5660.jpg",
            city: "青岛",
            country: "中国",
            language: "",
            nickName: "关胜",
            province: "山东",
            gender: 1
        },
        {
            id: 30006,
            avatarUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590646244328&di=998ef2d29c9bc8e709cffd8a4467c4a5&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F0dd7912397dda1441ca1e9f3b9b7d0a20df486c3.jpg",
            city: "长沙",
            country: "中国",
            language: "",
            nickName: "林冲",
            province: "湖南",
            gender: 2
        },
        {
            id: 30007,
            avatarUrl: "https://imgsa.baidu.com/forum/w%3D580/sign=328360bc08d162d985ee621421dea950/37aba6efce1b9d16cd71b419f1deb48f8d546484.jpg",
            city: "镇江",
            country: "中国",
            language: "",
            nickName: "秦明",
            province: "江苏",
            gender: 1
        },
        {
            id: 30008,
            avatarUrl: "https://imgsa.baidu.com/forum/w%3D580/sign=66ba521c0b23dd542173a760e108b3df/787fb21bb051f8192bb12d32d8b44aed2f73e79b.jpg",
            city: "成都",
            country: "中国",
            language: "",
            nickName: "呼延灼",
            province: "四川",
            gender: 1
        }
    ]

    private initRoot() {
        this._btns = cc.find("LoginBtns", this.node)
        this._btns.active = false;
        this._btnLoign = cc.find("LoginBtns/BtnLogin", this.node).getComponent(cc.Button);
        this._grid = cc.find("Grid", this.node)
        this._grid.active = true;
        let btnItem = cc.find("Button", this.node)
        btnItem.active = false;
        for (let index = 0; index < this.xiyouDebugInfo.length; index++) {
            const item = this.xiyouDebugInfo[index];
            let tempNode = cc.instantiate(btnItem)
            tempNode.active = true;
            tempNode.setParent(this._grid)
            let label = cc.find("Background/Label", tempNode).getComponent(cc.Label)
            label.string = item.nickName.toString();
            let btn = tempNode.getComponent(cc.Button);
            UIEventCenter.ButtonEvent(btn, () => {
                LoginController.DebugXiYouInfo = item;
                this.OnLogin();
            })
        }
    }

    private initEvent() {
        UIEventCenter.ButtonEvent(this._btnLoign, () => { this.onBtnLoginClick() })
    }

    public async onBtnLoginWithXiYouId(item: any) {
        LoginController.DebugXiYouInfo = item;
        this.OnLogin();
    }

    private onBtnLoginClick() {
        Clog.Green(ClogKey.UI, "onBtnLoginClick");
        //测试环境下，使用西游的测试账号，走xiyou的测试登录，这里需要选择xiyou给的测试号
        if (CC_DEV) {
            this._btns.active = false;
            this._grid.active = true;
            return;
        }
        this.OnLogin();
    }

    private async OnLogin() {
        await LoginController.Login();
        //web测试环境中，非宋江的其它账号，直接加入房间
        if (LoginController.DebugXiYouInfo.nickName == "宋江") {
            await CreateRoomController.CreateRoom("替天行道", "friend");
        }
        else {
            RoomController.OnJoinRoomId = 193181931;
        }
        RoomController.OnJoinPassword=""
        await RoomController.JoinRoom();
        await EntryController.GetTopicConfig();            //获取话题卡配置,要进入房间后，需要rid
        TopicController.EntryTopic();           //刚进入房间，同步一次话题卡
    }


}