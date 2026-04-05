"use server";

import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import dbConnect from "@/lib/helpers/dbConnect";
import { OrderModel } from "@/lib/models/OrderModel";
import { updateTag } from "next/cache";
import { ProductModel } from "@/lib/models/productModel";

//===========================================================
export const checkoutAction = async (formData, cart, total, charge) => {
  let name = formData.get("name");
  let phone = formData.get("phone");
  let address = formData.get("address");
  try {
    if (phone?.length < 11) {
      throw new Error("Phone number is not correct");
    }
    await dbConnect();
    let order = {
      products: cart,
      charge,
      total: total + charge,
      user: {
        name,
        phone,
        address,
      },
    };
    let saved = await OrderModel.create(order);
    if (saved) {
      for (let v of saved.products) {
        let product = await ProductModel.findById(v._id);
        product.quantity = product.quantity - v.amount;
        await product.save();
      }
    }
    return {
      success: true,
      message: `Order has been placed successfully`,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  } finally {
    updateTag("order-list");
  }
};
