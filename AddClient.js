import { View, Text ,TextInput,Button, Pressable} from 'react-native'
import React, {  useEffect, useState } from 'react'
import { storage } from './clients_mmkv'
import AsyncStorage from '@react-native-async-storage/async-storage'


const AddClient = (props) => {


    const [key,set_key] = useState('')
    const [nick,set_nick] = useState('')

    useEffect(()=>{
        if (props.mode=='edit'){
            const client = JSON.parse(storage.getString(props.dest_client))
            set_nick(client.nick);
            set_key(client.key)
        }
    },[])

    const Add = () =>{
        const Client = {
            nick: nick,
            key:key,
            messages:[ ]
        }
        console.log('add client',Client);

        storage.set(nick,JSON.stringify(Client))

        set_nick('')
        set_key('')
        
    }

    const Edit = async () =>{
        
        // console.log('edit client',props.dest_client);
        let client = JSON.parse(storage.getString(props.dest_client))

        client.key = key

        console.log(client);
        
        storage.set(nick,JSON.stringify(client))

        props.setIsEdit(false)
        console.log('edit client',props.dest_client);

        
    }


    

  return (
    <View className="flex flex-col items-center h-full">
            <View className="flex flex-col w-2/3 m-auto justify-evenly h-72">
            <Text title='Add Client'/>
                
                <TextInput 
                    className="border rounded-xl"
                    placeholder="Nick"
                    value={nick}
                    onChangeText={(e)=>set_nick(e)}/>
                <TextInput 
                    className="border rounded-xl h-32"
                    placeholder="Private Key"
                    value={key}
                    onChangeText={(e)=>{set_key(e)}}/>
                <Pressable>
                    {props.mode=='edit' ? 
                    (<Button
                        className="mt-16"
                        title="Edit"
                        color={'#394867'}
                        onPress={Edit}
                    />) : 
                    (<Button
                        className="mt-16"
                        title="Add"
                        color={'#394867'}
                        onPress={Add}
                    />
                    )}
                </Pressable>
            </View>
    </View>
  )
}

export default AddClient