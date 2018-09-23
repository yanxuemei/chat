import instance from './index';
const preUrlPath = '';
//通过聊天消息获取机器人回复
const post= {
  r: params => {
    return instance.post(`${preUrlPath}/test/service?`, params)
  }
};


export {
  post
}
