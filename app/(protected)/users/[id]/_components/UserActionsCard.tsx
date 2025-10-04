"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Ban, CheckCircle2, RefreshCcw } from "lucide-react";

type Props = {
  edit: boolean;
  setEdit: (v: boolean) => void;
  isActive: boolean;
  onToggleActive: () => void;
  onSendReset: () => void;
};

export default function UserActionsCard({
  edit,
  setEdit,
  isActive,
  onToggleActive,
  onSendReset,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage edit mode, send reset email, or (de)activate the account.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Edit Mode</div>
            <p className="text-sm text-muted-foreground">
              Toggle to update the user info.
            </p>
          </div>
          <Switch checked={edit} onCheckedChange={setEdit} />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Send Password Reset Email</div>
            <p className="text-sm text-muted-foreground">
              Sends a reset link to the user&apos;s email.
            </p>
          </div>
          <Button size="sm" onClick={onSendReset} className="gap-1">
            <RefreshCcw className="h-4 w-4" />
            Send Email
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">
              {isActive ? "Deactivate Account" : "Reactivate Account"}
            </div>
            <p className="text-sm text-muted-foreground">
              {isActive
                ? "Disables the user's account until reactivated."
                : "Restores access to the user's account."}
            </p>
          </div>
          <Button
            variant={isActive ? "destructive" : "default"}
            onClick={onToggleActive}
            className="gap-1"
          >
            {isActive ? (
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
  );
}
