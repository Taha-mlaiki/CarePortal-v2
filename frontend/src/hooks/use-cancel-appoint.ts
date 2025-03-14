import {create} from "zustand"

type actions = {
    id:string | undefined,
    isOpen:boolean,
    setOpen:(id:string)=> void,
    setClose:()=> void,
}

export const useCancelAppoint = create<actions>()((set)=> ({
    id:undefined,
    isOpen:false,
    setOpen:(patientId:string)=> set((state)=> ({isOpen:true,id:patientId})),
    setClose:()=> set((state)=> ({isOpen:false,id:undefined}))
}))