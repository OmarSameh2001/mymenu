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

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/user/login");
    }
  }, [isLoading, token, router]);

  return (
    <>{isLoading ? <LoadingPage /> : !isLoading && token ? children : null}</>
  );
}

export function ProtectedAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isLoading, isAdmin } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token && !isAdmin) {
      router.replace("/user/login");
    }
  }, [isLoading, token, isAdmin, router]);

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : !isLoading && token && isAdmin ? (
        children
      ) : null}
    </>
  );
}

export function NonProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && token) {
      router.replace("/");
    }
  }, [isLoading, token, router]);

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : !isLoading && !token ? (
        children
      ) : (
        null
      )}
    </>
  );
}
