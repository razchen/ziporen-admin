"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/features/users/users.api";
import type { UserDto, UserRole } from "@/features/users/users.types";
import {
  ShieldCheck,
  RefreshCcw,
  Save,
  Undo2,
  Ban,
  CheckCircle2,
  UserCircle2,
} from "lucide-react";

// --- small UI helpers -------------------------------------------------------

function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      variant="outline"
      className={`px-2 ${active ? "bg-emerald-500/15" : "bg-muted"}`}
    >
      {active ? "Status: Active" : "Status: Inactive"}
    </Badge>
  );
}

function VerifiedBadge({ date }: { date: string | null }) {
  const verified = !!date;
  return (
    <Badge
      variant="outline"
      className={`px-2 ${verified ? "bg-emerald-500/15" : "bg-muted"}`}
    >
      {verified ? "Email Verified" : "Unverified"}
    </Badge>
  );
}

const ALL_ROLES: UserRole[] = ["SUPERADMIN", "ADMIN", "USER"];

function useEditableState<T>(value: T) {
  const [local, setLocal] = React.useState(value);

  React.useEffect(() => {
    setLocal(value);
  }, [value]);

  return [local, setLocal] as const;
}

// --- page --------------------------------------------------------------------

export default function UserDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isFetching,
    refetch,
  } = useGetUserQuery(id, {
    skip: !id,
  });
  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation();

  // edit mode
  const [edit, setEdit] = React.useState(false);

  // local form state (mirrors UserDto)
  const [name, setName] = useEditableState<string | null>(user?.name ?? "");
  const [email, setEmail] = useEditableState<string>(user?.email ?? "");
  const [avatarUrl, setAvatarUrl] = useEditableState<string | null>(
    user?.avatarUrl ?? ""
  );
  const [isActive, setIsActive] = useEditableState<boolean>(
    user?.isActive ?? true
  );
  const [roles, setRoles] = useEditableState<UserRole[] | undefined>(
    user?.roles
  );
  const [providerId, setProviderId] = useEditableState<string | null>(
    user?.providerId ?? ""
  );
  const [stripeCustomerId, setStripeCustomerId] = useEditableState<
    string | null
  >(user?.stripeCustomerId ?? "");
  const [subscriptionCredits, setSubscriptionCredits] =
    useEditableState<number>(user?.subscriptionCredits ?? 0);
  const [purchasedCredits, setPurchasedCredits] = useEditableState<number>(
    user?.purchasedCredits ?? 0
  );
  const [notes, setNotes] = React.useState<string>("");

  React.useEffect(() => {
    if (!user) return;
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
  }, [user]);

  const toggleRole = (r: UserRole) => {
    setRoles((curr) => {
      const next = new Set(curr ?? []);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return Array.from(next);
    });
  };

  async function onSave() {
    if (!user) return;
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

    try {
      await updateUser({ id: user.id, data: payload }).unwrap();
      toast.success("User updated");
      setEdit(false);
    } catch (e: any) {
      toast.error(e?.data?.message ?? "Failed to update user");
    }
  }

  function onResetLocal() {
    if (!user) return;
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

  async function onDeactivate() {
    if (!user) return;
    try {
      await updateUser({
        id: user.id,
        data: { isActive: !user.isActive },
      }).unwrap();
      toast.success(user.isActive ? "User deactivated" : "User reactivated");
    } catch {
      toast.error("Failed to update status");
    }
  }

  function sendPasswordReset() {
    // You can wire this to a real endpoint when available.
    toast.info("Password reset email (stub): implement /admin/users/:id/reset");
  }

  if (isLoading || !user) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-72 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-64 animate-pulse rounded bg-muted md:col-span-2" />
          <div className="h-64 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user.avatarUrl && user.avatarUrl.startsWith("http") ? (
            <Image
              src={user.avatarUrl}
              alt={user.name ?? user.email}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <UserCircle2 className="h-10 w-10 text-muted-foreground" />
          )}
          <div>
            <h1 className="text-xl font-semibold">
              User Details: {user.name ?? user.email}
            </h1>
            <p className="text-sm text-muted-foreground">{user.id}</p>
          </div>
        </div>

        <StatusBadge active={user.isActive} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Overview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Profile details, including name, contact, role, and status.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={name ?? ""}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!edit}
                  placeholder="Full name"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!edit}
                />
              </div>

              <div className="space-y-2">
                <Label>Avatar URL</Label>
                <Input
                  value={avatarUrl ?? ""}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  disabled={!edit}
                  placeholder="https://…"
                />
              </div>

              <div className="space-y-2">
                <Label>Provider</Label>
                <Input value={user.provider} disabled />
              </div>

              <div className="space-y-2">
                <Label>Provider ID</Label>
                <Input
                  value={providerId ?? ""}
                  onChange={(e) => setProviderId(e.target.value)}
                  disabled={!edit}
                />
              </div>

              <div className="space-y-2">
                <Label>Stripe Customer ID</Label>
                <Input
                  value={stripeCustomerId ?? ""}
                  onChange={(e) => setStripeCustomerId(e.target.value)}
                  disabled={!edit}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Subscription Credits</Label>
                <Input
                  type="number"
                  value={subscriptionCredits ?? 0}
                  onChange={(e) =>
                    setSubscriptionCredits(Number(e.target.value || 0))
                  }
                  disabled={!edit}
                />
              </div>
              <div className="space-y-2">
                <Label>Purchased Credits</Label>
                <Input
                  type="number"
                  value={purchasedCredits ?? 0}
                  onChange={(e) =>
                    setPurchasedCredits(Number(e.target.value || 0))
                  }
                  disabled={!edit}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Roles</Label>
              <div className="flex flex-wrap gap-3">
                {ALL_ROLES.map((r) => {
                  const lowerRole = r.toLowerCase();
                  return (
                    <label key={r} className="flex items-center gap-2">
                      <Checkbox
                        checked={!!roles?.includes(lowerRole as UserRole)}
                        onCheckedChange={() =>
                          edit && toggleRole(lowerRole as UserRole)
                        }
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes (not saved — wire if you add a column)."
                disabled={!edit}
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {edit ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onResetLocal}
                    className="gap-1"
                  >
                    <Undo2 className="h-4 w-4" /> Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={onSave}
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
                  onClick={() => setEdit(true)}
                  className="gap-1"
                >
                  <ShieldCheck className="h-4 w-4" /> Edit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage necessary user actions including edit, resend email, and
              account deactivation.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Edit Mode</div>
                <p className="text-sm text-muted-foreground">
                  Update the user info by toggling the switch on.
                </p>
              </div>
              <Switch checked={edit} onCheckedChange={setEdit} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Send Password Reset Email</div>
                <p className="text-sm text-muted-foreground">
                  Sends a reset link to the user&apos;s registered email.
                </p>
              </div>
              <Button size="sm" onClick={sendPasswordReset} className="gap-1">
                <RefreshCcw className="h-4 w-4" />
                Send Email
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {user.isActive ? "Deactivate Account" : "Reactivate Account"}
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.isActive
                    ? "Disables the user's account until reactivated."
                    : "Restores access to the user's account."}
                </p>
              </div>
              <Button
                variant={user.isActive ? "destructive" : "default"}
                onClick={onDeactivate}
                className="gap-1"
              >
                {user.isActive ? (
                  <>
                    <Ban className="h-4 w-4" /> Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Reactivate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
