"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { CgCloseR } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./context";
import Image from "next/image";
import { useIdleTimer } from "react-idle-timer";

const NavMenu = () => {
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [drop2, setdrop2] = useState(false);
  const [mounted, setMounted] = useState(false);
  let { userInfo, logout, cart } = useAuth();

  useIdleTimer({
    timeout: 15 * 60 * 1000, // 15 minutes
    onIdle: () => userInfo && logout(),
    debounce: 500,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  let menuClose = () => setisMenuOpen(false);
  let router = useRouter();
  let path = usePathname();

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 w-full shadow-lg flex  justify-between md:items-center p-4  bg-base-300 dark:text-white z-400`}
    >
      <div className="">
        <Link className="" href="/">
          logo
        </Link>
      </div>

      <div
        className={`h-6  transition-all  duration-500 ${
          isMenuOpen ? "h-fit flex-1 bg-base-300" : ""
        }`}
      >
        <nav className={`relative   uppercase h-6 `}>
          <ul
            className={`${
              isMenuOpen
                ? " absolute top-10 -left-5 w-80 flex flex-col scale-y-100 pt-6 text-center transition-all  duration-500"
                : "scale-y-0"
            } md:flex md:gap-6 md:scale-y-100 bg-base-300`}
          >
            <li className=" border-b border-b-zinc-50 hover:inset-shadow-sm  py-2 md:py-0 hover:inset-shadow-indigo-300 transition-all">
              <Link
                className={path === "/" ? "underline text-blue-700" : ""}
                onClick={menuClose}
                href={"/"}
              >
                Home
              </Link>
            </li>

            <li className="border-b border-b-zinc-50 hover:inset-shadow-sm  py-2 md:py-0 hover:inset-shadow-indigo-300 transition-all">
              <Link
                className={
                  path === "/products/category/all-categories"
                    ? "underline text-blue-700"
                    : ""
                }
                onClick={menuClose}
                href={"/products/category/all-categories"}
              >
                All Categories
              </Link>
            </li>

            {userInfo ? (
              <>
                {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                <li
                  onClick={() => setdrop2(!drop2)}
                  className=" relative cursor-pointer  border-b border-b-zinc-50 hover:inset-shadow-sm  py-2 md:py-0 hover:inset-shadow-indigo-300 transition-all"
                >
                  <span></span>
                  <span
                    className={`flex justify-center gap-2 ${path.startsWith("/dashboard") ? " text-blue-700 underline" : ""}`}
                  >
                    <Image
                      priority={true}
                      width={400}
                      height={400}
                      src={
                        userInfo?.picture
                          ? userInfo?.picture?.secure_url
                          : "/dummy.jpeg"
                      }
                      alt="image"
                      className=" rounded-full w-8 h-8 object-contain"
                    />
                    {userInfo?.name}
                    <IoIosArrowDown
                      className={`mt-1 ${drop2 ? "rotate-180" : ""}`}
                    />{" "}
                  </span>
                  <ul
                    className={`absolute top-full z-20  md:right-0 bg-base-300 w-full md:w-fit whitespace-nowrap origin-top duration-300 ${
                      drop2 ? "scale-y-100" : "scale-y-0"
                    }`}
                  >
                    <li>
                      <Link
                        onClick={menuClose}
                        className={`w-full inline-block p-2 hover:bg-zinc-400 ${path.startsWith(`/dashboard`) ? "bg-blue-300" : ""} `}
                        href={
                          userInfo?.role === "admin"
                            ? "/dashboard/admin"
                            : "/dashboard/user"
                        }
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={logout}
                        className={
                          "w-full inline-block md:text-left p-2 hover:bg-zinc-400 cursor-pointer"
                        }
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className=" border-b border-b-zinc-50 hover:inset-shadow-sm  py-2 md:py-0 hover:inset-shadow-indigo-300 transition-all">
                <Link
                  className={
                    path === "/user/login" ? "underline text-blue-700" : ""
                  }
                  onClick={menuClose}
                  href={"/user/login"}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div className="me-3 text-lg min-w-20">
        <Link href={"/cart"} className=" relative">
          Cart{" "}
          <div className="bg-red-500 text-amber-50 text-sm text-center size-5 rounded-full absolute bottom-3 -right-2">
            {cart?.length}
          </div>
        </Link>
      </div>

      <div className="md:hidden cursor-pointer">
        <button type="button" onClick={() => setisMenuOpen(!isMenuOpen)}>
          {" "}
          <span>
            {isMenuOpen ? (
              <CgCloseR className=" hover:scale-125 transition-all text-2xl " />
            ) : (
              <FaBars className=" hover:scale-125 transition-all text-2xl " />
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default NavMenu;
