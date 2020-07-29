import { UIUtil } from "../../../../base/script/frame/ui/UIUtil";
import { EmojiData } from "../../../emoji/model/EmojData";
import { RoomStyle } from "../../../other/RoomStyle";
import { UIEventCenter } from "../../../../base/script/util/UIEventCenter";
import { UserDetailController } from "../../../userDetail/controller/UserDetailController";
import { UIManager } from "../../../../base/script/frame/ui/UIManager";
import { UIUserDetail } from "../../../userDetail/view/UIUserDetail";
import { Session } from "../../../login/model/SessionData";
import { EmojiController } from "../../../emoji/controller/EmojiController";

/*
 * @Description: 公屏表情
 * @Author: luo.fei
 * @Date: 2020-04-27 15:28:25
 */
export class RoomEmoji extends cc.Component {


    private _lvIcon: cc.Node;         //玩家等级图片
    private _lvIconBg: cc.Sprite;         //玩家等级图片
    private _lvIconLabel: cc.Label;       //玩家等级
    private _label: cc.Label;           //文字
    private _emoji: cc.Node;            //表情图片container
    private _emojiAnim: cc.Animation;  // 表情图片
    private _btn: cc.Button;

    private initRoot(): void {
        this._lvIcon = cc.find("LvIcon", this.node);
        this._lvIconBg = cc.find("LvIcon/Bg", this.node).getComponent(cc.Sprite);
        this._lvIconLabel = cc.find("LvIcon/Label", this.node).getComponent(cc.Label);
        this._label = cc.find("Label", this.node).getComponent(cc.Label);
        this._emoji = cc.find("Emoji", this.node);
        this._emojiAnim = cc.find("Emoji/Icon", this.node).getComponent(cc.Animation);
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
     * 表情
     * @param data 需要显示的内容数据
     */
    public async Init(data: { id: number, name: string, emoji: EmojiData, vip: number }) {
        this.initRoot();
        if (data.vip <= 0) {
            this._lvIcon.active = false;
        } 
        else {
            this._lvIcon.active = true;
            this._lvIconBg.node.color = RoomStyle.VipColor(data.vip);
            this._lvIconLabel.string = '' + data.vip;
        }

        this._label.string = data.name + "：";
        // this._label.node.color = RoomStyle.VipColor(data.vip);

        this._emoji.active = true;

        let sprite = this._emojiAnim.getComponent(cc.Sprite);
        EmojiController.CreatePlaceClip(data.emoji,async (typeStr: string ,res: any) => {
            if(typeStr == "SpriteFrame") {
                sprite.spriteFrame = res;
                sprite.node.scale = 0.64;
            } else {
                sprite.spriteFrame = null;
                sprite.node.scale = data.emoji.ChatScale;
                while (this._emojiAnim.getClips().length > 0) this._emojiAnim.removeClip(this._emojiAnim.getClips()[0], true);
                if (res) {
                    this._emojiAnim.addClip(res, data.emoji.Id);
                    let animState = this._emojiAnim.play(data.emoji.Id);
                    animState.wrapMode = cc.WrapMode.Loop;
                }
            }
        })

        this.eventLookOtherDetail(data.id);

        // 参考地址 http://xs-image-proxy.oss-cn-hangzhou.aliyuncs.com/static/emote_new/smill_new.png
        // let url = SS.ImageUrlProxy + "static/emote_new/" + data.emoji.Key + ".png"
        // UIUtil.LoadRemoteImage(url, this._emoji)

    }

  

}

