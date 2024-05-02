const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ port: 9000 });
const AddMsg = require('./redis-service.cjs')
const redisService = require('./redis-service.cjs')

// wsServer.on('connection', onConnect);


const clients = new Map();

async function checkOldMessages(for_user,m_type){
  let old_messages = await redisService.GetMessagesByNick(for_user)
  console.log('saved messages for',for_user,old_messages.length);
  old_messages.reverse().forEach(el => {
    let msg = JSON.parse(el)
    sendToClient(msg['from'],for_user,el,m_type)
  });
}

wsServer.on('connection',(ws)=>{
  let greeting = JSON.stringify({'from':'SERVER','to':'new client',"msg":'who_is_you'})
  ws.send(greeting)

  ws.on('onopen',(msg)=>{
    console.log('onopen',JSON.parse(msg));
  })
  
  ws.on('message',(msg)=>{
    console.log(clients.size)
    let m = JSON.parse(msg)

    if(m['i']) {
      // set client id
      
      clients.set(m['i'],ws)
      console.log('Новый пользователь',m['i'],m['type']);

      checkOldMessages(m['i'])
      
      
    } 
    else {
      sendToClient(m['from'],m['to'],m['msg'],m['type'])
      console.log(m)
    }
    
  })

  ws.on('close', () => {
    deleteByValue(clients,ws)
  });
})


function sendToClient(from,to_client, message,type,dinf) {
  const client = clients.get(to_client);
  console.log('send msg to',to_client,'from',from);

  if (client) {
    let resp = JSON.stringify({'from':from,'to':to_client,"msg":message,"type":type,"dinf":dinf})
    client.send(resp);
  } 
  else  {
    console.log('test',message);
    redisService.AddMsg(to_client,message)//Add msg to queue in redis
    sendToClient('SERVER',from,`Client ${to_client} is not connected`,'text',to_client)
  }
}

function deleteByValue(map, value) {
  for (const [key, val] of map.entries()) {
    if (val === value) {
      map.delete(key);
      console.log(`Client disconnected: ${key}`);
      return;
    }
  }
  console.log(`Value ${value} not found in the map`);
}

console.log('Сервер запущен на 9000 порту');