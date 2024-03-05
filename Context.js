import React,{createContext,useState} from "react";

export const Context = React.createContext();

export const ContextProvider=({children})=>{
    const [messages,setMessages] = useState([])

    return(
        <Context.Provider value={{messages,setMessages}}>
            {children}
        </Context.Provider>
    );
}