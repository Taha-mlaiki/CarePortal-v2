"use client"
import { ArrowBigLeft, ArrowBigLeftDash } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"


export const BackButton = ()=>{
    const router = useRouter()
    return (
        <Button 
        onClick={()=> router.back()}
        variant="outline" className="gap-x-2 group">
            <ArrowBigLeftDash className="w-5 h-5 transition group-hover:-translate-x-2" />
            Back
        </Button>
    )
}