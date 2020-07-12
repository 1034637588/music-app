let express = require('express');
let cors = require('cors');
let app = express();
let axios = require('axios');
const { response } = require('express');
app.use(cors());
app.use('/public/',express.static('./public/'));

const request = axios.create({
    timeout: 5000,
    headers:{'Content-Type':"application/json;charset=UTF-8"}
});

//获取歌曲
app.get('/song',(req,response)=>{
    let {name,page,size} = req.query;
    name = encodeURI(name);
    let url = `http://search.kuwo.cn/r.s?all=${name}&ft=music&%20itemset=web_2013&client=kt&pn=${page}&rn=${size}&rformat=json&encoding=utf8`;
    request.get(url).then(res=>{
        response.end(res.data);
    })
});

app.get('/play',(req,response)=>{
    let {id} = req.query;
    let url = `http://www.kuwo.cn/url?format=mp3&rid=${id}&response=url&type=convert_url3&br=128kmp3&from=web&t=1594220085844&httpsStatus=1&reqId=f69c5850-c12a-11ea-b998-e75008adf45e`
    request.get(url).then(res=>{
        response.end(JSON.stringify(res.data));
    })
});

app.get('/lrclist',(req,response)=>{
    let {id} = req.query;
    let url = `http://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${id}&httpsStatus=1&reqId=a1e12180-c128-11ea-800f-4d8ca306f679`
    request.get(url).then(res=>{
        response.end(JSON.stringify(res.data));
    })
})

app.listen('9000',()=>{
console.log('ok');
});
