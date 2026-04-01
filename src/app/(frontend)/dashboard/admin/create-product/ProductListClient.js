"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import DeleteModal from "@/lib/components/DeleteModal";
import Pagination from "@/lib/components/pagination";
import SubmitButton from "@/lib/components/SubmitButton";
import { useAuth } from "@/lib/components/context";
import { deleteAction, offerAction } from "./action";
import blurImg from "@/assets/blurr.webp";
import ProductModal from "./ProductModal";

const ProductListClient = ({ value }) => {
  let { keyword, category, page, perPage, data } = value;
  let { catPlain } = useAuth();
  let [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(data?.productList);
  }, [data]);

  let charLimit = 30;

  let selectHandle = (e) => {
    let { name, checked } = e.target;
    // setProducts([name]);
    if (name === "selectAll") {
      let tempArr = products?.map((item) => {
        return { ...item, isChecked: checked };
      });
      setProducts(tempArr);
    } else {
      let tempArr = products?.map((item) =>
        item?._id === name ? { ...item, isChecked: checked } : item
      );
      setProducts(tempArr);
    }
  };
  let clientAction = async (formData) => {
    let offer = formData.get("offer");
    let selectIdArr =
      products?.length &&
      products.filter((item) => item?.isChecked).map((item) => item?._id);
    if (!selectIdArr?.length || !offer) {
      return Swal.fire(
        "Error",
        "Select product and input offer percentage",
        "error"
      );
    }
    let data = await offerAction(selectIdArr, formData);
    if (data?.success) {
      Swal.fire("Success", data?.message, "success");
      //   toast.success(data?.message);
    } else {
      Swal.fire("Error", data?.message, "error");
      //   toast.error(data?.message);
    }
  };
  return (
    <div>
      <div>
        <div className="lg:flex relative z-300">
          <div className="m-2">
            <Form action="/dashboard/admin/create-product">
              <div className="join">
                <div className="">
                  <input
                    defaultValue={keyword}
                    name="keyword"
                    type="search"
                    className="input input-bordered join-item"
                    placeholder="Product name"
                  />
                </div>
                <div className="">
                  <SubmitButton title={"Search"} design={"btn join-item"} />
                </div>
              </div>
            </Form>
          </div>
          <div className="m-2">
            <Form action="/dashboard/admin/create-product">
              <div className="join">
                <div className="">
                  <input
                    defaultValue={category}
                    name="category"
                    type="search"
                    list="categoryList"
                    className="input input-bordered join-item"
                    placeholder="Select category"
                  />
                  <datalist id="categoryList">
                    {catPlain?.length &&
                      catPlain.map((item) => {
                        return (
                          <option key={item._id} value={item?.slug}></option>
                        );
                      })}
                  </datalist>
                </div>
                <div className="">
                  <SubmitButton title={"Search"} design={"btn join-item"} />
                </div>
              </div>
            </Form>
          </div>
          <div className="m-2">
            <Form action={clientAction}>
              <div className="join">
                <div className="">
                  <input
                    //   defaultValue={keyword}
                    name="offer"
                    type="number"
                    className="input input-bordered join-item"
                    placeholder="Write offer percentage"
                  />
                </div>
                <div className="">
                  <SubmitButton title={"Submit"} design={"btn join-item"} />
                </div>
              </div>
            </Form>
          </div>
        </div>

        <h5> Total product: {data?.total} </h5>

        <div className="flex ">
          <input
            onChange={selectHandle}
            name="selectAll"
            className=" mx-2  border border-secondary size-4"
            checked={
              products?.length &&
              products.filter((item) => item?.isChecked !== true)
                .length < 1
            }
            type="checkbox"
            id="all"
          />
          <label htmlFor="all"> Select All</label>
        </div>


        <div className=" grid lg:grid-cols-4 gap-2 p-1">

          {
            products?.map((item) => (
              <div key={item?._id} className="hover:bg-zinc-200 flex gap-3 border">
                <div>
                  <input
                    onChange={selectHandle}
                    className=" ms-1"
                    type="checkbox"
                    name={item?._id}
                    id={item?._id}
                    checked={item?.isChecked || false}
                  />
                </div>

                <div className="grow">
                  <div>
                    <Link href={item.picture[0]?.secure_url} target="_blank">
                      <Image
                        priority={true}
                        blurDataURL={blurImg?.blurDataURL}
                        placeholder="blur"
                        className="w-50 h-auto"
                        width={250}
                        height="250"
                        src={item.picture[0]?.secure_url}
                        alt=""
                      />
                    </Link>
                  </div>
                  <h6>Name: {item.name}</h6>
                  <p>Category: {item.category?.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: {item.price}</p>
                  <p className={item?.color?.length ? "" : "hidden"}>
                    Color: {item?.color?.toString()}
                  </p>
                  <p className={item?.size?.length ? "" : "hidden"}>
                    Size:{" "}
                    {item?.size?.length &&
                      item?.size?.map((item, i) => (
                        <span key={i}>{item}, </span>
                      ))}
                  </p>
                  <p>Offer: {item.offer}</p>
                  <p>
                    Added: {moment(new Date(item.createdAt)).format("DD-MM-YYYY")}
                  </p>
                  <p className="m-0">
                    Description: {item?.description.substring(0, charLimit)}{" "}
                    {item?.description?.length > charLimit ? "..." : ""}
                  </p>
                  <div className="flex justify-between">
                    <div className="">
                      <ProductModal
                        editItem={JSON.stringify(item)}
                      />
                    </div>

                    <div>
                      <DeleteModal
                        value={{
                          id: item?._id.toString(),
                          message: `Do you want to delete ${item?.name}`,
                          action: deleteAction,
                        }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            ))
          }
        </div>
        <div className=" mt-3 ">
          <Pagination
            total={data?.total}
            page={page}
            perPage={perPage}
            spms1="keyword"
            spms1Value={keyword}
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default ProductListClient;
