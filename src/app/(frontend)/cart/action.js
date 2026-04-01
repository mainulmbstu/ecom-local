"use server";

import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import dbConnect from "@/lib/helpers/dbConnect";
import { OrderModel } from "@/lib/models/OrderModel";
import { updateTag } from "next/cache";

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
      total: total + charge,
      user: {
        name,
        phone,
        address
      },
    };
    await OrderModel.create(order);
    return {
      success: true,
      message: `Order has been placed successfully`,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  } finally {
    updateTag('order-list')
  }
};
