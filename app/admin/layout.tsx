import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="flex justify-center border-b p-4 gap-4">
        <Link href="/admin/users">
          Users
        </Link>
        <Link href="/admin/menus">
          Menus
        </Link>
      </nav>
      {children}
    </>
  );
}
