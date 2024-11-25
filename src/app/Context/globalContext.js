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
        locationPicked: null});
    const [bookingDetails, setBookingDetails] = useState({
        petOwnerId: null,
        petSitterId: null,
        status: null,
        title: null,
        date: null,
        petName: null,
        time: null});

    return(
        <Context.Provider value={{ 
            service, setService, 
            petInfo, setPetInfo, 
            filter, setFilter,
            sourceScreen, setSourceScreen,
            bookingDetails, setBookingDetails}}>
            {children}
      </Context.Provider>

    )

}
