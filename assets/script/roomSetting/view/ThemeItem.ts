import { UIEventCenter } from "../../../base/script/util/UIEventCenter";
import { UIManager } from "../../../base/script/frame/ui/UIManager";
import { UITheme } from "./UITheme";
import { SS } from "../../../base/script/global/SS";
import { UIUtil } from "../../../base/script/frame/ui/UIUtil";
import { RoomSettingController } from "../controller/RoomSettingController";



export class ThemeItem extends cc.Component {

    /**
     * @param which 哪一张背景图
     */
    public Init(which: string) {
        let url = SS.ImageUrlProxy + 'static/background/theme_preview_' + which + '.png?v=1';
        UIUtil.LoadRemoteImage(url, this.node.getComponent(cc.Sprite));
        UIEventCenter.ButtonEvent(this.node.getComponent(cc.Button), () => this.onClick(which));
    }

    private onClick(which) {
        RoomSettingController.ChangeTheme(which);
        UIManager.CloseUI(UITheme);
    }

}