// import axios from 'axios';
// // import {getUser} from '@/utils/auth'
// const request = axios.create({
//     // baseURL: '../mockData/recommmend/recommend-hot.json',
//     timeout: 5000
//     // headers:{'Authorization':'Bearer '+getUser.token}
//   });
// export default{
//     TopRecommend(){
//         return request({
//             url:'../mockData/recommmend/recommend-hot.json',
//             method:'get'
//         })
//     }
// }
let data = require('../../public/mockData/recommmend/recommend-hot.json');
export default{
    TopRecommend(){
        return Promise.resolve(data);
    }
}
