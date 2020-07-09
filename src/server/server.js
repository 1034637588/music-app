let express = require('express');
let cors = require('cors');
let app = express();
let axios = require('axios');
app.use(cors());
app.use('/public/',express.static('./public/'));

app.listen('9000',()=>{
console.log('ok');
});
