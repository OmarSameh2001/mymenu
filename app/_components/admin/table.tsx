import { DemoItem } from "@/app/admin/menus/page";


export default function AdminTable({demo}: {demo: DemoItem[]}) {
  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-4 w-full flex justify-center items-center">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th className="px-6 py-3">Number</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Pictures</th>
            {/* <th className="px-6 py-3">Action</th> */}
          </tr>
        </thead>
        <tbody>
          {demo.map((item, index) => (
            <tr key={item.name}>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-center">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-center">
                {item.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-center">
                {item.pictures}
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-center">
                <button className="mr-2 bg-blue-800 px-2 py-1 rounded">Edit</button>
                <button className="bg-red-800 px-2 py-1 rounded">Delete</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
