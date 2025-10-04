"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Undo2, ShieldCheck } from "lucide-react";
import type { UserDto, UserRole } from "@/features/users/users.types";
import { VerifiedBadge } from "./Badges";
import { useEditableState, capitalize } from "./hooks";

type Props = {
  user: UserDto;
  edit: boolean;
  isSaving: boolean;
  onSetEdit: (v: boolean) => void;
  onSave: (payload: Partial<UserDto>) => void;
};

const ALL_ROLES: UserRole[] = ["SUPERADMIN", "ADMIN", "USER"];

export default function UserOverviewForm({
  user,
  edit,
  isSaving,
  onSetEdit,
  onSave,
}: Props) {
  // local editable state
  const [name, setName] = useEditableState<string | null>(user.name ?? "");
  const [email, setEmail] = useEditableState<string>(user.email);
  const [avatarUrl, setAvatarUrl] = useEditableState<string | null>(
    user.avatarUrl ?? ""
  );
  const [isActive, setIsActive] = useEditableState<boolean>(user.isActive);
  const [roles, setRoles] = useEditableState<UserRole[] | undefined>(
    user.roles
  );
  const [providerId, setProviderId] = useEditableState<string | null>(
    user.providerId ?? ""
  );
  const [stripeCustomerId, setStripeCustomerId] = useEditableState<
    string | null
  >(user.stripeCustomerId ?? "");
  const [subscriptionCredits, setSubscriptionCredits] =
    useEditableState<number>(user.subscriptionCredits ?? 0);
  const [purchasedCredits, setPurchasedCredits] = useEditableState<number>(
    user.purchasedCredits ?? 0
  );
  const [notes, setNotes] = useEditableState<string>(user.notes ?? "");

  // role toggle keeps DB lowercase if that’s what you store; adjust if needed
  const toggleRole = (r: UserRole) => {
    setRoles((curr) => {
      const next = new Set(curr ?? []);
      // we store lowercase in DB in your prior code path; convert to lower
      const key = r.toLowerCase() as UserRole;
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return Array.from(next) as UserRole[];
    });
  };

  function resetLocal() {
    setName(user.name ?? "");
    setEmail(user.email);
    setAvatarUrl(user.avatarUrl ?? "");
    setIsActive(user.isActive);
    setRoles(user.roles ?? []);
    setProviderId(user.providerId ?? "");
    setStripeCustomerId(user.stripeCustomerId ?? "");
    setSubscriptionCredits(user.subscriptionCredits ?? 0);
    setPurchasedCredits(user.purchasedCredits ?? 0);
    setNotes(user.notes ?? "");
  }

  function handleSave() {
    const payload: Partial<UserDto> = {
      name: name ?? null,
      email,
      avatarUrl: avatarUrl || null,
      isActive: !!isActive,
      roles: roles ?? [],
      providerId: providerId || null,
      stripeCustomerId: stripeCustomerId || null,
      subscriptionCredits: Number(subscriptionCredits) || 0,
      purchasedCredits: Number(purchasedCredits) || 0,
      notes,
    };
    onSave(payload);
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Profile details, including name, contact, role, and status.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name">
            <Input
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              disabled={!edit}
              placeholder="Full name"
            />
          </Field>

          <Field label="Email">
            <Input
              type="email"
              value={email ?? ""}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!edit}
            />
          </Field>

          <Field label="Avatar URL">
            <Input
              value={avatarUrl ?? ""}
              onChange={(e) => setAvatarUrl(e.target.value)}
              disabled={!edit}
              placeholder="https://…"
            />
          </Field>

          <Field label="Provider">
            <Input value={user.provider} disabled />
          </Field>

          <Field label="Provider ID">
            <Input
              value={providerId ?? ""}
              onChange={(e) => setProviderId(e.target.value)}
              disabled={!edit}
            />
          </Field>

          <Field label="Stripe Customer ID">
            <Input
              value={stripeCustomerId ?? ""}
              onChange={(e) => setStripeCustomerId(e.target.value)}
              disabled={!edit}
            />
          </Field>
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Subscription Credits">
            <Input
              type="number"
              value={subscriptionCredits ?? 0}
              onChange={(e) =>
                setSubscriptionCredits(Number(e.target.value || 0))
              }
              disabled={!edit}
            />
          </Field>

          <Field label="Purchased Credits">
            <Input
              type="number"
              value={purchasedCredits ?? 0}
              onChange={(e) => setPurchasedCredits(Number(e.target.value || 0))}
              disabled={!edit}
            />
          </Field>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label>Roles</Label>
          <div className="flex flex-wrap gap-3">
            {ALL_ROLES.map((r) => {
              const lower = r.toLowerCase() as UserRole;
              const checked = !!roles?.includes(lower);
              return (
                <label key={r} className="flex items-center gap-2">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => edit && toggleRole(r)}
                    disabled={!edit}
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
            checked={!!isActive}
            onCheckedChange={(v) => setIsActive(v)}
            disabled={!edit}
          />
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-muted-foreground">Created: </span>
              {new Date(user.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="text-muted-foreground">Updated: </span>
              {new Date(user.updatedAt).toLocaleString()}
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <VerifiedBadge date={user.emailVerifiedAt} />
              {user.emailVerifiedAt && (
                <span className="text-muted-foreground">
                  {new Date(user.emailVerifiedAt).toLocaleString()}
                </span>
              )}
            </div>
            <div>
              <span className="text-muted-foreground">Last login: </span>
              {user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString()
                : "—"}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Admin Notes</Label>
          <Textarea
            value={notes ?? ""}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes (wire a DB column to persist)."
            disabled={!edit}
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {edit ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={resetLocal}
                className="gap-1"
              >
                <Undo2 className="h-4 w-4" /> Reset
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-1"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving…" : "Save changes"}
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSetEdit(true)}
              className="gap-1"
            >
              <ShieldCheck className="h-4 w-4" /> Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// tiny field wrapper
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
