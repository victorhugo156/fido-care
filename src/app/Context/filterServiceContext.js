import { createContext, useState } from 'react';

export const FilterServiceContext = createContext({});

export function FilterServiceContextProvider({children}){

    const [service, setService] = useState("Select Service");

    return(
        <FilterServiceContext.Provider value={{ service, setService }}>
            {children}
      </FilterServiceContext.Provider>

    )

}
