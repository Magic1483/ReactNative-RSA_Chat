import { View, Text,TextInput ,Button, Alert} from 'react-native'
import { useState } from 'react';
import React from 'react'
import bcrypt from 'react-native-bcrypt'
import isaac from "isaac";
import AsyncStorage from "@react-native-async-storage/async-storage";





const RegisterScreen = (props) => {

    

    bcrypt.setRandomFallback((len) => {
        const buf = new Uint8Array(len);
    
        return buf.map(() => Math.floor(isaac.random() * 256));
    });


    const [login,setLogin] = useState('');
    const [password,setPassword] = useState('');
    

    const getHash = async () => {
        const hash = await AsyncStorage.getItem('pass')
        console.log('hash is',hash);
        return hash
    }

    const Reg =  async () => { 
        // Alert.alert(login,password)

        if (password!='' && login!=''){

            
            await bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, async function(err, hash) {
                    console.log('save new hash',hash);
                    await AsyncStorage.setItem('pass',hash)
                    await AsyncStorage.setItem('nick',login)
                    props.set_reg(false)
                });
            })
            
   
        }
    }
    
    return (
        <View className="flex flex-col items-center h-full">
            <View className="flex flex-col w-2/3 m-auto justify-evenly h-64">
            <Text title='Register Page'/>
                <TextInput 
                    className="border rounded-xl"
                    placeholder="login"
                    onChangeText={(e)=>setLogin(e)}/>
                <TextInput 
                    className="border rounded-xl"
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(e)=>setPassword(e)}/>
                <Button
                    title="Register"
                    color={'#394867'}
                    onPress={()=>Reg()}
                />
            </View>
        </View>
  )
}

export default RegisterScreen