//libraries
const md5 = require('md5')

class session{
    createSession(){
        let number = Math.random() * (5000 - 1) + 1;
        number = Math.floor(number);
        return md5(number)
    }
}


module.exports = session;