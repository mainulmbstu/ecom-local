import Link from "next/link";
import Whatsapp from "./Whatsapp";
import { BiHome, BiSolidCategory } from "react-icons/bi";
import { MdAddCall } from "react-icons/md";
import { address } from "@/lib/helpers/constants";

const Footer = () => {
  return (
    <div className="min-h-[4vh] py-3 w-full bg-base-300  flex  justify-around fixed bottom-0 text-2xl  inset-shadow-sm inset-shadow-zinc-300 ">
      <Link href={"/"}>
        <BiHome />
      </Link>
      <Link href={"/products/category/all-categories"}>
        <BiSolidCategory />
      </Link>
      <Whatsapp number={address?.phone} />
      <Link href={`tel:${"8801632199088"}`}>
        <MdAddCall className="" />
      </Link>
      <Link
        href={`mailto:${address?.email}?subject=${encodeURIComponent("my subject")}&body=${encodeURIComponent("my body")}`}
      >
        mail
      </Link>
    </div>
  );
};

export default Footer;
