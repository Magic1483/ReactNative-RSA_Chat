import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext,useState ,useEffect} from "react";
import { Button, StyleSheet,Text,View ,TextInput, Alert} from "react-native";
import bcrypt from 'react-native-bcrypt'
import isaac from 'isaac'
// import { LoginContext } from "./LoginContext";
import RegisterScreen from "./RegisterScreen";



function LoginScreen ({set_is_login}) {

        bcrypt.setRandomFallback((len) => {
            const buf = new Uint8Array(len);
        
            return buf.map(() => Math.floor(isaac.random() * 256));
        });
    
        const [login,setLogin] = useState('');
        const [password,setPassword] = useState('');

        const [reg,set_reg] = useState(false) // is regisster modal open 
        
        


        async function Enter() {
            if (password!='' && login!=''){
                console.log(password,login);
                const hash =  await AsyncStorage.getItem('pass');
                const nick =  await AsyncStorage.getItem('nick');
                console.log('hash is ',hash);

                bcrypt.compare(password,hash,async (err,res)=> { 
                    console.log(res);
                    if (res==true && login==nick){
                        await AsyncStorage.setItem('isLogin','true')
                        set_is_login(true)
                        
                    }
                })

            }
        }


        
    
        if (reg){
            return (
                <RegisterScreen set_reg={set_reg} />
            )
        }

        return(
            <View className="flex flex-col items-center h-full">
                <View className="flex flex-col w-2/3 m-auto justify-evenly h-64">
                <Text title='Login Page'/>
                {/* <Text className="text-red-700">{login}</Text> */}
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
                    title="Login"
                    color={'#394867'}
                    onPress={()=>Enter()}
                />
                <Text className="" onPress={()=>set_reg(true)}>
                    Register
                </Text>
                </View>
            </View>
        )
    
}




export default LoginScreen;