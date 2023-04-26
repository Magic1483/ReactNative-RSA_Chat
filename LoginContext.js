import React,{createContext,useState} from "react";

export const LoginContext = React.createContext();

export const LoginContextProvider=({children})=>{
    const [login,setLogin] = useState('non');
    const [password,setPassword] = useState('non');

    return(
        <LoginContext.Provider value={{login,setLogin,password,setPassword}}>
            {children}
        </LoginContext.Provider>
    );
}