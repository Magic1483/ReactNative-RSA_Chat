import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage } from "./clients_mmkv";

const reset_addr = async () => {
  await AsyncStorage.removeItem('serv_addr')
  console.log('[WS] serv_addr reset');
}

export const ConnectWebsocket = (message_from,setMessages,set_connected,addr,set_websocket) => {
    // const ws = new WebSocket('ws://192.168.100.3:9000')
    console.log('[WebSocket] Curr addr is',addr);
    const ws = new WebSocket(JSON.parse(addr))

    ws.onopen = () => {
        console.info('WebSocket connection opened')
        set_connected(true)
        ws.send(JSON.stringify({'i':message_from}));
      };
  
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        console.info("new msg",data)
        
        if (data.from!='SERVER'){
          const cl = JSON.parse(storage.getString(data.from))
          
          cl.messages.push(event.data)
          
          storage.set(data.from,JSON.stringify(cl))

          setMessages((prevMsg)=>[...prevMsg,event.data])
        }

        if (data.from=='SERVER' && data.msg!='who_is_you'){
          
          console.log('[SERVER]',data.msg,'to:',data.dinf);

          const cl = JSON.parse(storage.getString(data.dinf))
          
          cl.messages.push(event.data)
          
          storage.set(data.dinf,JSON.stringify(cl))


          setMessages((prevMsg)=>[...prevMsg,event.data])
        }
        
      };
  
    ws.onclose = (event) => {
        set_connected(false);
        set_websocket(null);
        console.warn('[WebSocket] connection closed');
        
    };

    return ws
    
}


export const SendMessage = async (ws,message_from,message_to,text) => {

        if (ws && ws.readyState === WebSocket.OPEN && message_to!=='' ) {
                console.log('[WS] send to',message_to);
                let msg = JSON.stringify({'from':message_from,'to':message_to,'msg':text})  //!STRINGIFY
                ws.send(msg);
                
            }
}