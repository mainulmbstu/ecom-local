import moment from "moment";
import Pagination from "@/lib/components/pagination";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import DeleteModal from "@/lib/components/DeleteModal";
import { deleteAction } from "./action";
import SubmitButton from "@/lib/components/SubmitButton";
import blurImg from "@/assets/blurr.webp";
import CategoryModal from "./CategoryModal";


const CategoryList = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms["keyword"]) ?? "";
  let page = Number((await spms["page"]) ?? "1");
  let perPage = Number((await spms["perPage"]) ?? "12");

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
          <div className="join">
            <div className="">
              <input
                defaultValue={keyword}
                name="keyword"
                type="search"
                className="input input-bordered join-item"
                placeholder="Search"
              />
            </div>
            <div className="">
              <SubmitButton title={"Search"} design={"btn join-item"} />
            </div>
          </div>
        </Form>
      </div>
      <div className="">
        <h5> Total category: {data?.total} </h5>

        <div className=" grid lg:grid-cols-4 gap-2 p-1">

          {
            entries?.map((item) => (
              <div key={item?._id} className="hover:bg-zinc-200 flex gap-3 border border-zinc-200">

                <div className="grow p-1">
                  <div>
                    <Link href={item.picture?.secure_url} target="_blank">
                      <Image
                        priority={true}
                        blurDataURL={blurImg?.blurDataURL}
                        placeholder="blur"
                        className="w-60 h-auto mx-auto"
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

                  <div className="flex justify-between">
                    <div className="">
                      <CategoryModal
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
