"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/features/users/users.api";
import type { UserDto } from "@/features/users/users.types";
import UserHeader from "./_components/UserHeader";
import UserOverviewForm from "./_components/UserOverviewForm";
import UserActionsCard from "./_components/UserActionsCard";
import { useRtkError } from "@/hooks/useRtkError";

export default function UserDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const { data: user, isLoading } = useGetUserQuery(id, { skip: !id });
  const [updateUser, { isLoading: isSaving, error }] = useUpdateUserMutation();

  const [edit, setEdit] = React.useState(false);

  const { toastFromUnknown } = useRtkError(error);

  async function handleSave(payload: Partial<UserDto>) {
    if (!user) return;
    try {
      await updateUser({ id: user.id, data: payload }).unwrap();
      toast.success("User updated");
      setEdit(false);
    } catch (e: unknown) {
      toastFromUnknown(e, "Failed to update user");
    }
  }

  async function handleToggleActive() {
    if (!user) return;
    try {
      await updateUser({
        id: user.id,
        data: { isActive: !user.isActive },
      }).unwrap();
      toast.success(user.isActive ? "User deactivated" : "User reactivated");
    } catch (e: unknown) {
      toastFromUnknown(e, "Failed to update status");
    }
  }

  function handleSendReset() {
    // wire to a real endpoint when available
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
      <UserHeader user={user} />

      <div className="grid gap-6 md:grid-cols-3">
        <UserOverviewForm
          user={user}
          edit={edit}
          onSave={handleSave}
          onSetEdit={setEdit}
          isSaving={isSaving}
        />

        <UserActionsCard
          edit={edit}
          setEdit={setEdit}
          isActive={user.isActive}
          onToggleActive={handleToggleActive}
          onSendReset={handleSendReset}
        />
      </div>
    </div>
  );
}
