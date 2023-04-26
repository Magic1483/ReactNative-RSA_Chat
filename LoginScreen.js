import React, { useContext,useState } from "react";
import { Button, StyleSheet,Text,View ,TextInput, Alert} from "react-native";
import { LoginContext } from "./LoginContext";

function LoginScreen ({navigation}) {
        
    
        const {login,setLogin} = useContext(LoginContext);
        const {password,setPassword} = useContext(LoginContext);
    

        return(
            <View style={styles.main}>
                <View style={styles.sub}>
                <Text title='Login Page'/>
                <Text >{login}</Text>
                <TextInput 
                    placeholder="your login"
                    style={styles.text_IN}
                    onChangeText={(e)=>setLogin(e)}/>
                <TextInput 
                    placeholder="your password"
                    style={styles.text_IN}
                    onChangeText={(e)=>setPassword(e)}/>
                <Button
                    title="Login"
                    color={'#394867'}
                    onPress={()=>
                            { 
                                    if (password!='non' && login!='non') {
                                    navigation.navigate('Chat');
                                }else{
                                    Alert.alert("password or login is empty")
                                }
                            }}
                />
                </View>
            </View>
        )
    
}



const styles = StyleSheet.create({
    main:{
        display:"flex",
        flex:2,
        // flexDirection:'column',
        justifyContent:'center',
        padding:10
    },
    sub:{
        display:'flex',
        justifyContent:'space-evenly',
        height:150,
        // backgroundColor:'red'
    },
    text_IN:{
        backgroundColor:'#9BA4B5',
        borderRadius:10,
        padding:5,
        textAlign:'center'
    },
    btn_standart:{
        backgroundColor:'#394867',
        color:'#394867'
    }
})

export default LoginScreen;