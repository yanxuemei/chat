import instance from './index';
const preUrlPath = '';
//获取表情接口
const get = {
  r: params => {
    return instance.get(`${preUrlPath}/getFace`, params)
  }
};


export {
  get
}
