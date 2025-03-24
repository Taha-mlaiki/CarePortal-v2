"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerAction } from "@/actions/register";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SubmitButton } from "@/components/SubmitButton";

const FormSchema = z
  .object({
    username: z.string().min(4).max(50),
    email: z.string().email({
      message: "Email is invalid",
    }),
    role: z.enum(["patient", "manager"]),
    qualifications: z.string().optional(),
    password: z.string().min(6),
    phone_number: z
      .string()
      .regex(/^(\+?\d{1,3}\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4})$/, {
        message: "Phone number is invalid",
      }),
  })
  .refine(
    (data) => {
      if (data.role === "manager") {
        return data.qualifications !== "" && data.qualifications !== undefined;
      }
      return true;
    },
    {
      message: "qualifications  is required as a manager",
      path: ["qualifications"],
    }
  );

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting:isLoading } = form.formState;

  const selectedRole = form.watch("role");

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const res = await registerAction(data);
      if (res?.success) {
        toast.success(res.success);
        if (res?.role === "patient") {
          router.push("/patient/dashboard");
        } else if (res?.role === "manager") {
          router.push("/auth/create-cabinet");
        }
      }
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="john doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <div className="rounded-md border border-neutral-200 shadow-sm">
                      <PhoneInput
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                        defaultCountry="MA"
                        international
                        countryCallingCodeEditable
                        className="p-1.5 customInput phoneInput--focus:outline-none focus:ring-blue-400"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Who are you</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedRole == "manager" && (
            <FormField
              control={form.control}
              name="qualifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualifications</FormLabel>
                  <FormControl>
                    <Input placeholder="qualifications" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@test.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton className="w-full" loading={isLoading} variant="brand">
            Submit
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
}
