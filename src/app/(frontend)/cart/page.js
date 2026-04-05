"use client";

import { useAuth } from "@/lib/components/context";
import PriceFormat from "@/lib/components/PriceFormat";
import { Axios } from "@/lib/helpers/AxiosInstance";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { checkoutAction } from "./action";
import SubmitButton from "@/lib/components/SubmitButton";
import Form from "next/form";
import Swal from "sweetalert2";

export const CartPage = () => {
  let { cart, setCart } = useAuth();
  let [selectedCart, setSelectedCart] = useState([]);
  let [charge, setcharge] = useState(100);

  //========= cart update auto
  useEffect(() => {
    let cartIdArr = cart?.length && cart.map((item) => item?._id);
    let getUpdatedProducts = async () => {
      try {
        let { data } = await Axios.post(`/api/both/cart`, { cartIdArr });
        setCart(data.products);
        localStorage.setItem("cart", JSON.stringify(data.products));
      } catch (error) {
        console.log(error);
      }
    };
    cart?.length && getUpdatedProducts();
  }, []);

  // let ref1 = useRef()
  let [refList, setRefList] = useState([]);

  let ref1 = useCallback((el) => {
    setRefList((prev) => [...prev, el]);
  }, []);

  // console.log(refList[0]);

  let cartItemHandle = (checked, checkedItem) => {
    let all = [...selectedCart];
    if (checked) {
      all.push(checkedItem);
    } else {
      all = all.filter((item) => item._id !== checkedItem._id);
      let one =
        refList?.length &&
        refList.find((item) => item?.id === checkedItem?._id);
      if (one) {
        one.value = "";
      }
    }
    setSelectedCart(all);
  };
  //=================================================
  let colorHandle = (id, color) => {
    let findObj =
      selectedCart.length && selectedCart.find((item) => item._id === id);
    if (!findObj) {
      alert("Please select the item first");
      let one = refList?.length && refList?.find((item) => item?.id === id);
      if (one) one.value = "";
      return;
    }
    let tempObj = { ...findObj };
    let sortedColor = tempObj?.color
      ?.slice()
      .sort((a, b) => (b === color) - (a === color));
    tempObj.color = sortedColor;
    let tempArr2 = selectedCart?.filter((item) => item._id !== id);
    tempArr2?.push(tempObj);
    setSelectedCart(tempArr2);
  };

  //=======================================================
  let sizeHandle = (id, size) => {
    let findObj =
      selectedCart?.length && selectedCart?.find((item) => item._id === id);
    if (!findObj) {
      alert("Please select the item first");
      let one = refList?.length && refList?.find((item) => item?.id === id);
      if (one) one.value = "";
      return;
    }
    let tempObj = { ...findObj };
    let sortedSize = tempObj?.size
      ?.slice()
      .sort((a, b) => (b === size) - (a === size));
    tempObj.size = sortedSize;
    let tempArr2 = selectedCart?.filter((item) => item._id !== id);
    tempArr2?.push(tempObj);
    setSelectedCart(tempArr2);
  };
  //===========================================================
  let amountHandle = (id, d) => {
    let isSelected =
      selectedCart.length && selectedCart.find((item) => item._id === id);
    if (!isSelected) return alert("Please select the item first");
    let ind = -1;
    selectedCart.length &&
      selectedCart?.forEach((data, index) => {
        if (data._id === id) ind = index;
      });

    let tempArr = [...selectedCart];
    tempArr[ind].amount += d;
    setSelectedCart([...tempArr]);
  };

  let totalFrac =
    selectedCart?.length &&
    selectedCart?.reduce((previous, current) => {
      return (
        previous +
        (current?.price - (current?.price * current?.offer) / 100) *
          current.amount
      );
    }, 0);

  let total = Math.round(totalFrac);

  let removeCartItem = (id) => {
    try {
      let isSelected =
        selectedCart?.length && selectedCart.find((item) => item._id === id);
      if (isSelected) {
        return alert("Deselect the item first to remove from cart");
      }
      let index = cart?.findIndex((item) => item._id === id);
      let newCart = [...cart];
      newCart?.splice(index, 1);
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    } catch (error) {
      console.log(error);
    }
  };
  //===================================================

  let clientAction = async (formData) => {
    if (!selectedCart?.length) return alert("Please select an item first");

    try {
      let data = await checkoutAction(formData, selectedCart, total, charge);
      if (data?.success) {
        Swal.fire("Success", data?.message, "success");
        // toast.success(data?.message);
      } else {
        Swal.fire("Error", data?.message, "error");
        // toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //===================================================

  return (
    <div className={""}>
      <div className="grid  text-center mb-5">
        <h5>{"Hello Guest"}</h5>
        <h6 className="">
          {cart?.length
            ? `You have ${cart?.length} items in cart `
            : "Your cart is empty"}
        </h6>
      </div>
      <hr />
      <div className="grid md:grid-cols-12 mt-5">
        <div className="md:col-span-8 mt-0">
          {cart?.length &&
            cart.map((item, i) => {
              let isSelected = selectedCart?.find((p) => p._id === item?._id);
              item = isSelected ? isSelected : item;
              return (
                <div
                  key={i}
                  className="grid md:grid-cols-12 p-1 mb-2 ms-3 border border-zinc-300"
                >
                  <div className="  md:col-span-5 grid grid-cols-12 ">
                    <div className="col-1  content-center">
                      <div className="w-3">
                        <input
                          type="checkbox"
                          // defaultChecked
                          className="checkbox checkbox-success"
                          onChange={(e) =>
                            cartItemHandle(e.target.checked, item)
                          }
                          checked={
                            selectedCart?.length &&
                            selectedCart?.filter((p) => p?._id === item?._id)
                              .length > 0
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-11">
                      <label htmlFor={item?._id}>
                        <Image
                          priority={true}
                          src={
                            item?.picture && `${item?.picture[0]?.secure_url}`
                          }
                          className="h-50 w-auto"
                          height={190}
                          width={190}
                          alt="image"
                        />
                      </label>
                    </div>
                  </div>
                  <div className=" md:col-span-7 ps-3">
                    <div className="flex flex-col">
                      <div>
                        <h6>Name: {item?.name}</h6>
                        <p>
                          {" "}
                          Price:
                          {
                            <PriceFormat
                              price={
                                item?.price - (item?.price * item?.offer) / 100
                              }
                            />
                          }
                        </p>
                        {/* <p className="m-0">Category: {item?.category?.name} </p>
                        <p
                          className={
                            item?.color?.length ? "m-0 py-2 w-50" : "hidden"
                          }
                        >
                          <select
                            ref={ref1}
                            onChange={(e) =>
                              colorHandle(item._id, e.target.value)
                            }
                            name=""
                            id={item?._id}
                            className="py-2 border border-slate-200 text-black"
                          >
                            <option value={""}>Select Color</option>
                            {item?.color?.length &&
                              item?.color.map((clr) => (
                                <option key={clr} value={clr}>
                                  {clr}
                                </option>
                              ))}
                          </select>
                        </p>*/}
                        <div className={"m-0 py-2 flex gap-4 flex-wrap"}>
                          <p>Color: </p>
                          {item?.color
                            ?.slice()
                            .sort()
                            .map((single, i) => (
                              <button
                                key={i}
                                ref={ref1}
                                type="submit"
                                className={`py-1 px-2 border rounded-md cursor-pointer  ${item?.color[0] === single ? "border-pink-600" : "border-slate-300"}`}
                                onClick={(e) => {
                                  colorHandle(item._id, single);
                                }}
                              >
                                {single}
                              </button>
                            ))}
                        </div>
                        <div className={"m-0 py-2 flex gap-4 flex-wrap"}>
                          <p>Size: </p>
                          {item?.size
                            ?.slice()
                            .sort()
                            .map((single, i) => (
                              <button
                                key={i}
                                ref={ref1}
                                type="submit"
                                className={`py-1 px-2 border rounded-md cursor-pointer  ${item?.size[0] === single ? "border-pink-600" : "border-slate-300"}`}
                                onClick={(e) => {
                                  sizeHandle(item._id, single);
                                }}
                              >
                                {single}
                              </button>
                            ))}
                        </div>
                        <div>
                          <button
                            onClick={() => amountHandle(item._id, -1)}
                            className=" px-3 me-3 btn btn-secondary"
                            disabled={item?.amount === 1}
                          >
                            -
                          </button>
                          <span>{item?.amount} </span>
                          <button
                            onClick={() => amountHandle(item?._id, 1)}
                            className=" px-3 mx-3 btn btn-secondary"
                            disabled={item?.amount === item?.quantity}
                          >
                            +
                          </button>
                        </div>
                        <p className="text-red-400">
                          {item?.amount === item?.quantity
                            ? "Max available quantity reached"
                            : ""}{" "}
                        </p>
                        <p className=" font-bold">
                          Sub-Total:{" "}
                          {
                            <PriceFormat
                              price={
                                (item?.price -
                                  (item?.price * item?.offer) / 100) *
                                item?.amount
                              }
                            />
                          }{" "}
                        </p>{" "}
                      </div>
                      <div className=" mt-auto">
                        <button
                          onClick={() => removeCartItem(item._id)}
                          className="btn btn-secondary mb-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="md:col-span-4 text-center">
          <h4>Cart Summary</h4>
          <p>Total || Checkout || Payment</p>
          <hr />
          <div>
            <p>Select delivery area</p>
            <div className="mt-3 flex  border p-1 border-slate-300">
              <div>
                <input
                  onChange={(e) => setcharge(Number(e.target.value))}
                  value={50}
                  className="size-4 mt-1"
                  type="radio"
                  id="area"
                  name="area"
                  required
                />
                <label className="ms-2 pb-2" htmlFor="area">
                  Inside Dhaka city
                </label>
              </div>
              <p className="ms-auto">{<PriceFormat price={50} />}</p>
            </div>
            <div className="mt-3 flex  border p-1 border-slate-300">
              <div>
                <input
                  onChange={(e) => setcharge(Number(e.target.value))}
                  value={80}
                  className="size-4 mt-1"
                  type="radio"
                  id="area2"
                  name="area"
                  required
                />{" "}
                <label className="ms-2 pb-2" htmlFor="area2">
                  Outside Dhaka city
                </label>
              </div>
              <p className="ms-auto">{<PriceFormat price={80} />}</p>
            </div>
            <div className="mt-3 flex  border p-1 border-slate-300">
              <div>
                <input
                  checked={charge === 100}
                  onChange={(e) => setcharge(Number(e.target.value))}
                  value={100}
                  className="size-4 mt-1"
                  type="radio"
                  id="area3"
                  name="area"
                  required
                />
                <label className="ms-2 pb-2" htmlFor="area3">
                  Outside Dhaka district
                </label>
              </div>
              <p className="ms-auto">{<PriceFormat price={100} />}</p>
            </div>
          </div>
          <div className=" text-right pe-3 mt-3">
            <p>Product price: {<PriceFormat price={total} />}</p>
            <p>Delivery charge: {<PriceFormat price={charge} />}</p>
            <h6>Total: {<PriceFormat price={total + charge} />}</h6>
          </div>

          <div className="p-3">
            <Form
              action={clientAction}
              className=" p-4  bg-slate-300 shadow-lg shadow-blue-300 card dark:text-white"
            >
              <div className="mt-3">
                <input
                  className="input"
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Enter your Name"
                />
              </div>
              <div className="mt-3">
                <input
                  className="input"
                  type="number"
                  minLength="11"
                  id="phone"
                  name="phone"
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="mt-3">
                <textarea
                  rows="6"
                  className="input"
                  type="text"
                  id="address"
                  name="address"
                  required
                  placeholder="Enter your address"
                />
              </div>

              <div className="mt-3">
                <SubmitButton title={"Checkout"} design={"btn-accent"} />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;
