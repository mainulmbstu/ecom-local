import Link from "next/link";
import Whatsapp from "./Whatsapp";
import { BiHome, BiSolidCategory } from "react-icons/bi";
import { MdAddCall } from "react-icons/md";

const Footer = () => {
  return (
    <div className="min-h-[4vh] py-3 w-full bg-base-300  flex  justify-around fixed bottom-0 text-2xl  inset-shadow-sm inset-shadow-zinc-300 ">
      <Link href={"/"}>
        <BiHome />
      </Link>
      <Link href={"/products/category/all-categories"}>
        <BiSolidCategory />
      </Link>
      <Whatsapp number={"8801632-199 088"} />
      <Link href={`tel:${"8801632199088"}`}>
        <MdAddCall className="" />
      </Link>
    </div>
  );
};

export default Footer;
