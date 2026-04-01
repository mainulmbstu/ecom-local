"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { OrderModel } from "@/lib/models/OrderModel";
import { revalidatePath, updateTag } from "next/cache";

export const StatusAction = async (value, id) => {
  try {
    await dbConnect();
    await OrderModel.findByIdAndUpdate({ _id: id }, { status: value });
    // revalidatePath("/dashboard/admin/order-list");

    updateTag("order-list");

    return {
      message: `Order has been successfully updated to ${value} `,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
