
import { qq } from "../../base/script/global/SS";
import { UIBase } from "../../base/script/frame/ui/UIBase";
import { UIManager } from "../../base/script/frame/ui/UIManager";
import { SyncPromise } from "../../base/script/util/SyncPromise";
import { UIEventCenter } from "../../base/script/util/UIEventCenter";
import { PlatformApi } from "../../base/script/api/PlatformApi";
import { EnumUIOpenTween, EnumUICloseTween, EnumUIHierarchy } from "../../base/script/frame/ui/UIEnum";
import { XiYouController } from "../xiyou/controller/XiYouController";
import { SystemInfoManager } from "../../base/script/global/SystemInfoManager";

/**
 * qq授权界面
 */
export class UIAuthorize extends UIBase {
    public static Instance: UIAuthorize;
    public HierarchyType = EnumUIHierarchy.NetDlg
    public PrefabName = 'P_UIAuthorize';
    public OpenTween = EnumUIOpenTween.NormalOpen;
    public CloseTween = EnumUICloseTween.NormalClose;

    private _authorizePlaceHolder: cc.Node = null; // qq授权需要用它平台自己button
    private _cancelBt: cc.Button = null; // 不授权
    private _cancelLabel: cc.Label = null; // 不授权的文字
    private _qqAuthorizeBt: any = null;  // qq必须要用它生成的button

    private _donePromise: SyncPromise = new SyncPromise();

    onLoad(): void {
        UIAuthorize.Instance = this;
        this._authorizePlaceHolder = cc.find("Bg/Layout/SureBt", this.node);
        this._cancelLabel = cc.find("Bg/Layout/CancelBt/Background/Label", this.node).getComponent(cc.Label);
        this._cancelBt = cc.find("Bg/Layout/CancelBt", this.node).getComponent(cc.Button);
    }

    start(): void {
        UIEventCenter.ButtonEvent(this._cancelBt, () => { this.onCloseClick() })
        let sysInfo = SystemInfoManager.CurSystemInfo
        let width = sysInfo.screenWidth / cc.winSize.width * this._authorizePlaceHolder.width;
        let height = sysInfo.screenHeight / cc.winSize.height * this._authorizePlaceHolder.height;
        let pos = this._authorizePlaceHolder.convertToWorldSpace(cc.v2(0, 0)); // 左下角
        pos = cc.v2(sysInfo.screenWidth / cc.winSize.width * pos.x, sysInfo.screenHeight / cc.winSize.height * (cc.winSize.height - pos.y));

        let thiz = this;
        this._qqAuthorizeBt = qq.createUserInfoButton({
            type: 'text',
            text: '同意',
            style: {
                left: pos.x,
                top: pos.y - height,
                width: width,
                height: height,
                // left: 10,
                // top: 76,
                // width: 200,
                // height: 40,

                lineHeight: height,
                backgroundColor: '#4FE4FF',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: sysInfo.screenWidth / cc.winSize.width * thiz._cancelLabel.fontSize,
                borderRadius: height / 2,
            },
            withCredentials: false,
        });
        this._qqAuthorizeBt.onTap((res) => {
            this.onClose();
        });
    }

    private onClose() {
        this._qqAuthorizeBt.destroy();
        this._donePromise.resolve();
        UIManager.CloseUI(UIAuthorize);
    }

    private onCloseClick() {
        // qq.exitMiniProgram({});
        XiYouController.JumpToXiyou();
    }

    public get DonePromise(): Promise<any> {
        return this._donePromise.promise;
    }

}