import Link from "next/link";
import ProtectedRoute from "../components/protected/protected";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <nav className="flex justify-center border-b p-4 gap-4">
        <Link href="/admin/users">
          Users
        </Link>
        <Link href="/admin/menus">
          Menus
        </Link>
      </nav>
      {children}
    </ProtectedRoute>
  );
}
