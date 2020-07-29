## Step1. BanBan客户端通知BanBan服务器

* 消息类型：http
* url：xiyou/createOrder
* 发送数据：

```json
{
    "appId":"1110336983",					        
    "giftId":20101,								   //礼物Id		
    "giftName":"比心",							 //礼物名称
    "giftNum":1,								  //礼物数量
    "giftPrice":1,			 					  //单价
    "money":0,									 //送礼的总价
    "from":105000964,							  //banban的uid	
    "to":[],									 //送给的玩家列表，中间用，隔开
    "sign":"2105afd3f36dca22827664c3c5aaa7f1"		//通用的数据加密方案
}
```

* 响应数据：

```json
{
    "success":true,
    "data":
    {
        "orderNo": "EA601952808176333"				//订单号
    }
}
```

## Step2. BanBan客户端通知XiYou服务器

* 消息类型：websocket
* 参考[SDK文档](http://wiki.xiyoudoc.com/sdk/pages/sdk/mini/game_hall_client.html) 中第3.10项：游戏物品消耗
* 发送数据：
```json
//xiyou底层知道发送者momoId
{
    "type": 1, 					//1：赠送物品 2：个人道具消耗   
    "toArrs": ["30002","30003"],  //当type为1时，为接收方玩家momoId数组，当type为2时，toArrs无意义   
    "roomId": "658453784", 		 //房间id
    "productId":16, 			//商品id 
    "num": 1,  					//数量
    "price": 2 ， 			    //价格,分为单位   
    "orderNo":"xx458849448", 	 //订单号
    "cbURL":"xy.iambanban.com/xiyou/sendGiftCallback" //西游回调地址
}
```

* 响应数据：

```json
{
    "data":{
        "success":0, // 标识 0表示成功。其他则失败，失败原因看message
        "message":"" //错误信息
    },
    "em":"OK", 
    "timesec":1590399696964, //时间戳(单位毫秒)
    "ec":0   // 请求成功
}

```
## step3. banban客户端通知banban服务器

* 作用：客户端同时同步消耗结果给banban服务器，服务器与step4中xiyou同步过来的结果作较对
* 消息类型：http
* url：xiyou/sendGiftResult
* 发送数据：
```json
{
     "orderNo": "xx458849448",                //订单号
     "success": 1,						    //结果	
     "message": ""							
     "sign": null
 }
```

## Step4. Xiyou服务器通知BanBan服务器

* 通知方式：Http Post 
* 地址：为step2中cbURL字段
* 发送数据：

```json
{
    "type":"sendGift",
    "data":
    {
        "bbOrderNo":"xx458849448", // 伴伴订单号
        "orderNo":"", 			// XiYouServer 订单号
        "momoId":"", 			// XiYouServer 用户
        "giftId":15,             //礼物Id
        "giftNum": 2,            //礼物数量
        "giftName":"拖鞋",       //礼物名称
        "giftPrice":200,        //礼物单价        
        "money":400,             //支付金额，单位分
        "currency":"CNY",       //人民币
        "status":true,           //赠送成功与否
        "extension":"",         //赠送结果附带消息
        "sign":""               //签名
		// ...其他信息
    }
}
```

* 响应数据：

```
"SUCCESS"		//处理结果，如下表
```

| 字符         | 说明                           |
| ------------ | ------------------------------ |
| SUCCESS      | 处理成功                       |
| REPEAT_ORDER | 重复订单，已经处理成功过的订单 |
| SIGN_ERROR   | 签名错误                       |
| PRICE_ERROR  | 支付金额错误                   |
| USER_ERROR   | 无效用户                       |
| FAILED       | 其他错误                       |



