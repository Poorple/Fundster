import { createContext,useContext } from "react";
import { UserContextType } from "../interfaces/CommonInterfaces";

export const userContext=createContext<UserContextType|undefined>(undefined)

export function useUserContext(){
    const newUserId= useContext(userContext);

    if(newUserId===undefined){
        throw new Error ("useUserContext must be used with a userContext")
    }

    return newUserId;
}

