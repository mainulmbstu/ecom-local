import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { OrderModel } from "@/lib/models/OrderModel";
import { UserModel } from "@/lib/models/userModel";

export async function GET(req) {
  let keyword = req.nextUrl.searchParams.get("keyword");
  let page = req.nextUrl.searchParams.get("page");
  let perPage = req.nextUrl.searchParams.get("perPage");
  let skip = (page - 1) * perPage;
  try {
    await dbConnect();

    const total = await OrderModel.find({
      $or: [
        { status: { $regex: keyword, $options: "i" } },
        { "user.phone": { $regex: keyword, $options: "i" } },
      ],
    });

    const orderList = await OrderModel.find({
      $or: [
        { status: { $regex: keyword, $options: "i" } },
        { "user.phone": { $regex: keyword, $options: "i" } },
      ],
    })
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });

    return Response.json({ orderList, total: total?.length });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
