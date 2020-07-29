import Clog, { ClogKey } from "../../../../base/script/frame/clog/Clog";
import { SS } from "../../../../base/script/global/SS";
import { EventCommond } from "../../../other/EventCommond";

export enum EnumSubLoadState {
    Start = 0,
    Success = 1,
    Fail = 2,
    Error = 3,
}

export enum EnumSubPackage {
    Xiyou = 'xiyou',
    Emoji = 'emoji',
    EmojiPart1 = 'emo1',
    EmojiPart2 = 'emo2',
    Topic = 'topic',
}

export class LaunchManager {

    private static subLoadStates: { [subname: string]: EnumSubLoadState } = {};

    public static LoadSubPackage(subpackage: EnumSubPackage): Promise<boolean> {
        return new Promise((reslove) => {
            Clog.Warn(ClogKey.Res, "load subpackage", subpackage);

            // if (SS.CurPlatform != EnumPlatform.QQ && SS.CurPlatform != EnumPlatform.Baidu  && SS.CurPlatform != EnumPlatform.Oppo  && SS.CurPlatform != EnumPlatform.Vivo ) {
            //     //不需要加载子包的平台，直接设置成加载成功
            //     LaunchUtil.subLoadStates[name] = subLoadSuccess;
            //     return;
            // }
            if (cc.sys.isBrowser) {
                LaunchManager.subLoadStates[name] = EnumSubLoadState.Success;
                reslove(true)
                return;
            }

            try {
                LaunchManager.subLoadStates[subpackage] = EnumSubLoadState.Start;
                cc.loader.downloader.loadSubpackage(subpackage, (err: any) => {
                    if (err) {
                        Clog.Warn(ClogKey.Res, "load subpackage fail", subpackage, err);
                        LaunchManager.subLoadStates[subpackage] = EnumSubLoadState.Fail;
                        reslove(false)
                    }
                    else {
                        Clog.Warn(ClogKey.Res, "load subpackage success", subpackage);
                        LaunchManager.subLoadStates[subpackage] = EnumSubLoadState.Success;

                        SS.EventCenter.emit(EventCommond.SubLoadSuccess, subpackage);
                        reslove(true)
                    }
                });
            }
            catch (error) {
                Clog.Warn(ClogKey.Res, "load subpackage error", subpackage, error);
                LaunchManager.subLoadStates[subpackage] = EnumSubLoadState.Error;
                reslove(false)
            }
        })

    }

    public static SubLoadState(subpackage: EnumSubPackage): EnumSubLoadState {
        if (LaunchManager.subLoadStates[subpackage] === undefined) return EnumSubLoadState.Error;
        return LaunchManager.subLoadStates[subpackage];
    }

}