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
  const router = useRouter();
  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : !isLoading && token ? (
        children
      ) : (
        router.replace("/user/login")
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
        router.replace("/user/login")
      )}
    </>
  );
}
