import moment from "moment";
import Pagination from "@/lib/components/pagination";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import DeleteModal from "@/lib/components/DeleteModal";
import { deleteAction } from "./action";
import SubmitButton from "@/lib/components/SubmitButton";
import CategoryModal from "./CategoryModal";
import { blurDataURL } from "@/lib/helpers/blurData";

const CategoryList = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms?.keyword) ?? "";
  let page = Number((await spms?.page) ?? "1");
  let perPage = Number((await spms?.perPage) ?? "12");

  let res = await fetch(
    `${process.env.BASE_URL}/api/admin/category-list?keyword=${keyword}&page=${page}&perPage=${perPage}`,
    {
      cache: "force-cache",
      next: { tags: ["category-list"] },
    },
  );
  let data = await res.json();
  let entries = data?.categoryList;
  return (
    <div>
      <div className="my-3">
        <Form action={"/dashboard/admin/create-category"}>
          <div className="flex">
            <div className="">
              <input
                defaultValue={keyword}
                name="keyword"
                type="search"
                className="input-000"
                placeholder="Search"
              />
            </div>
            <div className="">
              <SubmitButton title={"Search"} design={"btn btn-search"} />
            </div>
          </div>
        </Form>
      </div>
      <div className="">
        <h5> Total category: {data?.total} </h5>

        <div className=" grid lg:grid-cols-4 gap-2 p-1">
          {entries?.map((item) => (
            <div
              key={item?._id}
              className=" hover:bg-zinc-200 flex gap-3 border border-zinc-200"
            >
              <div className="grow p-1  flex flex-col">
                <div>
                  <Link href={item.picture?.secure_url} target="_blank">
                    <Image
                      priority={true}
                      blurDataURL={blurDataURL()}
                      placeholder="blur"
                      className="w-auto h-30 object-contain mx-auto"
                      width={250}
                      height="250"
                      src={item.picture?.secure_url}
                      alt="image"
                    />
                  </Link>
                </div>
                <h6>Category Name: {item.name}</h6>
                <p>
                  Added: {moment(new Date(item.createdAt)).format("DD-MM-YYYY")}
                </p>

                <div className="flex justify-between mt-auto ">
                  <div className="">
                    <CategoryModal editItem={JSON.stringify(item)} />
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
          ))}
        </div>
      </div>
      <div className=" mt-3 ">
        <Pagination
          total={data?.total || 1}
          page={page}
          perPage={perPage}
          spms1="keyword"
          spms1Value={keyword}
        />{" "}
      </div>
    </div>
  );
};

export default CategoryList;
