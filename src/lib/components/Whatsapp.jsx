import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { MdAddCall } from "react-icons/md";

const Whatsapp = ({ number, hide = true }) => {
  // let phone = number.replace(/[\s\-\+\(\)]/g, '');
  let phone = number.replace(/[\s\-+()\]]/g, "");
  const href = `https://wa.me/${phone}?text=${encodeURIComponent("I am from your page")}`;

  return (
    <div>
      <Link
        className="flex"
        href={href}
        passHref
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp className="text-green-500 text-2xl" />
        <span className={hide ? "hidden" : "ms-2 underline text-blue-400"}>
          {number}
        </span>
      </Link>
    </div>
  );
};

export default Whatsapp;
