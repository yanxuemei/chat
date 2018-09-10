import * as dialoglist from './data/dialoglist'
import * as robotist from './data/robotlist'
import * as ai from './data/ai'
import * as chatfaceData from './data/chatface'


const setpromise = data => {
	return new Promise((resolve, reject) => {
		resolve(data)
	})
}

export const dialog = () => setpromise(dialoglist.dialog);			//对话列表页数据
export const robot = () => setpromise(robotist.dialog);			//模拟机器人消息
export const aiData = () => setpromise(ai.aiData);			//获取AI提示信息
export const chatData = () => setpromise(chatfaceData.chatface);		//获取聊天页面轮播数据
