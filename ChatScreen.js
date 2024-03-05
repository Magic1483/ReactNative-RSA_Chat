import React,{useContext,useState,useRef,useEffect} from "react";
import { StyleSheet,Text,View,Button,TextInput, Alert , ScrollView,FlatList } from "react-native";
// import { LoginContext } from "./LoginContext";
import RSAKey from 'react-native-rsa';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from "./clients_mmkv";
import { useIsFocused } from '@react-navigation/native';

import { SendMessage } from "./webserviceServiceF";
import { RSA_Decrypt,RSA_Decrypt_self,RSA_Encrypt } from "./rsa_helper";

function ChatScreen (props){

  

        const isFocused = useIsFocused();
        
        const decryptAllMsgs = async (messages,client_key,nick) => {
          const decrypted = await Promise.all(messages.map(async m =>{
            const {from,msg,to} = JSON.parse(m)
            let decrypted_msg = ''
            
            if (from==nick){
              decrypted_msg = await RSA_Decrypt_self(msg)
            } 
            else if (from!='SERVER'){
              
              decrypted_msg = await RSA_Decrypt(msg,client_key)
            }
            else{
              decrypted_msg = msg
            }

            return {from,msg:decrypted_msg,to}
          }))
          console.log('ds',decrypted);
          return decrypted
        }

        const handleDecrypt = async (messages, clientKey) => {
          const res = JSON.parse(storage.getString(props.dest_client));
          const nick =  await  AsyncStorage.getItem('nick')

          console.log('handke decrypt',messages);
          const decrypted = await decryptAllMsgs(messages, res.key,nick);
          console.log('ds2',decrypted);
          setDecryptedMessages(decrypted);
        };



        useEffect(()=>{

          console.log('[CHAT] focused');
          console.log(props.dest_client);
          
          const res = JSON.parse(storage.getString(props.dest_client));
          console.log('get client',props.dest_client);
          setMessage_to(props.dest_client)
          props.setMessages(res.messages);
          // handleDecrypt(res.messages,res.key)
          set_client(res)


        },[isFocused])


        useEffect(()=>{
          const handle = async () =>{
            console.log('update msgs');
            handleDecrypt(props.messages,client.key)

          }

          handle()
        },[props.messages])

        
        
        const [text,setText] = useState('');

        const [message_to,setMessage_to] = useState('');

        const [nick,set_nick] = useState('')
        const [client,set_client] = useState([])

        const [decryptedMessages, setDecryptedMessages] = useState([]);
        
       
        
        

        //RSA Section
        const [publicKey, setPublicKey] = useState('');
        const [privateKey, setPrivateKey] = useState('');

        useEffect(()=>{
            checkAsyncStorage()
        },[])

        const checkAsyncStorage = async () => {
            try {
              const PUB_KEY =  await AsyncStorage.getItem('public_key')
              const PRIV_KEY =  await  AsyncStorage.getItem('private_key')
              
              const nick =  await  AsyncStorage.getItem('nick')
              set_nick(nick)

              if (PUB_KEY !== null && PRIV_KEY!==null) {
                console.log('Value exists in AsyncStorage');
                setPublicKey(PUB_KEY);
                setPrivateKey(PRIV_KEY);
              } else {
                console.log('Value does not exist in AsyncStorage');
              }
            } catch (error) {
              console.log(error);
            }

          };
        


        const sendMessage =  async () => {

          const encrypted_text = await RSA_Encrypt(text,publicKey)
          console.log('encoded',encrypted_text);

          
          let msg = JSON.stringify({'from':nick,'to':message_to,'msg':encrypted_text})
          
          console.log('msg is',msg);


          props.setMessages((prevMsg)=>[...prevMsg,msg]);

          client.messages.push(msg);
          console.log('mssgto',props.websocket);

          SendMessage(props.websocket,nick,message_to,msg)
          storage.set(message_to,JSON.stringify(client))

          setText('')

          };

        

        //#region InputWithDynamicSize
        function InputWithDynamicSize() {
            function handleContentSizeChange(event) {
              let height = event.nativeEvent.contentSize.height;
              if (height<40){
                setInputHeight(40);
              }else{
                setInputHeight(height);
              }
            }
          
            const [inputHeight, setInputHeight] = React.useState(30);
        
        
        
          
            return (
              <TextInput
                style={{  height: inputHeight, 
                          borderColor: 'gray', 
                          borderWidth: 1 ,
                          overflow: 'hidden',
                          // borderRadius:10,
                          padding:10,
                          flex:3}}
                multiline={true}
                onChangeText={setText}
                value={text}
                onContentSizeChange={handleContentSizeChange}/>
            );
          }
        //#endregion
        
        
        const  HandleMessage = (m)=>{
          
            
            // let m = JSON.parse(data);
            // m = m.data
            // console.log('handler',m);
            let sender = ''
            let align = ''

            if (m.from == nick){
              sender = "me "
              align = 'self-end'

            }else if (m.from!='SERVER'){
              sender = m.from
            } else{
              sender = 'SERVER'
            }

                return (
                    <View  style={styles.message} className={`${align} w-2/3`}>
                    <Text >{m.msg}</Text>
                    <Text style={styles.message_sender}>{sender}</Text>
                    </View>
                )
            
        }

        

        return(
            
            <View style={styles.main}>
                <Text title='Chat screen'/>


                {decryptedMessages && <FlatList 
                  data={[...decryptedMessages].reverse()} 
                  renderItem={(el)=>HandleMessage(el.item)}
                  keyExtractor={(el)=>el.index}
                  inverted
                  />}
                  

                {/* {decryptedMessages && <ScrollView>
                  {decryptedMessages.map((m,index)=>(
                      <HandleMessage key={index} data={m}/>
                  ))}
                </ScrollView>} */}

                
                <Text>{text.length}/256</Text>
                <View style={styles.input_section}>
                {InputWithDynamicSize()}
                <Button title="Send" onPress={sendMessage}  style={{flex:2}}/>
                </View>
                
            </View>
        )
    }

    const styles = StyleSheet.create({
        main:{
          display:'flex',
          flex:1,
          flexDirection:'column',
          justifyContent:'flex-end',
          // width:'20%',
          padding:10
        },
        input_section:{
          display:'flex',
          flexDirection:'row'
        },
        text:{
          color:'#a8a832'
        },
        message:{
            // width:'max-content',
            padding: 10,
            margin: 10,
            backgroundColor:"#9BA4B5",
        },
        message_sender:{
            color:'#212A3E',
            fontSize:10,
            paddingTop:7,
            alignSelf:'flex-end'
        }
      })


export default ChatScreen;