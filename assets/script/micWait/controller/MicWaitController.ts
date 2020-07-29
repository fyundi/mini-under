import { EventCommond } from "../../other/EventCommond";
import { SS } from "../../../base/script/global/SS";
import { Session } from "../../login/model/SessionData";
import { MicWaitData } from "../model/MicWaitData";
import { RoomController } from "../../room/controller/RoomController";
import Xhr, { XhrUrl } from "../../../base/script/api/http/Xhr";
import Clog from "../../../base/script/frame/clog/Clog";
import { EnumRoomMode, EnumRole } from "../../other/EnumCenter";
import { JoinMicController } from "../../room/controller/JoinMicController";
import { UIToast } from "../../common/view/UIToast";


export class MicWaitController {
    
    /**
     * 排麦列表
     */
    public static JoinMicWaitList: MicWaitData[] = []; 

    /**
     * 服务器只传id。。。
     */
    public static JoinMicWaitIDList: number[] = []; 
    
    public static RefreshMicWaitListData(data : number[]) {     
        MicWaitController.JoinMicWaitIDList = data;    

        // SS.EventCenter.emit(EventCommond.UIMicWait); //放在UIRoomRefresh里面刷新
    }

    /**
     * 是不是正在排麦中。。
     */
    public static IsMicWaiting(Uid:number):boolean
    {
        let res = MicWaitController.JoinMicWaitIDList.find(item => item == Uid);
        if (res) {
            return true;
        }
        else{
            return false;
        }
    }   

     /**
     * 排队上麦的情况下申请上麦
     * @param uid 
     * @param openid 
     */
    public static JoinMicWait(pos: number, uid: number = Session.BanBan.UId, openid: string = Session.BanBan.OpenId) {
        if(RoomController.CurRoom.Mode == EnumRoomMode.Auto)
        {
            JoinMicController.JoinMic(pos);
        }
        else if(RoomController.CurRoom.Mode == EnumRoomMode.Lock)
        {
            let seat = RoomController.Seats.find(item => item.Position == pos);
            let bos="0";
            if (seat) {
                bos=seat.Role == EnumRole.ROLE_GOD ? '1' : '0';
            }
    
            let url = new XhrUrl("room/queue").Url;
            let postData = {
                rid: '' + RoomController.CurRoom.RoomId,
                position: '' + pos,
                boss: bos
                // uid: uid,
                // openid: openid,
            }
    
            // 不需要考虑结果，结果会在socket中分发
            Xhr.PostJson(url, postData);
        }        
    }

     /**
     * 取消排队上麦
     * @param uid 
     * @param openid 
     */
    public static async JoinMicWaitCancel(uid: number = Session.BanBan.UId, openid: string = Session.BanBan.OpenId) {
        return new Promise(async (resolve) => {
            if(RoomController.CurRoom.Mode == EnumRoomMode.Lock&&MicWaitController.IsMicWaiting(Session.BanBan.UId))
            {
                let url = new XhrUrl("room/queue").Url;
                let postData = {
                    rid: '' + RoomController.CurRoom.RoomId,
                    position: '-3',
                    boss: '0'                
                }
              
                let msg =await Xhr.PostJson(url, postData);                                   
                let success = msg['success'];
                if (success == false) {
                    resolve(false)
                    return
                }            
                
                resolve(true)
            }  
            else
            {
                resolve(false)
            }
        })               
    }

     /**
     * 查看排麦信息
     * @param uid 
     * @param openid 
     */
    public static async micWaitListReq(uid: number = Session.BanBan.UId, openid: string = Session.BanBan.OpenId) {           
                
        return new Promise(async (resolve) => {
            let url = new XhrUrl("room/queue").Url;
            let postData = {
                rid: '' + RoomController.CurRoom.RoomId,
                position: '-2',
                boss: "0"             
            }
    
            // 不需要考虑结果，结果会在socket中分发
            let msg =await Xhr.PostJson(url, postData);                         
            let success = msg['success'];
            if (success == false) {
                resolve(false)
                return
            }
            let data = msg["data"];
            MicWaitController.JoinMicWaitList=[]; 
            for(let i=0;i<data.length;i++)
            {
                MicWaitController.JoinMicWaitList.push(new MicWaitData(data[i]));
            }     
            
            resolve(true)
        })   
    }


    /**
     * 拉上麦
     * @param uid 
     * @param openid 
     */
    public static async JoinMic(uid: number) { 
        return new Promise(async (resolve) => {
            let url = new XhrUrl("room/joinMic").Url;
            let postData = {
                rid: '' + RoomController.CurRoom.RoomId,
                position: '-1',          
                uid: uid,          
            }          
            let msg =await Xhr.PostJson(url, postData);    
            let success = msg['success'];
            if (success == false) {
                if(msg['msg'])
                {             
                    UIToast.Show(msg['msg']);
                }               
                resolve(false)
                return
            }                                  
            resolve(true)
        })         
    }


     /**
     * 排麦列表和排麦id列表校验
     * @param uid 
     * @param openid 
     */
    public static async micWaitListCheck() {           
                
        await MicWaitController.micWaitListReq();
        let ids: number[] = []; 
        for(var i=0;i<MicWaitController.JoinMicWaitList.length;i++)
        {
            ids.push(MicWaitController.JoinMicWaitList[i].UId);
        }
        MicWaitController.JoinMicWaitIDList=ids;
        SS.EventCenter.emit(EventCommond.UIMicWait);
    }

}
