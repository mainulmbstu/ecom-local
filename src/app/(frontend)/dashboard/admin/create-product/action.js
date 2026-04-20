"use server";

import { deleteImageOnCloudinary } from "@/lib/helpers/cloudinary";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CommentModel } from "@/lib/models/CommentModel";
import { ProductModel } from "@/lib/models/productModel";
import { updateTag } from "next/cache";

//==============================
export const deleteAction = async (id = "") => {
  try {
    await dbConnect();

    const itemExist = await ProductModel.findByIdAndDelete(id);
    if (itemExist.picture[0]?.public_id) {
      for (let pic of itemExist.picture) {
        await deleteImageOnCloudinary(pic?.public_id);
      }
    }
    await CommentModel.deleteMany({ product: id });
    // revalidatePath("/", "layout");
    updateTag("product-list");

    return {
      message: `${itemExist?.name} has been deleted successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};

//==============================
export const offerAction = async (selectIdArr, formData) => {
  let offer = formData.get("offer");
  try {
    await dbConnect();
    for (let id of selectIdArr) {
      await ProductModel.findByIdAndUpdate(id, { offer }, { new: true });
    }

    // revalidatePath("/", "layout");
    updateTag("product-list");

    return {
      message: `${offer} percent offer has been applied successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
