"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useCreateUserMutation } from "@/features/users/users.api";
import type { UserRole } from "@/features/users/users.types";

const schema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Enter a valid email"),
    role: z.custom<UserRole>(),
    password: z.string().min(8, "Min 8 characters"),
    confirmPassword: z.string().min(8, "Min 8 characters"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateUserFormValues = z.infer<typeof schema>;

export default function CreateUserDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onCreated?: () => void; // e.g., refetch list
}) {
  const [showPwd, setShowPwd] = React.useState(false);
  const [showPwd2, setShowPwd2] = React.useState(false);
  const ROLE_OPTIONS = ["user", "admin"];

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      password: "",
      confirmPassword: "",
    },
  });

  const [createUser, { isLoading }] = useCreateUserMutation();

  async function onSubmit(values: CreateUserFormValues) {
    try {
      // Adapt payload keys to your backend DTO
      await createUser({
        name: values.name,
        email: values.email,
        role: values.role,
        password: values.password,
      }).unwrap();

      toast.success("User created");
      onOpenChange(false);
      form.reset();
      onCreated?.();
    } catch (err: any) {
      const msg =
        err?.data?.message ??
        err?.message ??
        "Failed to create user. Please try again.";
      toast.error(msg);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (isLoading ? null : onOpenChange(v))}
    >
      <DialogContent
        className="sm:max-w-lg"
        onInteractOutside={(e) => (isLoading ? e.preventDefault() : undefined)}
      >
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create new user here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-user-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              aria-invalid={!!form.formState.errors.name}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              aria-invalid={!!form.formState.errors.email}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select
              value={form.watch("role")}
              onValueChange={(v: UserRole) =>
                form.setValue("role", v, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  {...form.register("password")}
                  aria-invalid={!!form.formState.errors.password}
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPwd2 ? "text" : "password"}
                  {...form.register("confirmPassword")}
                  aria-invalid={!!form.formState.errors.confirmPassword}
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd2((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  aria-label={showPwd2 ? "Hide password" : "Show password"}
                >
                  {showPwd2 ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button form="create-user-form" type="submit" disabled={isLoading}>
            {isLoading ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
