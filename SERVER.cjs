const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ port: 9000 });

// wsServer.on('connection', onConnect);

let clients_db = ['react-test-user','tst1','tst2'];
const clients = new Map();

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
      console.log('Новый пользователь',m['i']);
      console.log(m);
      
    } 
    else {
      sendToClient(m['from'],m['to'],m['msg'])
      console.log(m)
    }
    
  })

  ws.on('close', () => {
    deleteByValue(clients,ws)
    console.log(`Client  disconnected`);
    console.log(clients);
  });
})

function onConnect(wsClient) {
    console.log('Новый пользователь');
    wsClient.send('Привет');

    wsClient.on('close', function() {
        console.log('Пользователь отключился');
    });

    wsClient.on('message', function(message) {
        console.log(message);
        const jsonMessage = JSON.parse(message);
        let client_nick = jsonMessage['i'];
      

        clients.set(client_nick,wsClient)
        
    });
}

function sendToClient(from,to_client, message) {
  const client = clients.get(to_client);
  
  if (client) {
    let resp = JSON.stringify({'from':from,'to':to_client,"msg":message})
    client.send(resp);
    // console.log(`Sent message to client ${clientId}: ${message}`);
  } 
  else  {
    console.log(`Client ${to_client} is not connected`);
    sendToClient('SERVER',from,`Client ${to_client} is not connected`)
  }
}

function deleteByValue(map, value) {
  for (const [key, val] of map.entries()) {
    if (val === value) {
      map.delete(key);
      console.log(`Deleted key: ${key}, value: ${value}`);
      return;
    }
  }
  console.log(`Value ${value} not found in the map`);
}

console.log('Сервер запущен на 9000 порту');