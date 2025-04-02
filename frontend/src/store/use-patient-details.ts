import {create} from "zustand"

type actions = {
    id:string | undefined,
    isOpen:boolean,
    setOpen:(id:string)=> void,
    setClose:()=> void,
}

export const usePatientDetails = create<actions>()((set)=> ({
    id:undefined,
    isOpen:false,
    setOpen:(patientId:string)=> set(()=> ({isOpen:true,id:patientId})),
    setClose:()=> set(()=> ({isOpen:false,id:undefined}))
}))