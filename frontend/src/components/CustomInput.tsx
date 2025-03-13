"use client"
import { LucideIcon } from "lucide-react";
import { Control } from "react-hook-form";
import { Input } from "./ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { cn } from "@/lib/utils";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Textarea } from "./ui/textarea";

interface customInputProps {
  type: "text" | "tel" | "email"|"textarea";
  disabled?:boolean,
  className?: string;
  name: string;
  label?: string;
  control: Control<any>;
  Icon?: LucideIcon;
  placeholder?: string;
  loading?:boolean
}

const RenderInput = ({ field ,props }: { field: any ,props:customInputProps}) => {

    const {type,Icon,placeholder,className,loading,disabled} = props
  switch (type) {
    case "text":
      return (
        <div className="border rounded-sm flex items-center ">
          {Icon && <Icon className="w-5 mx-2 h-5 text-neutral-700" />}
          <Input
            disabled={loading||disabled}
            type={type}
            placeholder={placeholder}
            {...field}
            className={cn("customInput", className)}
          />
        </div>
      );
    case "email":
      return (
        <div className="border rounded-sm flex items-center ">
          {Icon && <Icon className="w-5 mx-2 h-5 text-neutral-700" />}
          <Input
          disabled={loading||disabled}
            type={type}
            placeholder={placeholder}
            {...field}
            className={cn("customInput", className)}
          />
        </div>
      );
    case "textarea":
      return (
        <div className="border rounded-sm flex items-start ">
          {Icon && <Icon className="w-5 mx-2 mt-2 h-5 text-neutral-700" />}
          <Textarea
            disabled={loading||disabled}
            placeholder={placeholder}
            {...field}
            className={cn("customInput", className)}
          />
        </div>
      );
    case "tel":
      return (
        <div className="border rounded-sm flex items-center ">
          <PhoneInput
            disabled={loading||disabled}
            placeholder={placeholder}
            value={field.value}
            onChange={(e)=> field.onChange(e)}
            defaultCountry="MA"
            international
            countryCallingCodeEditable
            className="px-2 py-2 phoneInput--focus:outline-none focus:ring-blue-400"
          />
        </div>
      );
  }
};

export const CustomInput = (props: customInputProps) => {
    
    const {control,name,label} = props


  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <RenderInput field={field} props={props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
