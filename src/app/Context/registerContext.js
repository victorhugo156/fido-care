import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function RegisterContextProvider({children}){
    const [currentUser, setCurrentUser] = useState({
        name: null,
        address: null,
        userId: null,
        oneSignalId: null,
      });

    return(
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>

    )

}