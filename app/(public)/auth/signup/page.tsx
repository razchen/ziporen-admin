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

export default function SignUpPage() {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [confirmVisible, setConfirmVisible] = React.useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire up your auth submit
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground grid place-items-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 h-9 w-9 rounded-full grid place-items-center border">
            {/* minimal logo mark */}
            <span className="text-sm font-semibold">S</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            Ziporen - Sign Up
          </h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your email and password to create an account. Already have
              an account?{" "}
              <Link href="#" className="underline underline-offset-4">
                Log in
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="********"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    aria-label={
                      passwordVisible ? "Hide password" : "Show password"
                    }
                    onClick={() => setPasswordVisible((v) => !v)}
                    className="absolute inset-y-0 right-0 grid place-items-center px-3"
                  >
                    {passwordVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    type={confirmVisible ? "text" : "password"}
                    placeholder="********"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    aria-label={
                      confirmVisible ? "Hide password" : "Show password"
                    }
                    onClick={() => setConfirmVisible((v) => !v)}
                    className="absolute inset-y-0 right-0 grid place-items-center px-3"
                  >
                    {confirmVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>

              <p className="text-xs leading-relaxed text-muted-foreground">
                By creating an account, you agree to our{" "}
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
