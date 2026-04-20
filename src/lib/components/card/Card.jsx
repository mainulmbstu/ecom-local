import Image from "next/image";
import Link from "next/link";
import PriceFormat from "../PriceFormat";
import AddToCartBTN from "./AddToCartBTN";
import { blurDataURL } from "@/lib/helpers/blurData";

const Card = async ({ item }) => {
  let charLimit = 30;

  return (
    <div className="h-full my-2">
      <div className=" shadow-xl h-full flex flex-col cursor-pointer hover:bg-zinc-400 bg-zinc-300 dark:bg-base-300 p-1">
        <figure className=" h-40 md:max-h-80 relative">
          <Image
            priority={true}
            blurDataURL={blurDataURL()}
            placeholder="blur"
            src={item?.picture?.at(0)?.secure_url}
            className=" object-contain h-40 w-auto mx-auto"
            alt="image"
            width={200}
            height={200}
          />{" "}
        </figure>
        <div className="relative">
          <h6 className="">{item?.name}</h6>
          <div
            className={
              item?.offer
                ? "offerDisc p-3 text-white text-center bg-red-500 animate-pulse absolute right-0 -top-2.5 rounded-full"
                : "hidden"
            }
          >
            <h6 className="size-font">Off {item?.offer}%</h6>
            <h6 className="size-font">
              {<PriceFormat price={(item?.price * item?.offer) / 100} />}
            </h6>
          </div>
          <div className="relative">
            <p className="m-0">Category: {item?.category?.name}</p>
            <p className={item?.offer ? "line-through " : "mb-1"}>
              Price: {<PriceFormat price={item?.price} />}{" "}
            </p>
            <p
              className={item?.offer ? "mb-2 text-red-500  text-lg" : "hidden"}
            >
              <span className={"text-red-500"}>
                Offer Price:{" "}
                {
                  <PriceFormat
                    price={item?.price - (item?.price * item?.offer) / 100}
                  />
                }
              </span>{" "}
            </p>

            <p className="m-0">
              Description: {item?.description.substring(0, charLimit)}{" "}
              {item?.description?.length > charLimit ? "..." : ""}
            </p>
          </div>
        </div>

        <div className="mt-auto flex justify-between">
          <Link
            className="btn btn-primary "
            href={`/products/details/${item._id}`}
          >
            Viw Details
          </Link>
          <div>
            <AddToCartBTN data={JSON.stringify(item)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
