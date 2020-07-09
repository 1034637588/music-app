/*
QQ音乐
搜索歌曲
https://c.y.qq.com/soso/fcgi-bin/client_search_cp?aggr=1&cr=1&flag_qc=0&p=1&n=30&w=简单爱 
p：页数，从1开始
n：每一页显示的条数
w：搜索关键字

最新音乐排行榜top100
https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8¬ice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=27&_=1519963122923

随机推荐
https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8¬ice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=36&_=1520777874472

专辑封面
封面图片url要使用albumid字段拼接生成，格式
"http://imgcache.qq.com/music/photo/album_300/%i/300_albumpic_%i_0.jpg", albumid%100, albumid
比如albumid=8217
封面地址就是http://imgcache.qq.com/music/photo/album_300/17/300_albumpic_8217_0.jpg，
可以在浏览器中打开验证。


播放链接
获取token
https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json205361747&platform=yqq&cid=205361747&songmid=003lghpv0jfFXG&filename=C400003lghpv0jfFXG.m4a&guid=126548448

songmid可以从歌曲信息中取到，filename根据songmid生成。
比如，songmid是003lghpv0jfFXG，则filename就是前缀加上C400，后缀加上.m4a，
即C400003lghpv0jfFXG.m4a。
其他字段format、platform、cid、guid可以写死，但都是必须的。
请求到的结果中可以看到expiration为80400（秒），
表示有效时长大约22.3小时。
vkey字段就是我们接下来拼接播放地址要使用的。
拼接播放地址
http://ws.stream.qqmusic.qq.com/C400003lghpv0jfFXG.m4a?fromtag=0&guid=126548448&vkey=D661E5DF19B8FEB2FBFC554276746AC608AE98B0F30595B3B3BAD5C1C89ECCDD7BE599E306F786621856D22D6BD6B96F5DD344CF3814DB71

url的path就是上文中用到的filename。
参数中的几个字段都是必须的：
guid要和请求token时使用的guid保持一致
，vkey即token中的vkey字段，
fromtag随意指定一个整数，可以写死为0。
可以将你拼接好的地址复制到浏览器中验证是否能正常播放
*/
/*
酷我

歌曲搜索
API：http://search.kuwo.cn/r.s?all={0}&ft=music& itemset=web_2013&client=kt&pn={1}&rn={2}&rformat=json&encoding=utf8
{0}=需要搜索的歌曲或歌手
{1}=查询的页码数
{2}=当前页的返回数量

例子：http://search.kuwo.cn/r.s?all=周杰伦&ft=music& itemset=web_2013&client=kt&pn=0&rn=5&rformat=json&encoding=utf8

歌词
http://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=54438189&httpsStatus=1&reqId=a1e12180-c128-11ea-800f-4d8ca306f679
musicId 就是搜索歌词的id  -- 就上上面搜索出来的 'MUSICRID': 'MUSIC_94237'


歌曲播放
http://www.kuwo.cn/url?format=mp3&rid=95379975&response=url&type=convert_url3&br=128kmp3&from=web&t=1594220085844&httpsStatus=1&reqId=f69c5850-c12a-11ea-b998-e75008adf45e
rid={95379975} 就是歌曲id

返回歌曲地址
{"code": 200, "msg": "success", "url": "https://win-web-nf01-sycdn.kuwo.cn/4904edc99aec0832a031253be6b14a60/5f05df7c/resource/n1/18/76/632545120.mp3"}


*/

