let express = require('express');
let cors = require('cors');
let app = express();
let axios = require('axios');
const { response } = require('express');
app.use(cors());
app.use('/public/',express.static('./public/'));

const request = axios.create({
    timeout: 5000,
    headers:{
        'Content-Type':"application/json;charset=UTF-8",
        'Cookie':"_ga=GA1.2.1958734348.1594197994; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1594197993,1594451665; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1594451710; kw_token=4BVLIVCXOEA",
        "csrf":"4BVLIVCXOEA"
        }
});

//获取歌曲根据歌手名
app.get('/song',(req,response)=>{
    let {name,page,size} = req.query;
    name = encodeURI(name);
    let url = `http://search.kuwo.cn/r.s?all=${name}&ft=music&%20itemset=web_2013&client=kt&pn=${page}&rn=${size}&rformat=json&encoding=utf8`;
    request.get(url).then(res=>{
        response.end(res.data);
    })
});
//获取播放地址
app.get('/play',(req,response)=>{
    let {id} = req.query;
    let url = `http://www.kuwo.cn/url?format=mp3&rid=${id}&response=url&type=convert_url3&br=128kmp3&from=web&t=1594220085844&httpsStatus=1&reqId=f69c5850-c12a-11ea-b998-e75008adf45e`
    request.get(url).then(res=>{
        response.end(JSON.stringify(res.data));
    })
});
//获取歌词
app.get('/lrclist',(req,response)=>{
    let {id} = req.query;
    let url = `http://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${id}&httpsStatus=1&reqId=a1e12180-c128-11ea-800f-4d8ca306f679`
    request.get(url).then(res=>{
        response.end(JSON.stringify(res.data));
    })
});

//获取歌单
app.get('/playlist',(req,response)=>{
    let {page,size} = req.query;
    let url = `http://www.kuwo.cn/api/pc/classify/playlist/getTagPlayList?loginUid=1418640818&loginSid=3254760819&id=1848&pn=${page}&rn=${size}&httpsStatus=1&reqId=839824a0-c69e-11ea-bb3b-132f1b474474`;
    request.get(url).then(res=>{
        response.json(res.data);
    })
});

//根据歌单id获取歌曲列表
app.get('/playlistInfo',(req,response)=>{
    let {pid,page,size} = req.query;
    let url = `http://www.kuwo.cn/api/www/playlist/playListInfo?pid=${pid}&pn=${page}&rn=${size}&httpsStatus=1&reqId=f84b4c20-c6a1-11ea-bb3b-132f1b474474`;
        request.get(url).then(res=>{
            response.json(res.data);
        })
});
app.listen('9000',()=>{
console.log('ok');
});
