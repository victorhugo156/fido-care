import React, { useContext } from 'react';
import { FilterServiceContext } from '../Context/filterServiceContext';

export  function useFilterServiceContext(){
    const context = useContext(FilterServiceContext);

    if(context === undefined){
        throw new Error("Out of Context")
    }

    return context;
}
