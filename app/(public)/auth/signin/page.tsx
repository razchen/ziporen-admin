"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// form + validation
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// rtk query
import { useLoginMutation } from "@/features/auth/auth.api";
import { useRtkError } from "@/hooks/useRtkError";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();
  const { toastFromUnknown } = useRtkError(error);

  const [show, setShow] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values).unwrap();
      router.replace("/dashboard");
    } catch (e) {
      toastFromUnknown(e, "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground grid place-items-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 h-9 w-9 rounded-full grid place-items-center border">
            <span className="text-sm font-semibold">S</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            Ziporen – Login
          </h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your email and password below to log into your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-sm underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    placeholder="********"
                    autoComplete="current-password"
                    className="pr-10"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow((v) => !v)}
                    className="absolute inset-y-0 right-0 grid place-items-center px-3"
                  >
                    {show ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in…" : "Login"}
              </Button>

              <p className="text-xs leading-relaxed text-muted-foreground">
                By clicking login, you agree to our{" "}
                <Link href="#" className="underline underline-offset-4">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline underline-offset-4">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
