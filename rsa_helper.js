import RSA from "react-native-rsa-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage } from "./clients_mmkv";
import { Alert, Clipboard } from "react-native";



export const RSA_Encrypt = async (text) => {
    // console.log('try encrypt',text.length);
    const pubkey = await AsyncStorage.getItem('public_key')

    const res = await RSA.encrypt(text,pubkey)
    
    return res

    
}

export const RSA_Decrypt = async (text,client_key) => {
    text = JSON.parse(text)
    // console.log('try decrypt',text.msg.length);

    let res = text.msg
    try {
        res = await RSA.decrypt(text.msg,client_key)

        console.log('decrypt_client',res);
        return res
    } catch (error) {
        console.log('decrypt error ',error);
    }
    
    return res
}

export const RSA_Decrypt_self = async (text) => {
    const privkey = await AsyncStorage.getItem('private_key')

    const res = await RSA.decrypt(text,privkey)
    // console.log('decrypt_self',res);
    return res
    
}

export const RSA_Generate = async () => {
    RSA.generateKeys(2048).then(async (keys)=>{
        

        await AsyncStorage.setItem('public_key',keys.public)
        await AsyncStorage.setItem('private_key',keys.private)

        // console.log('[RSA helper ] private:', keys.private); 
        // console.log('[RSA helper ] public:', keys.public); 

        console.log('[RSA helper] Generated new RSA keys');
        Alert.alert('[RSA helper]',' Generated new RSA key')
        // Alert.alert('new RSA keys Generated')
    })
}

export const RSA_Export = async () => {
    console.log('[RSA helper]');
    const pubkey = await AsyncStorage.getItem('public_key')
    const privkey = await AsyncStorage.getItem('private_key')

    
    // console.log('[RSA helper]',pubkey,privkey);
    Clipboard.setString(privkey);
    Alert.alert('[RSA helper]','key copied');
}