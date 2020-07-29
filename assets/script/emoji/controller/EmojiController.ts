import { EmojiData } from "../model/EmojData";
import { RoomSocketInput } from "../../common/controller/websocket/RoomSocketInput";
import { UIUtil } from "../../../base/script/frame/ui/UIUtil";
import { ResManager } from "../../../base/script/frame/res/ResManager";
import Clog from "../../../base/script/frame/clog/Clog";


export class EmojiController {

    //写死
    public static AllEmojis = [
        new EmojiData({ name: '哈哈大笑', key: 'smill_new', id: 'smill_new', data: [], duration: 1600, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '捂脸', key: 'wulian_new', id: 'wulian_new', data: [], duration: 2000, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '心碎', key: 'heart_new', id: 'heart_new', data: [], duration: 4000, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '色迷迷', key: 'mimi_new', id: 'mimi_new', data: [], duration: 1780, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '害羞', key: 'shy_new', id: 'shy_new', data: [], duration: 1790, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '飞吻', key: 'kiss_new', id: 'kiss_new', data: [], duration: 1580, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '委屈', key: 'grievance_new', id: 'grievance_new', data: [], duration: 1470, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '巨汗', key: 'sweat_new', id: 'sweat_new', data: [], duration: 2330, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '尴尬', key: 'awkward_new', id: 'awkward_new', data: [], duration: 1970, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '疑惑', key: 'doubt_new', id: 'doubt_new', data: [], duration: 4120, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '送花', key: 'flower_new', id: 'flower_new', data: [], duration: 1540, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '生气', key: 'angry_new', id: 'angry_new', data: [], duration: 1560, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '大哭', key: 'cry_new', id: 'cry_new', data: [], duration: 1470, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '跳舞', key: 'dance_new', id: 'dance_new', data: [], duration: 1440, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '再见', key: 'bye_new', id: 'bye_new', data: [], duration: 1680, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '左亲亲', key: 'kiss_left_new', id: 'kiss_left_new', data: [], duration: 1470, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '右亲亲', key: 'kiss_right_new', id: 'kiss_right_new', data: [], duration: 1470, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '惊讶', key: 'surprise_new', id: 'surprise_new', data: [], duration: 1820, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '呕吐', key: 'retch_new', id: 'retch_new', data: [], duration: 4000, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '晕倒', key: 'faint_new', id: 'faint_new', data: [], duration: 3960, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '要抱抱', key: 'pick_new', id: 'pick_new', data: [], duration: 1470, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '求勾搭', key: 'catch_new', id: 'catch_new', data: [], duration: 2170, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '求礼物', key: 'gift_new', id: 'gift_new', data: [], duration: 2120, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '亮灯', key: 'light_new', id: 'light_new', data: [], duration: 3960, subpackage: 'emo1', onlyInMic: false, chatScale: 0.8, seatScale: 1 }),
        new EmojiData({ name: '抽签', key: 'rand_new', id: 'rand_0_new', data: [0], duration: 2880, subpackage: 'emo2', onlyInMic: true, chatScale: 0.5, seatScale: 0.8 }),
        new EmojiData({ name: '抽签', key: 'rand_new', id: 'rand_1_new', data: [1], duration: 2880, subpackage: 'emo2', onlyInMic: true, chatScale: 0.5, seatScale: 0.8 }),
        new EmojiData({ name: '抽签', key: 'rand_new', id: 'rand_2_new', data: [2], duration: 2880, subpackage: 'emo2', onlyInMic: true, chatScale: 0.5, seatScale: 0.8 }),
        new EmojiData({ name: '抽签', key: 'rand_new', id: 'rand_3_new', data: [3], duration: 2880, subpackage: 'emo2', onlyInMic: true, chatScale: 0.5, seatScale: 0.8 }),
        new EmojiData({ name: '抽签', key: 'rand_new', id: 'rand_4_new', data: [4], duration: 2880, subpackage: 'emo2', onlyInMic: true, chatScale: 0.5, seatScale: 0.8 }),
        new EmojiData({ name: '抽签', key: 'rand_new', id: 'rand_5_new', data: [5], duration: 2880, subpackage: 'emo2', onlyInMic: true, chatScale: 0.5, seatScale: 0.8 }),
        new EmojiData({ name: '抽签', key: 'rand_new', id: 'rand_6_new', data: [6], duration: 2880, subpackage: 'emo2', onlyInMic: true, chatScale: 0.5, seatScale: 0.8 }),
        new EmojiData({ name: '抽签', key: 'rand_new', id: 'rand_7_new', data: [7], duration: 2880, subpackage: 'emo2', onlyInMic: true, chatScale: 0.5, seatScale: 0.8 }),
        new EmojiData({ name: '硬币', key: 'coin_new', id: 'coin_0_new', data: [0], duration: 3780, subpackage: 'emo2', onlyInMic: true, chatScale: 0.4, seatScale: 0.7 }),
        new EmojiData({ name: '硬币', key: 'coin_new', id: 'coin_1_new', data: [1], duration: 3780, subpackage: 'emo2', onlyInMic: true, chatScale: 0.4, seatScale: 0.7 }),
        new EmojiData({ name: '猜拳', key: 'stone_new', id: 'stone_0_new', data: [0], duration: 2350, subpackage: 'emo2', onlyInMic: true, chatScale: 0.5, seatScale: 0.8 }),
        new EmojiData({ name: '猜拳', key: 'stone_new', id: 'stone_1_new', data: [1], duration: 2350, subpackage: 'emo2', onlyInMic: true, chatScale: 0.5, seatScale: 0.8 }),
        new EmojiData({ name: '猜拳', key: 'stone_new', id: 'stone_2_new', data: [2], duration: 2350, subpackage: 'emo2', onlyInMic: true, chatScale: 0.5, seatScale: 0.8 }),
    ];

    private static _allEmojisUniqueKeys: EmojiData[] = null;

    private static _loadedEmojiMap: Map<string, Boolean> = new Map<string,boolean>();

    /**
     * 面板上的效果
     */
    public static get AllEmojisUniqueKeys() {
        if (EmojiController._allEmojisUniqueKeys) return EmojiController._allEmojisUniqueKeys;

        EmojiController._allEmojisUniqueKeys = [];
        let last: EmojiData = null;
        for (let i = 0, l = EmojiController.AllEmojis.length; i < l; i++) {
            if (last && EmojiController.AllEmojis[i].Key == last.Key) continue;
            EmojiController._allEmojisUniqueKeys.push(EmojiController.AllEmojis[i]);
            last = EmojiController.AllEmojis[i];
        }

        return EmojiController._allEmojisUniqueKeys;
    }

    public static GetEmojiByKeyData(key: string, data: []) {
        // @ts-ignore 暂时关于data部分的比较先这样比较，找不到就是undefined，也形同
        return this.AllEmojis.find(item => item.Key == key && item.Data[0] == data[0]);
    }

    /**
     * 考虑到划拳什么之类的都是面板上只有一个图标
     */
    public static SendEmojiByKey(key: string) {
        let emojis = EmojiController.AllEmojis.filter(item => item.Key == key);
        if (emojis.length == 0) return;

        if (emojis.length > 1) {
            RoomSocketInput.InputEmoji(emojis[Math.trunc(Math.random() * emojis.length)]);
        } else {
            RoomSocketInput.InputEmoji(emojis[0]);
        }
    }

    public static async CreatePlaceClip(data: EmojiData,callBack:Function) {
        let name = data.Subpackage + '/' + data.Id;
        let clip: cc.AnimationClip;
        if (this._loadedEmojiMap.get(name)) {
            clip = await UIUtil.CreateAnimationClip(name);
            if(callBack) {
                callBack("AnimClip", clip , data);
            }
        } else {
            ResManager.LoadRes(data.Key, cc.SpriteFrame, async(err, res) => {
                if (err) {
                    Clog.Error('ChangeSprite Error!, name:' + name + ",err" + JSON.stringify(err));
                    return;
                } else {
                    if(callBack) {
                        callBack("SpriteFrame", res , data);
                    }
                }

                clip = await UIUtil.CreateAnimationClip(name);
                if(callBack) {
                    callBack("AnimClip", clip , data);
                }
            })
        }
    }

}