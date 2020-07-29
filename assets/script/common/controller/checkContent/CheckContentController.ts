import Xhr, { XhrUrl } from "../../../../base/script/api/http/Xhr";




export class CheckContentController {
    public static async CheckContent(contetn: string): Promise<boolean> {
        return new Promise(async (resolve) => {
            var url = new XhrUrl("xiyou/checkContentValid").Url;
            let postData = {
                content: contetn
            }
            let msg = await Xhr.PostJson(url, postData);
            let success = msg['success']
            if (success == false) {
                resolve(false)
                return
            }
            resolve(true)
        })
    }


}