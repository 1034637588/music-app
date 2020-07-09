let data = require('../../public/mockData/singer/singer.json');
export default{
    getSingers(){
        return Promise.resolve(data);
    }
}
