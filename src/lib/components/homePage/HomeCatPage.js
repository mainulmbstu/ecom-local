"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "../context";
import img from "@/assets/blurr.webp";

const HomeCatPage = () => {
  let { catNested } = useAuth();
  let blurData = img?.blurDataURL;
  return (
    <div className="hidden my-2 md:flex md:flex-wrap ">
      {catNested?.length &&
        catNested.map((item) => (
          <div key={item._id} className=" px-2 ">
            <Link href={`products/category/${item?.slug}`} className="">
              <Image
                blurDataURL={blurData}
                placeholder="blur"
                src={item?.picture?.secure_url}
                priority={true}
                className="w-32 min-h-20 h-15 m-auto object-contain"
                width={100}
                height={100}
                alt="image"
              />
              <p className=" text-center">{item?.name} </p>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default HomeCatPage;
