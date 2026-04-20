// export const dynamic = "force-static";
// export const dynamicParams = true;

import React, { Suspense } from "react";
import { detailsAction } from "./action";
import moment from "moment";
import PriceFormat from "@/lib/components/PriceFormat";
import ImagePage from "./ImagePage";
import SimilarItems from "./SimilarItems";
import AddToCartBTN from "@/lib/components/card/AddToCartBTN";
import CommentModal from "./commentModal";
import CommentData from "./commentData";
import DateSSR2 from "@/lib/components/DateSSR2";

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

  return (
    <div className="md:px-4">
      <div className="">
        <div className="">
          <div className="">
            <ImagePage picture={details?.picture} />

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
                  <DateSSR2 date={details?.createdAt} time={true} />, (
                  {moment(details?.createdAt).fromNow()})
                </p>
                <p>
                  Updated:
                  <DateSSR2 date={details?.updatedAt} time={true} />, (
                  {moment(details?.updatedAt).fromNow()})
                </p>
              </div>
              <AddToCartBTN data={JSON.stringify(details)} />
            </div>
          </div>
        </div>
        <hr />
        <div className="my-2">
          <Suspense fallback={<h2>Loading</h2>}>
            <CommentModal pid={pid} title="Review" design="btn-success " />
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
