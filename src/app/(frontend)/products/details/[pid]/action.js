"use server";

import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "@/lib/helpers/cloudinary";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CommentModel } from "@/lib/models/CommentModel";
import { cacheLife, cacheTag, revalidatePath, updateTag } from "next/cache";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { ProductModel } from "@/lib/models/productModel";
import { getCookieValue } from "@/lib/helpers/getCookieValue";
import { CategoryModel } from "@/lib/models/categoryModdel";

export const detailsAction = async (pid) => {
  try {
    await dbConnect();
    const item = await ProductModel.findById(pid).populate(
      "category",
      "name",
      CategoryModel,
    );
    // item.rating = item.rating.toFixed(1);
    return { details: item };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//===========================
export const similarItemsAction = async (pid) => {
  "use cache";
  cacheLife("days");
  cacheTag("similar-list");
  try {
    await dbConnect();
    const item = await ProductModel.findById(pid);
    const similarItems = await ProductModel.find({
      category: item?.category,
      _id: { $ne: pid },
    })
      .populate("category", "name")
      .limit(12)
      .sort({ updatedAt: -1 });

    return { similarItems: JSON.stringify(similarItems) };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};

//=====================================
export const commentAction = async (pid, name, comment) => {
  try {
    if (!pid) {
      return { message: "pid is required" };
    }
    await dbConnect();

    await CommentModel.create({
      product: pid,
      comment,
      user: {
        name,
      },
    });

    let item = await ProductModel.findById(pid);
    item.review = item?.review + 1;
    await item.save();
    // revalidatePath("/", "layout");
    updateTag("comment-list");
    return { success: true, message: "Commented successfully" };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
