let express = require('express');
let cors = require('cors');
let app = express();
let axios = require('axios');
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
})

app.listen('9000',()=>{
console.log('ok');
});
