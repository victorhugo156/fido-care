import React, { useContext } from 'react';
import { AuthContext } from '../Context/registerContext';

export  function UseRegisterService(){
    const context  = useContext(AuthContext);

    if(context === undefined){
        throw new Error("Out of Context")
    }

    return context ;
}