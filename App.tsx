import React ,{useState} from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import ChatScreen from './ChatScreen';
import { LoginContext, LoginContextProvider } from './LoginContext';



const Stack = createStackNavigator();




const App = ()=>{
  //RSA Encryption
  
  


  // context
  // constructor(props){
  //   super(props)
  //   this.state={
  //     login:'',
  //     password:''
  //   }
  // }

  // addCredintails=(log,pass)=>{
  //   const{
  //     login,
  //     password
  //   }=this.state

    
  //   password=pass

  //   this.state({
  //     login,
  //     password,
  //   })
  // }

  


    
    return(
      <LoginContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Login'
            component={LoginScreen}
            options={{title:"Login"}}
            />
            <Stack.Screen
            name='Chat'
            component={ChatScreen}
            options={{title:"Chat",headerLeft:null}}
            />
        </Stack.Navigator>
      </NavigationContainer>
    </LoginContextProvider>
    )
  
};

export default App;