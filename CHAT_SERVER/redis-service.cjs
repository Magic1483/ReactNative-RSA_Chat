const Redis = require('ioredis')
const redis = new Redis();


async function AddMsg(nick,msg) {
    console.log('try push',msg,'to',nick);
    await redis.lpush(nick,msg,(err,res)=>{
            if (err){
                console.log('Error push',err);
            } else {
                console.log('Success push',res);

            }
        })
}


async function GetMessagesByNickTest(nick){
    const messages = await redis.lrange(nick, 0, -1);
    return messages
}

async function GetMessagesByNick(nick) {
    const messages = await redis.lrange(nick, 0, -1);
    await redis.del(nick,(err,res)=>{
        if (err){
            console.log('Error delele list messages',err);
        } else {
            console.log('Success delele list messages',res);
        }
    })
    return messages
}


async function main() {

  

  let msgs = await GetMessagesByNickTest('u2')
  let msg = JSON.parse(msgs[0])
  console.log(msg['from']);
  

  
}





module.exports.AddMsg = AddMsg;
module.exports.GetMessagesByNick = GetMessagesByNick;