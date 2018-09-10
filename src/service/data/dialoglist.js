//对话列表

/*
*
*headurl:对话人头像
*remarks:对话人名字
*type消息类型(1是普通消息2是图片消息)
*newmeassage:对话最新一条消息
*sendobject:发送信息的对象(1是别人0是自己)
*Messageblob:消息内容
*
*
*
*/


export const dialog = [
  {
    "headurl": require("../../assets/images/header01.png"),
    "remarks": "机器人",
    "type": 1,
    "Messageblob": "你好[微笑]",
    "sendobject": 1,
  },
  {
    "headurl": require("../../assets/images/header02.jpg"),
    "remarks": "颜雪梅",
    "type": 1,
    "Messageblob": "嗯 你好呀[害羞]",
    "sendobject": 0,
  }]
