import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://14.17.23.249',
  timeout: 10000
});

instance.defaults.headers.post['Content-Type'] = 'application/json charset=UTF-8';


//Res错误处理
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {

    return Promise.reject(error.response.data)
  });




export default instance;
