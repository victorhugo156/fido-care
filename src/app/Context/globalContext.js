import { createContext, useState } from 'react';

export const Context = createContext({});

export function ContextProvider({children}){

    const [service, setService] = useState("Select Service");
    const [petInfo, setPetInfo] = useState({service: null, size: null})

    return(
        <Context.Provider value={{ service, setService, petInfo, setPetInfo }}>
            {children}
      </Context.Provider>

    )

}
