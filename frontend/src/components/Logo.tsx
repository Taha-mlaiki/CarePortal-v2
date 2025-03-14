import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"


export const Logo = ({className}:{className?:string})=>{
    return (
        <Link href="/" className={cn("flex items-center gap-x-3",className)}>
            <Image width={50} height={50} src="/logoCare.png" alt="logo" className="rounded-lg" />
            <h1 className="font-bold text-xl">CarePortal</h1>
        </Link>
    )
}