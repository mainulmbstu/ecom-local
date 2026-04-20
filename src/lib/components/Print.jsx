"use client";

import React from "react";
import PriceFormat from "./PriceFormat";
import moment from "moment";
import { address } from "@/lib/helpers/constants";

const Print = ({ printItem }, ref) => {
  let totalFrac = printItem?.products?.reduce((previous, current) => {
    return (
      previous +
      (current?.price - (current?.price * current?.offer) / 100) *
        current.amount
    );
  }, 0);

  let total = Math.round(totalFrac);

  return (
    <div ref={ref} className={printItem ? "mt-5 px-5" : "hidden"}>
      <div className=" text-center mb-4">
        <h3> {address?.web}</h3>
        <p>{address?.area}</p>
        <p>Phone:{address?.phone}</p>
      </div>
      <div className="grid grid-cols-2">
        <div className=" col-span-1">
          <h3>INVOICE</h3>
        </div>
        <div className="col-span-1">
          <p>Invoice No. {printItem?._id} </p>
          <p>Payment Method: Cash on delivery</p>
          <p>Invoice Date: {moment(new Date()).format("DD-MM-YYYY hh:mm a")}</p>
        </div>
      </div>

      <hr />
      <div className="row">
        <div className="col-6">
          <h4>Shipping Information</h4>
          <h5>Name: {printItem?.user?.name} </h5>
          <p>Phone: {printItem?.user?.phone} </p>
          {/* <p>Email: {printItem?.user?.email} </p> */}
          <p>Address: {printItem?.user?.address} </p>
        </div>
      </div>
      <hr />
      <div className="row">
        <table className="w-full border-separate border-spacing-x-0.5 border-spacing-y-1 ">
          <thead>
            <tr className="bg-base-300 py-2 h-10 text-center">
              <th scope="col">#</th>
              <th scope="col">Product Name</th>
              <th scope="col">Color</th>
              <th scope="col">Size</th>
              <th scope="col">Unit Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Sub-Total</th>
            </tr>
          </thead>

          <tbody className="bg-base-100">
            {printItem ? (
              printItem?.products?.map((item, i) => (
                <tr key={item?._id} className="text-center">
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.color?.at(0) ?? "N/A"}</td>
                  <td>{item.size?.at(0) ?? "N/A"}</td>
                  <td>
                    {
                      <PriceFormat
                        price={item.price - (item.price * item?.offer) / 100}
                      />
                    }
                  </td>
                  <td>{item.amount}</td>
                  <td>
                    {
                      <PriceFormat
                        price={
                          (item?.price - (item?.price * item?.offer) / 100) *
                          item.amount
                        }
                      />
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No data found</td>
              </tr>
            )}
          </tbody>
        </table>
        <hr />
        <div className="flex  justify-end pe-5">
          <p>Total product price: {<PriceFormat price={total} />}</p>
        </div>
        <div className="flex  justify-end pe-5">
          <p>
            Delivery charge: {<PriceFormat price={printItem.total - total} />}
          </p>
        </div>
        <div className="flex justify-end pe-5">
          <h4>Grand Total: {<PriceFormat price={printItem.total} />}</h4>
        </div>
      </div>
    </div>
  );
};

const forwardPrint = React.forwardRef(Print);
export default forwardPrint;
