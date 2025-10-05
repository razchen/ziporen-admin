"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, signOut } from "@/features/auth/auth.slice";
import { useRouter } from "next/navigation";

export default function BootstrapAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const redirectToSignin = () => {
      dispatch(signOut());
      router.replace("/auth/signin");
    };

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!res.ok) {
          redirectToSignin();
          return;
        }

        // refresh endpoints sometimes return 204 (no body). Handle that.
        let json = null;
        try {
          json = await res.json();
        } catch {
          json = null;
        }

        const accessToken: string | undefined = json?.accessToken;
        if (accessToken) {
          dispatch(setCredentials({ accessToken }));
          setReady(true); // we can render protected children now
        } else {
          redirectToSignin();
        }
      } catch (e) {
        console.error(e);
        redirectToSignin();
      }
    })();
  }, [dispatch, router]);

  if (!ready) {
    // simple skeleton: page won’t flicker protected UI while bootstrapping
    return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;
  }

  return <>{children}</>;
}
