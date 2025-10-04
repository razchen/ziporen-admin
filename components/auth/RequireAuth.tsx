"use client";
import { useMeQuery } from "@/features/auth/auth.api";
import { useRouter } from "next/navigation";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading } = useMeQuery();
  const router = useRouter();

  if (isLoading) return null;
  if (!data) {
    router.replace("/signin");
    return null;
  }
  return <>{children}</>;
}
