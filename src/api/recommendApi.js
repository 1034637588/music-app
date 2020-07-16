import axios from 'axios';
// import {getUser} from '@/utils/auth'
const request = axios.create({
    baseURL: 'http://localhost:9000',
    timeout: 5000,
    headers:{'Content-Type':"application/json"}
  });
export default{
    getBanner(){
        return request({
            url:'/banner',
            method:'get'
        })
    },
    TopRecommend(page,size){
        return request({
            url:'/playlist',
            method:'get',
            params:{
                page,
                size
            }
        })
    },
    getRecommendPlayList(pid,page,size){
        return request({
            url:'/playlistInfo',
            method:'get',
            params:{
                page,
                size,
                pid
            }
        })
    }

}
