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
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useCreateUserMutation } from "@/features/users/users.api";
import type { UserRole } from "@/features/users/users.types";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRtkError } from "@/hooks/useRtkError";

const ALL_ROLES = ["SUPERADMIN", "ADMIN", "USER"] as const;
const RoleEnum = z.enum(ALL_ROLES);

const schema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Enter a valid email"),
    roles: z.array(RoleEnum).min(1, "Pick at least one role"),

    isActive: z.boolean(),

    subscriptionCredits: z.number().int().min(0),
    purchasedCredits: z.number().int().min(0),

    avatarUrl: z
      .string()
      .trim()
      .url("Enter a valid URL")
      .optional()
      .or(z.literal("")),
    notes: z.string().max(2000).optional().or(z.literal("")),

    password: z.string().min(8, "Min 8 characters"),
    confirmPassword: z.string().min(8, "Min 8 characters"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CreateUserFormValues = z.output<typeof schema>;

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

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      roles: ["USER"],
      isActive: true,
      subscriptionCredits: 0,
      purchasedCredits: 0,
      avatarUrl: "",
      notes: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [createUser, { isLoading, error }] = useCreateUserMutation();
  const { toastFromUnknown } = useRtkError(error);

  async function onSubmit(values: CreateUserFormValues) {
    try {
      await createUser({
        name: values.name,
        email: values.email,
        roles: values.roles,
        isActive: values.isActive,
        avatarUrl: values.avatarUrl || null,
        subscriptionCredits: values.subscriptionCredits,
        purchasedCredits: values.purchasedCredits,
        notes: values.notes ?? "",
        password: values.password,
      }).unwrap();

      toast.success("User created");
      onOpenChange(false);
      form.reset();
      onCreated?.();
    } catch (e: unknown) {
      toastFromUnknown(e);
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
            <Label>Roles</Label>
            <div className="flex flex-wrap gap-3">
              {ALL_ROLES.map((r) => {
                const checked = form.watch("roles")?.includes(r) ?? false;
                return (
                  <label key={r} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={checked}
                      onChange={() => {
                        const current = new Set(form.getValues("roles") ?? []);
                        if (current.has(r)) current.delete(r);
                        else current.add(r);
                        form.setValue(
                          "roles",
                          Array.from(current) as UserRole[],
                          { shouldValidate: true }
                        );
                      }}
                    />
                    <span className="text-sm">
                      {r.charAt(0) + r.slice(1).toLowerCase()}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Label className="mr-2">Active</Label>
            <Switch
              checked={form.watch("isActive")}
              onCheckedChange={(v) =>
                form.setValue("isActive", v, { shouldValidate: true })
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input
              id="avatarUrl"
              {...form.register("avatarUrl")}
              placeholder="https://…"
            />
            {form.formState.errors.avatarUrl && (
              <p className="text-xs text-destructive">
                {form.formState.errors.avatarUrl.message}
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="subscriptionCredits">Subscription Credits</Label>
              <Input
                id="subscriptionCredits"
                type="number"
                {...form.register("subscriptionCredits", {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="purchasedCredits">Purchased Credits</Label>
              <Input
                id="purchasedCredits"
                type="number"
                {...form.register("purchasedCredits", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Internal notes…"
            />
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
