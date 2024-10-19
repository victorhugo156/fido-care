import React, { useContext } from 'react';
import { Context } from '../Context/globalContext';

export  function UseContextService(){
    const context = useContext(Context);

    if(context === undefined){
        throw new Error("Out of Context")
    }

    return context;
}