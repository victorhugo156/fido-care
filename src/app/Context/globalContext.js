import { createContext, useState } from 'react';

export const Context = createContext({});

export function ContextProvider({children}){

    const [service, setService] = useState("Select Service");
    const [sourceScreen, setSourceScreen] = useState("");
    const [petInfo, setPetInfo] = useState({service: null, size: null})
    const [filter, setFilter]=useState({
        servicePicked: null, 
        pricePicked:  null,
        datePicked: null, 
        locationPicked: null})

    return(
        <Context.Provider value={{ 
            service, setService, 
            petInfo, setPetInfo, 
            filter, setFilter,
            sourceScreen, setSourceScreen }}>
            {children}
      </Context.Provider>

    )

}
