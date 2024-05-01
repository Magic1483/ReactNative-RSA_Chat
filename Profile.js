import { View, Text, Button, Pressable,Clipboard, Alert,TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RSAKey from 'react-native-rsa';
import { storage } from './clients_mmkv';
import {RSA_Export,RSA_Generate} from './rsa_helper'

const generateKeys = async () => {
  const rsa = new RSAKey();

  await rsa.generate(256, '10001');

  const publicKey = rsa.getPublicString();
  const privateKey = rsa.getPrivateString();

  await AsyncStorage.setItem('public_key',publicKey)
  await AsyncStorage.setItem('private_key',privateKey)

  console.log('[PROFILE] Generated new RSA keys');
  Alert.alert('new RSA keys Generated')
};

const remove_RSA_keys = async()=>{
  try {
      await AsyncStorage.removeItem('public_key');
      await AsyncStorage.removeItem('private_key');
      console.log('[PROFILE] remove RSA keys');
  } catch (error) {
      console.log(error);
  }
}

const Profile = ({navigation,set_is_login,connected,set_connected,set_server_addr,websocket,set_websocket}) => {

    const [nick,set_nick] = useState('')
    const [server_addr,setServer_addr] = useState('')

    useEffect(()=>{
        get_info = async () => {
            const res = await AsyncStorage.getItem('nick')
            const servAddr = await AsyncStorage.getItem('serv_addr')
            if (servAddr == null){
                setServer_addr("ws://127.0.0.1:9000")
            }else {
                setServer_addr(servAddr.slice(1,-1))
            }
            set_nick(res)
            
        }
        
        get_info()
    },[])
    

    

    
    const changeServerAddr = async () => {
        await AsyncStorage.setItem('serv_addr',JSON.stringify(server_addr))
        console.log('[PROFILE] Close websoket');
        websocket.close()
        set_server_addr(server_addr)
        console.log('[PROFILE] Change server addr to',server_addr);
        Alert.alert('Server address changed!')
    }

    const exit = async () => {
        console.log('exit');
        await AsyncStorage.setItem('isLogin','false')
        set_is_login(false)
    }


    deleteProfile = async () => {
        console.log('deleteProfile');
        await AsyncStorage.clear()
        
        await AsyncStorage.setItem('isLogin','false')
        storage.clearAll()
        
        set_is_login(false)


    }

  return (
    <View className="flex flex-col ml-2 h-full ">
        <View className="flex flex-row justify-between items-end w-5/6">
            <Text className="text-lg mt-4">{nick}</Text>
            {connected ? (<Text className="text-green-500 font-semibold text-md">Connected</Text>) : (<Text className="text-red-500 font-semibold text-md">Server Down</Text>)}

        </View>

      <Text className="text-lg mr-4 font-semibold text-black">Current Server</Text>
      <View className="flex flex-row h-9 w-full">
        <TextInput value={server_addr} onChangeText={(e)=>setServer_addr(e)} className="border  w-64 mr-4"/>
        <Button title='Change' onPress={()=>changeServerAddr()}/>
      </View>

      <Pressable className="w-32 mt-4">
          <Button title='Generate Keys'   onPress={RSA_Generate} ></Button>
      </Pressable>


      <Pressable className="w-32 mt-4">
          <Button title='Copy Priv Key'   onPress={RSA_Export} ></Button>
      </Pressable>

      <Pressable className="w-32 mt-4">
          <Button title='Exit'   onPress={exit} ></Button>
      </Pressable>

      <Pressable className="w-32 mt-4">
          <Button title='Delete Profile' color="#8a1616"   onPress={deleteProfile} ></Button>
      </Pressable>
    </View>
  )
}

export default Profile