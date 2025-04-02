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
import { loginAction } from "@/actions/login";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/SubmitButton";

const FormSchema = z.object({
  email: z.string().email({
    message: "Email is invalid",
  }),
  password: z.string().min(6),
});

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting: isLoading } = form.formState;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {

      const res = await loginAction(data);
      if (res?.success) {
        if (res?.warning !== null) {
          toast.warning(res.warning);
          setTimeout(() => {
            router.push(res.redirect);
          }, 2500);
        }else {
          toast.success(res.success);
          router.push(res.redirect);
        }
      }else if(res.error){
        console.log(res.error)
        toast.error(res.error)
      }else {
        console.log(res);
      }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
