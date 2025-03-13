import { cn } from "@/lib/utils"


export const Container = ({children,className}:{children:React.ReactNode,className?:string})=>{
    return (
        <div className={cn("max-w-7xl mx-auto px-5 2xl:px-0",className)}>
            {children}
        </div>
    )
}