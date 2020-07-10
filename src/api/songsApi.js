import axios from 'axios';
const request = axios.create({
    baseURL: 'http://localhost:9000',
    timeout: 5000,
    headers:{'Content-Type':"application/json"}
});
export default{
    getSongsBySinger(name,page,size){
        return request({
            url:"/song",
            methods :'get',
            params:{
                name,
                page,
                size
            }
        })
    }
}