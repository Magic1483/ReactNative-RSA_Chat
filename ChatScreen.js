import React,{useContext,useState,useRef,useEffect} from "react";
import { StyleSheet,Text,View,Button,TextInput, Alert ,Clipboard } from "react-native";
import { LoginContext } from "./LoginContext";
import RSAKey from 'react-native-rsa';
import AsyncStorage from '@react-native-async-storage/async-storage';



function ChatScreen ({navigation}){
    
        const {login,setLogin} = useContext(LoginContext);
        const {password,setPassword} = useContext(LoginContext);

        const [messages,setMessages] = useState([])//saved Messages
        const [message, setMessage] = useState(null);
        const [text,setText] = useState('');

        const [client_key,setClient_key] = useState('');

        const [message_to,setMessage_to] = useState('');
        const [nick,setNick] = useState('');

        const [socketState,setSocketState] = useState(false);
        const ws = useRef(null);


        
        
        
        

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
        

        const generateKeys = async () => {
            const rsa = new RSAKey();
        
            await rsa.generate(256, '10001');
        
            const publicKey = rsa.getPublicString();
            const privateKey = rsa.getPrivateString();

            await AsyncStorage.setItem('public_key',publicKey)
            await AsyncStorage.setItem('private_key',privateKey)

            setPublicKey(publicKey)
            setPrivateKey(privateKey)

            console.log('Generated new RSA keys');
        };

        const remove_RSA_keys = async()=>{
            try {
                await AsyncStorage.removeItem('public_key');
                await AsyncStorage.removeItem('private_key');
                await setPublicKey('');
                await setPrivateKey('');
                console.log('remove RSA keys');
            } catch (error) {
                console.log(error);
            }
        }
        

        const encrypt_msg= (msg)=>{

            const rsa = new RSAKey();
            rsa.setPublicString(publicKey);
            const encrypted = rsa.encrypt(msg);
            return encrypted
        }

        const decrypt_msg =(msg,private_key)=>{
            const rsa = new RSAKey();
            rsa.setPrivateString(private_key);
            const decrypted = rsa.decrypt(msg);
            return decrypted

        }

        const decrypt_self_msg =(msg)=>{
            const rsa = new RSAKey();
            rsa.setPrivateString(privateKey);
            const decrypted = rsa.decrypt(msg);
            return decrypted

        }

        //WebSocket Section
        const connectWebSocket = () => {
            ws.current = new WebSocket('wss://wsserver.shrshishoshchov.repl.co');
        
            ws.current.onopen = () => {
              console.log('WebSocket connection opened');
              ws.current.send(JSON.stringify({'i':login}));
              setSocketState(true)
            };
        
            ws.current.onmessage = (event) => {
              console.log(event.data);
              setMessages((prevMsg)=>[...prevMsg,event.data]);
              setMessage(event.data);
            };
        
            ws.current.onclose = (event) => {
              console.log('WebSocket connection closed:', event);
              setMessage(null);
              setSocketState(false)
            };
          };
        
        
        
        
        const sendMessage = async() => {
            console.log('current keys',client_key);
            if (ws.current && ws.current.readyState === WebSocket.OPEN && message_to!=='' && publicKey!=='' && privateKey!=='') {
                    let msg = JSON.stringify({'from':login,'to':message_to,'msg':encrypt_msg(text)})
                    ws.current.send(msg);
                    setMessages((prevMsg)=>[...prevMsg,msg]);
                    setMessage(msg);
                }
            
          };

        const CopyPrivKey =()=>{
            Clipboard.setString(privateKey);
            alert('key copied');
        }

        //InputWithDynamicSize
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
                onContentSizeChange={handleContentSizeChange}
                
              />
            );
          }
        
        const  HandleMessage = ({data})=>{
            let m = JSON.parse(data);

            if(m.from===login){
                return (
                    <View  style={styles.message}>
                    <Text >{decrypt_self_msg(m.msg)}</Text>
                    <Text style={styles.message_sender}>me</Text>
                    </View>
                )
            }else if (client_key!=='' && m.from!=='SERVER'){
                return (
                    <View  style={styles.message}>
                    <Text >{decrypt_msg(m.msg,client_key)}</Text>
                    <Text style={styles.message_sender}>{m.from}</Text>
                    </View>
                )
            }else{
                return(
                    <View  style={styles.message}>
                    <Text >{m.msg}</Text>
                    <Text style={styles.message_sender}>{m.from}</Text>
                    </View>
                )
            }
        }

        

        return(
            
            <View style={styles.main}>
                <Text title='Chat screen'/>
                <Text >Login is: {login}</Text>
                <Text >Password is: {password}</Text>
                {/* <Text >Your key is is: {privateKey}</Text> */}



                {messages.map((m,index)=>(
                    <HandleMessage key={index} data={m}/>
                ))}

                <TextInput
                    style={{borderColor:'black',borderWidth:1}}
                    onChangeText={e=>setMessage_to(e)}
                    placeholder="Destinition client nick"
                />
                <TextInput
                    style={{borderColor:'black',borderWidth:1}}
                    onChangeText={e=>{
                        setClient_key(e);
                        console.log(client_key);}}
                    placeholder="Destinition client key"
                />
                <Button title="Connect" onPress={connectWebSocket} disabled={socketState} style={{with:40}}/>
                
                <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-start'}}>
                    <Button title="Generate_keys" onPress={generateKeys}  />
                    <Button title="Remove_keys" onPress={remove_RSA_keys}  />
                    <Button title="Copy_key" onPress={CopyPrivKey}  />
                </View>

                <View style={styles.input_section}>
                {InputWithDynamicSize()}
                <Button title="Send" onPress={sendMessage} disabled={!message} style={{flex:2}}/>
                </View>
                <Button
                title="Back to home"
                onPress={() =>
                    navigation.navigate('Login')
                }
                />
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
            maxWidth:'30%'
        },
        message_sender:{
            color:'#212A3E',
            fontSize:10,
            paddingTop:7,
            alignSelf:'flex-end'
        }
      })


export default ChatScreen;