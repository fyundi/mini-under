## Step1. xiyou客户端拉起banban客户端
* xiyou客户端界面显示【创建房间】界面，用户输入房间相关信息后，拉起banban聊天室客户端
* xiyou客户端界面显示【加入房间】界面，用户输入房间相关信息后，拉起banban聊天室客户端
* 通过qq的api接口，将用户在xiyou客户端输入的参数传给banban客户端
* 参数示例：
```json
	{
		"type":"createRoom",	//创建房间
		"data":{
			"roomName":"六一儿童节聚会"，     					//房间名，由用户在xiyou界面输入
			"roomType":"交友",								//房间类型，由用户在xiyou界面选择
			"identify":"e53d1172cdf543bb91c85035143d165d"，
		}
	}
```

```json
	{
		"type":"joinRoom",				//加入房间
		"data":{
			"roomId":1581256，     					//房间号
		}
	}
```


## Step2. banban客户端创建房间
* banban客户端解析Step1中的数据后，向banban服务器发启创建房间
* 方式： Http Post
* URL：xiyou/createRoom
* 参数示例：
```json
{
   "subject": "六一儿童节聚会",      //房间名
   "tag": "交友",
   "indentify":"e53d1172cdf543bb91c85035143d165d" ,
   "momoId": LoginManager.MoMoId,
   "sign": ”x59749sgerg“					//banban通用加密方案
 };
```
## Setp3. banban服务器通知xiyou服务器
* banban服务器在创建完房间后，通知xiyou服务器当前房间的状态
* 接口及参数由banban服务器与xiyou服务器商议