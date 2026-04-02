// export const dynamic = "force-static";
// export const dynamicParams = true;

import React, { Suspense } from "react";
import { detailsAction } from "./action";
import moment from "moment";
import getBase64 from "@/lib/helpers/plaiceholder";
import PriceFormat from "@/lib/components/PriceFormat";
import ImagePage from "./ImagePage";
import SimilarItems from "./SimilarItems";
import AddToCartBTN from "@/lib/components/card/AddToCartBTN";
import CommentModal from "./commentModal";
import CommentData from "./commentData";

export const generateMetadata = async ({ params }) => {
  let { pid } = await params;
  let { details } = await detailsAction(pid);
  return {
    title: details?.name,
    description: details?.description,
  };
};

const details = async ({ params }) => {
  // console.log(search);
  let { pid } = await params;
  let { details } = await detailsAction(pid);
  let blurData = await getBase64(details?.picture[0]?.secure_url);

  return (
    <div className="md:px-4">
      <div className="">
        <div className="">
          <div className="">
            <ImagePage blurData={blurData} picture={details?.picture} />

            <div className="">
              <div>
                <h6>Name: {details?.name} </h6>
                <p>Category: {details?.category?.name} </p>
                <p className={details?.offer ? "line-through " : "hidden"}>
                  Price: {<PriceFormat price={details?.price} />}{" "}
                </p>
                <p className={details?.offer ? "text-red-400" : ""}>
                  Price:{" "}
                  {
                    <PriceFormat
                      price={
                        details?.price - (details?.price * details?.offer) / 100
                      }
                    />
                  }{" "}
                </p>
                <p className={details?.offer ? "text-danger" : "hidden"}>
                  Offer: {details?.offer}% off{" "}
                </p>
                <p className={details?.color?.length ? "" : "hidden"}>
                  Available Color:{details?.color?.toString()}
                </p>
                <p className={details?.size?.length ? "" : "hidden"}>
                  Available size:{details?.size?.toString()}
                </p>
                <p>Quantity: {details?.quantity} </p>

                <p>Description: {details?.description} </p>
                <p>
                  Added:
                  {moment(details?.createdAt).format("DD-MMM-YYYY")}, (
                  {moment(details?.createdAt).fromNow()})
                </p>
                <p>
                  Updated:
                  {moment(details?.updatedAt).format("DD-MMM-YYYY")}, (
                  {moment(details?.updatedAt).fromNow()})
                </p>
              </div>
              <AddToCartBTN data={JSON.stringify(details)} />
            </div>
          </div>
        </div>
        <hr />
        <div className="my-2">
          <Suspense fallback={<h5>Loading</h5>}>
            <CommentModal pid={pid} />
          </Suspense>
        </div>
        <div className=" ">
          <div>
            <Suspense fallback={<h5>Loading reviews</h5>}>
              <CommentData pid={pid} />
            </Suspense>
          </div>
        </div>
        <hr />
        <div className=" mb-4">
          <Suspense fallback={<h6>Loading similar products</h6>}>
            <SimilarItems pid={pid} />
            {/* <SimilarItems similarItemsPromise={similarItemsPromise} /> */}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default details;
