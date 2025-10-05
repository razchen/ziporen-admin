"use client";
import * as React from "react";

/**
 * Keeps a local editable value in sync with a prop.
 * - Controlled by the component
 * - Resyncs when the upstream value changes
 */
export function useEditableState<T>(value: T) {
  const [local, setLocal] = React.useState(value);
  React.useEffect(() => {
    setLocal(value);
  }, [value]);
  return [local, setLocal] as const;
}
