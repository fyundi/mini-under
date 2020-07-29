import { RoomStyle } from "../../../other/RoomStyle";
import { UIEventCenter } from "../../../../base/script/util/UIEventCenter";
import { UserDetailController } from "../../../userDetail/controller/UserDetailController";
import { UIManager } from "../../../../base/script/frame/ui/UIManager";
import { UIUserDetail } from "../../../userDetail/view/UIUserDetail";
import { Session } from "../../../login/model/SessionData";
import Clog from "../../../../base/script/frame/clog/Clog";

/*
 * @Description: 
 * @Author: luo.fei
 * @Date: 2020-04-27 15:28:25
 */
export class RoomChat extends cc.Component {

    private _item: cc.Node;
    private _lvIcon: cc.Node;         //玩家等级图片
    private _lvIconBg: cc.Sprite;         //玩家等级图片
    private _lvIconLabel: cc.Label;       //玩家等级
    private _label: cc.RichText;           //发言文字 
    private _emoji: cc.Node;            //表情图片container
    private _emojiAnim: cc.Animation;  // 表情图片
    private _btn: cc.Button;
    private _layout: cc.Layout;

    private initRoot(): void {
        this._item = this.node;
        this._lvIcon = cc.find("LvIcon", this.node);
        this._lvIconBg = cc.find("LvIcon/Bg", this.node).getComponent(cc.Sprite);
        this._lvIconLabel = cc.find("LvIcon/Label", this.node).getComponent(cc.Label);
        this._label = cc.find("Label", this.node).getComponent(cc.RichText);
        this._label.lineHeight = 40;
        this._emoji = cc.find("Emoji", this.node);
        this._emojiAnim = cc.find("Emoji/Icon", this.node).getComponent(cc.Animation);
        this._btn = this.node.getComponent(cc.Button);
        this._layout = this.node.getComponent(cc.Layout);
    }


    /**
    * 文字聊天
    * @param data 需要显示的内容数据
    */
    public Init(data: { vip: number, id: number, name: string, chatStr: string }): void {
        this.initRoot();
        this._emoji.active = false;

        //刷新Vip显示
        if (data.vip <= 0) {
            this._lvIcon.active = false;
        } else {
            this._lvIcon.active = true;
            this._lvIconBg.node.color = RoomStyle.VipColor(data.vip);
            this._lvIconLabel.string = '' + data.vip;
        }

        //刷新聊天内容
        this.refreshContentLabel(data.name, data.chatStr, data.vip);

        this.eventLookOtherDetail(data.id);
    }

    /**
     * 刷新聊天内容
     * @param name 
     * @param content 
     * @param vip 
     */
    private refreshContentLabel(name: string, content: string, vip: number) {
        let vipColor = RoomStyle.VipColor(vip).toHEX("#rrggbb");
        let str = "<b>" + name + "：" + "<color=" + vipColor + ">" + content + "</color>" + "</>";
        this._label.string = str;
        //richtext组件不能强行刷新？？
        // (this._label as any)._forceUpdateRenderData();   
        //为了刷新延迟一帧
        this.scheduleOnce(() => {
            if (this._label.node.width > 616) {
                // if (str.length > 50) {
                if (vip > 0) {
                    this._label.maxWidth = 550;
                }
                else {
                    this._label.maxWidth = 616;
                }
                this._label.enabled = false;
                this._label.enabled = true;
                // (this._label as any)._forceUpdateRenderData();
                let h = this._label.node.height + 20;
                this.node.height = h;
                // (this.node as any)._forceUpdateRenderData();        
            }
            else {
                this._label.maxWidth = 0;
                this._label.enabled = false;
                this._label.enabled = true;
                // (this._label as any)._forceUpdateRenderData();
            }
        }, 0)

    }

    //#region 第二种文字换行方案
    // /**
    //  * 刷新聊天内容,文本的换行
    //  */
    // private refreshContentLabel(name:string,content:string,vip:number)
    // {
    //     let maxStrLength1=25;          //第一行最多的字符数
    //     let maxStrLength2=30;           //第二行以及后面的行最多的字符数
    //     this._labelName.string =name + "：" ;
    //     let allLength=name.length+content.length;
    //     if(allLength>maxStrLength1)
    //     {
    //         let index=allLength-name.length;  
    //         content=content.replace(/[\r\n]/g,"");      //去掉换行      
    //         let content1=content.slice(0,index-1);
    //         this._labelContent.string = content1;
    //         this._labelContent.node.color = RoomStyle.VipColor(vip)
    //         this.widthFit();
    //         while (true) {
    //             let tempContent=content.slice(index,index+maxStrLength2-1);
    //             let node = cc.instantiate(this._labelContent.node);
    //             node.setParent(this.node)
    //             node.active = true;
    //             node.getComponent(cc.Label).string=tempContent;
    //             node.color=RoomStyle.VipColor(vip);
    //             index=index+maxStrLength2-1;
    //             if(index>=(content.length-1))
    //             {
    //                 break;
    //             }
    //         }
    //     }
    //     else
    //     {
    //         this._labelContent.string = content;
    //         this._labelContent.node.color = RoomStyle.VipColor(vip);
    //         this.widthFit();
    //     }
    // }

    // /**
    //  * layout自动适应高度，手动改长度
    //  */
    // private widthFit()
    // {
    //     (this._labelName as any)._forceUpdateRenderData();
    //     (this._labelContent as any)._forceUpdateRenderData();
    //     let width=this._layout.paddingLeft+this._lvIcon.width+this._layout.spacingX+this._labelName.node.width+this._layout.spacingX+
    //     this._labelContent.node.width+this._layout.paddingLeft+3;//+3为了保险起见
    //     this.node.width=width;
    //     (this.node as any)._forceUpdateRenderData();
    // }   
    //#endregion

    /**
     * 点击玩家名字查看详细信息
     * @param uid 
     */
    private eventLookOtherDetail(uid: number) {
        if (uid == Session.BanBan.UId) {
            return;
        }
        UIEventCenter.ButtonEvent(this._btn, async () => {
            UserDetailController.TargetUserId = uid
            await UIManager.OpenUI(UIUserDetail);
        })
    }



}

