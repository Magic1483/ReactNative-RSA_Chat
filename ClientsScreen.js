import { View, Text, ScrollView, Pressable } from 'react-native'
import { useIsFocused } from '@react-navigation/native';  
import React, { useEffect, useState } from 'react'
// import db from './Database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from './clients_mmkv';
import ChatScreen from './ChatScreen';
import ContextMenu from 'react-native-context-menu-view';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import AddClient from './AddClient';

const ClientSection = (props) => {

    handlePress = async () => {
      props.set_dest_client(props.name)
      // await AsyncStorage.setItem('to',props.name)
      // props.navigation.navigate('Chat',{title:props.name})
    }



    return (
      <ContextMenu 
        actions={[{title:'Delete'}]}
        onPress={(e)=>console.log(e.nativeEvent.name)}
        >
        <View className="w-1/5 bg-white w-11/12 m-auto mt-2 h-16 justify-center rounded" >
          <Pressable onPress={handlePress} >
            <Text className="text-lg ml-2 text-black font-semibold">{props.name}</Text>
          </Pressable>
        </View>
      </ContextMenu>
    )
}

const ClientsScreen = ({navigation,nick,messages,setMessages,websocket}) => {
  
  const [clients,setClients] = useState([]);
  const isFocused = useIsFocused();
  const [dest_client,set_dest_client] = useState(null)
  const [isEdit,setIsEdit] = useState(false)

  const DeleteClient = () => {
    storage.delete(dest_client)
    set_dest_client(null)
    const res = storage.getAllKeys()
    setClients(res)
  }
  
  useEffect(()=>{
      const res = storage.getAllKeys()
      console.log(dest_client);
      set_dest_client(null)
      setClients(res)
      
      
  },[isFocused])

  useEffect(()=>{
    console.log('isEdit',isEdit);
    if (dest_client!=null && isEdit==false){
      navigation.setOptions({
        headerTitle: () => (
          <View className="m-auto">
            <Text style={{ color: 'black', fontSize: 18, marginRight: 10 }}>{dest_client}</Text>
            
          </View>
        ),
        headerLeft: () => (
          <View className="ml-4">
          <Button
            
            onPress={() => {
              set_dest_client(null)
            }}
            title="Back"
            color="black"
          /></View>
        ),
        headerRight:()=>(
          <ContextMenu 
            className='mr-4'
            actions={[{title:'Delete'},{title:'Edit'}]}
            onPress={(e)=>{
              const action = e.nativeEvent.name;
              console.log(action);
              if (action=='Delete'){
                DeleteClient()
              } else if (action=='Edit'){
                setIsEdit(true)
              }
            }}
            >
              <Entypo name="dots-three-vertical" size={24} color="black" />
          </ContextMenu>
        )
      })
    } else if (isEdit==true){
      navigation.setOptions({
        title:'Edit '+dest_client,
        headerTitle: null,
        headerLeft: null,
        headerRight:null
      })
    }
    else{
      navigation.setOptions({
        title:'Clients',
        headerTitle: null,
        headerLeft: null,
        headerRight:null
      })
    }
  },[dest_client,isEdit])

  if (dest_client){
    if (!isEdit){
      return (
        <ChatScreen dest_client={dest_client} set_dest_client={set_dest_client} messages={messages} setMessages={setMessages} websocket={websocket} navigation={navigation}/>
      )
    }else{
      return (
        <AddClient mode='edit' dest_client={dest_client} setIsEdit={setIsEdit} />
      )
    }
    
  }

  

  return (
    <View className=" flex flex-col">
        <ScrollView className="mt-2">
          {clients.map((el,ind)=>(
            <ClientSection name={el}  navigation={navigation} key={ind} set_dest_client={set_dest_client} setIsEdit={setIsEdit} />
          ))}
        </ScrollView>
      
    </View>
  )
}

export default ClientsScreen