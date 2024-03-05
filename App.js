
import React ,{useContext, useEffect, useState} from 'react';
import { Alert, Button, StyleSheet, Text } from 'react-native';

import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginScreen from './LoginScreen'
import ChatScreen from './ChatScreen'
import ClientsScreen from './ClientsScreen';
import AddClient from './AddClient';
import { ConnectWebsocket,SendMessage } from './webserviceServiceF';
import Profile from './Profile';
import { storage } from './clients_mmkv';

function App() {

  
  // todo DATABASE SECTION------
  

  useEffect(()=>{
    const res = storage.getAllKeys()
    console.log(res);

  },[])
  
  
  const get_addr = async () => {
    const res = await AsyncStorage.getItem('serv_addr')
    return res
  }

  // todo DATABASE SECTION------
  
  
  const Drawer = createDrawerNavigator();
  const [isLogin , set_is_login] = useState(false)
  const [connected,set_connected] = useState(false)
  const [nick,set_nick] = useState('')

  const [messages,setMessages] = useState([])//saved Messages
  const [websocket,set_websocket] = useState([])//saved Messages

  useEffect(()=>{
    const getstate = async () =>{
      const is_login = await AsyncStorage.getItem('isLogin')
      const nick = await AsyncStorage.getItem('nick')
      set_nick(nick)

      console.log('[App] login status',is_login);
      console.log('[App] conn status ',connected);

      if (is_login == 'true' && connected==false){

        const addr = await get_addr();
        set_is_login(true)
        set_websocket(ConnectWebsocket(nick,setMessages,set_connected,addr))
        

      }

      

    }

    getstate()
  },[])



  useEffect(()=>{
    const check_keys = async () => {
      const pubkey = await AsyncStorage.getItem('public_key')
      const privkey =await AsyncStorage.getItem('private_key')

      if(pubkey==null || privkey==null){
        Alert.alert('WARNING KEYS NOT GENERATED')
      }
    }

    check_keys()
  },[])


  
  if (isLogin==false){
    return (
      <LoginScreen set_is_login={set_is_login} />
    )
  }else{
    return (
        <NavigationContainer>
          <Drawer.Navigator screenOptions={{headerShown:true,swipeEnabled:isLogin}}  >

            <Drawer.Screen name='Clients'>
              {props => <ClientsScreen {...props} nick={nick} messages={messages} setMessages={setMessages} websocket={websocket} />} 
            </Drawer.Screen>

            {/* <Drawer.Screen name='Chat' component={ChatScreen} options={({ route }) => ({ title: route.params?.title || 'Chat' ,drawerItemStyle: { height: 0 }})} /> */}
            <Drawer.Screen name='AddClient' component={AddClient}/>
            <Drawer.Screen name='Profile'>
              {props => <Profile {...props} set_is_login={set_is_login} connected={connected}/>}
            </Drawer.Screen>
            
            
          </Drawer.Navigator>
        </NavigationContainer>
  )
  }

  
}



export default App;
