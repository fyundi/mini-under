
/**
 * QQ平台信息
 */
export class QQSystemInfo {
    public StatusBarHeight: number
    public ScreenHeight: number
    constructor(data?: any) {
        if (CC_DEV && data == null) {
            data = {
                AppPlatform: "qq",
                SDKBuild: "00000",
                SDKVersion: "1.14.1",
                benchmarkLevel: 1,
                brand: "devtools",
                devicePixelRatio: 2,
                errMsg: "getSystemInfoSync:ok",
                fontSizeSetting: 16,
                language: "zh_CN",
                model: "iPhone 5",
                pixelRatio: 2,
                platform: "devtools",
                screenHeight: 568,
                screenWidth: 320,
                statusBarHeight: 20,
                system: "iOS 12.0.1",
                version: "6.6.3",
                windowHeight: 568,
                windowWidth: 320,
            }
        }
        this.StatusBarHeight = data.statusBarHeight
        this.ScreenHeight = data.screenHeight
    }
}


/**
 * 参考信息
属性	类型	说明	最低版本
brand	string	设备品牌
model	string	设备型号
pixelRatio	number	设备像素比
screenWidth	number	屏幕宽度，单位dp
screenHeight	number	屏幕高度，单位dp
windowWidth	number	可使用窗口宽度，单位dp
windowHeight	number	可使用窗口高度，单位dp
statusBarHeight	number	状态栏的高度，单位dp
language	string	QQ设置的语言
version	string	QQ版本号
system	string	操作系统及版本
platform	string	客户端平台
fontSizeSetting	number	用户字体大小（单位px）。以QQ客户端「我-设置-通用-字体大小」中的设置为准
SDKVersion	string	客户端基础库版本
benchmarkLevel	number	设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50）
albumAuthorized	boolean	允许QQ使用相册的开关（仅 iOS 有效）
cameraAuthorized	boolean	允许QQ使用摄像头的开关
locationAuthorized	boolean	允许QQ使用定位的开关
microphoneAuthorized	boolean	允许QQ使用麦克风的开关
notificationAuthorized	boolean	允许QQ通知的开关（仅 iOS 有效）
notificationAlertAuthorized	boolean	允许QQ通知带有提醒的开关（仅 iOS 有效）
notificationBadgeAuthorized	boolean	允许QQ通知带有标记的开关（仅 iOS 有效）
notificationSoundAuthorized	boolean	允许QQ通知带有声音的开关（仅 iOS 有效）
bluetoothEnabled	boolean	蓝牙的系统开关
locationEnabled	boolean	地理位置的系统开关
wifiEnabled	boolean	Wi-Fi 的系统开关
navbarPosition	object	右上角胶囊位置 (仅Android小游戏)
 */