import { NonProtectedRoute } from "@/app/_components/utils/protected/protected";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <NonProtectedRoute>{children}</NonProtectedRoute>;
}