import { Loader2 } from "lucide-react"
import { Button, ButtonProps } from "./ui/button"

interface SubmitButtonProps {
    children:React.ReactNode,
    disabled?:boolean,
    loading?:boolean,
    className?:string,
    variant?:"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "brand",
    size?: "default" | "sm" | "lg" | "icon" | null | undefined
}

export const SubmitButton = ({loading,className,children,variant = "brand",size,disabled}:SubmitButtonProps)=>{
    return (
        <Button
        type="submit"
        size={size}
        disabled={disabled || loading}
        variant={variant}
        className={className}
        >
            {loading && <Loader2 className="w-5 h-5 animate-spin me-1.5" />}
            {loading ? "Loading..." :
                children
            }
        </Button>
    )
}