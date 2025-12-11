import AdminTable from "@/app/_components/admin/table";
export interface DemoItem {
  name: string;
  pictures: number;
}
const demo: DemoItem[] = [
  {
    name: "Cy Ganderton",
    pictures: 6,
  },
  {
    name: "Hart Hagerty",
    pictures: 8,
  },
  { name: "Brice Swyre", pictures: 5 },
];
export default function AdminMenusPage() {
  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <AdminTable demo={demo} />
    </div>
  );
}
