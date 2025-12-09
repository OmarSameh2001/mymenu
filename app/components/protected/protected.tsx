"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import LoadingPage from "../loading/loading";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isLoading } = useContext(AuthContext);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : !isLoading && token ? (
        children
      ) : (
        router.replace("/login")
      )}
    </>
  );
}

export function ProtectedAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isLoading, isAdmin } = useContext(AuthContext);
  const router = useRouter();

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : !isLoading && token && isAdmin ? (
        children
      ) : (
        router.replace("/login")
      )}
    </>
  );
}
