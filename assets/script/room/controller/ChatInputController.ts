import { qq, SS } from "../../../base/script/global/SS";
import Clog, { ClogKey } from "../../../base/script/frame/clog/Clog";
import { CheckContentController } from "../../common/controller/checkContent/CheckContentController";
import { UIToast } from "../../common/view/UIToast";
import { RoomSocketInput } from "../../common/controller/websocket/RoomSocketInput";
import { EventCommond } from "../../other/EventCommond";

export class ChatInputController { 

    /**
     * 输入完成后的检查和发送
     * @param inputStr 
     */
    public static async InputEnded(inputStr: string) {
        let isOk = await CheckContentController.CheckContent(inputStr);
        if (!isOk) {
            UIToast.Show("文字内容不合法")
            return;
        }
        RoomSocketInput.InputChat(inputStr);
    }

    /**
     * 调起QQ的输入法
     */
    public static async QQInputHandler(): Promise<boolean>  {
        var self = this;
        return new Promise(resolve => {
            let obj = {
                defaultValue:"",
                maxLength:100,
                multiple:false,
                coonfirmHold:true,
                confirmType:"done",
                success:(res: any) => {
                    Clog.Trace(ClogKey.Api,"调起输入法成功");
                    qq.onKeyboardConfirm((res: any) => {
                        self.OffKeyboardConfirm();
                        self.InputEnded(res.value);
                        SS.EventCenter.emit(EventCommond.CloseQQChatBack);
                    });
                    resolve(true);
                },
                fail: ()=> {
                    Clog.Trace(ClogKey.Api,"调起输入法失败");
                    resolve(false);
                }
            };
            qq.showKeyboard(obj);
        });
    }

    public static OffKeyboardConfirm() {
        qq.offKeyboardConfirm();
        Clog.Trace(ClogKey.Api,"移除QQ输入法完成事件");
    }

    public static QQHideKeyBoard() {
        let obj = {
            success:() => {
                Clog.Trace(ClogKey.Api,"关闭输入法成功");
            },
            fail: ()=> {
                Clog.Trace(ClogKey.Api,"关闭输入法失败");
            }
        };
        qq.hideKeyboard(obj);
        this.OffKeyboardConfirm();
    }
}


