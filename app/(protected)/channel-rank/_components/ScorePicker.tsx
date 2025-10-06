"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  value?: number | null; // current score if you want to show it
  onChange: (score: number) => void;
  disabled?: boolean;
};

export default function ScorePicker({
  value = null,
  onChange,
  disabled,
}: Props) {
  return (
    <div className="inline-flex gap-2">
      {[0, 1, 2, 3, 4, 5].map((s) => {
        const isActive = value === s;
        return (
          <Button
            key={s}
            type="button"
            variant={isActive ? "default" : "secondary"}
            className="w-10"
            disabled={disabled}
            onClick={() => onChange(s)}
          >
            {s}
          </Button>
        );
      })}
    </div>
  );
}
