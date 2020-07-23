import axios from 'axios';
const request = axios.create({
    baseURL: 'http://localhost:9000',
    timeout: 5000,
    headers:{'Content-Type':"application/json"}
  });
  export default{
      getSearchKey(){
          return request({
              url:"/searchkey",
              method:'get'
          })
      },
      getSearchList(key){
        return request({
            url:"/searchList",
            method:'get',
            params:{key}
        })
      },
      SearchMusicBykeyWord(key,page,size){
        return request({
            url:"/searchMusicBykeyWord",
            method:'get',
            params:{key,page,size}
        })
      }
  }