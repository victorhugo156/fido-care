import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function RegisterContextProvider({children}){
    const [newUser, setNewUser] = useState({
        name: null,
        address: null,
        userId: null,
        oneSignalId: null,
      });

    return(
        <AuthContext.Provider value={{ newUser, setNewUser }}>
            {children}
        </AuthContext.Provider>

    )

}