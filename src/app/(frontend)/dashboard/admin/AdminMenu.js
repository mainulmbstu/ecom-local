"use client";

import Link from "next/link";
import { ImProfile } from "react-icons/im";
import { PiUserListFill } from "react-icons/pi";
import { FaListOl } from "react-icons/fa";
import { MdOutlineAddBusiness } from "react-icons/md";
import { MdAllInclusive } from "react-icons/md";
import { usePathname } from "next/navigation";

const AdminMenu = () => {
  let path = usePathname();
  let menus = [
    {
      name: "Product",
      href: "/dashboard/admin/create-product",
      icon: <FaListOl />,
    },
    {
      name: "Category",
      href: "/dashboard/admin/create-category",
      icon: <MdOutlineAddBusiness />,
    },
    {
      name: "Profile",
      href: "/dashboard/admin/profile",
      icon: <ImProfile />,
    },
  ];

  return (
    <div className="card p-2">
      <div
        className={
          path === "/dashboard/admin"
            ? "bg-blue-300 p-2 list-none"
            : "hover:bg-zinc-300 p-3 "
        }
      >
        {" "}
        <Link href={"/dashboard/admin"}>Dashboard</Link>
      </div>
      <ul className=" rounded-box w-full mt-3">
        {menus.map((item, i) => (
          <li key={i} className={item.href === path ? "bg-blue-300" : ""}>
            <Link
              href={item.href}
              className=" flex gap-2 p-2 hover:bg-zinc-300"
            >
              <span className="mt-1.5">{item.icon}</span>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMenu;
