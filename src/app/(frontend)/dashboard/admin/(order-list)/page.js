import Pagination from "@/lib/components/pagination";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import DeleteModal from "@/lib/components/DeleteModal";
import Status from "./status";
import PriceFormat from "@/lib/components/PriceFormat";
import ClientPage from "./clientPage";
import SubmitButton from "@/lib/components/SubmitButton";
import { MdAddCall } from "react-icons/md";
import Whatsapp from "@/lib/components/Whatsapp";
import { deleteAction } from "./action";
import DateSSR from "@/lib/components/DateSSR";
import { blurDataURL } from "@/lib/helpers/blurData";

export const metadata = {
  title: "Order List",
  description: "Order List page",
};
const Orders = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms?.keyword) ?? "";
  let page = Number((await spms?.page) ?? "1");
  let perPage = Number((await spms?.perPage) ?? "12");

  // let userList = await userListAction(keyword);
  let res = await fetch(
    `${process.env.BASE_URL}/api/admin/order-list?keyword=${keyword}&page=${page}&perPage=${perPage}`,
    { cache: "force-cache", next: { tags: ["order-list"] } },
  );
  let data = await res.json();
  // let { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
  let entries = data?.orderList;

  return (
    <div className="">
      <div className="my-3">
        <Form action={"/dashboard/admin/order-list"}>
          <div className="flex">
            <div className="">
              <input
                name="keyword"
                type="search"
                className="input-000"
                placeholder="Phone, Email or Status"
              />
            </div>
            <div className="">
              <SubmitButton title={"Search"} design={"btn btn-search"} />
            </div>
          </div>
        </Form>
      </div>
      <div className=" card p-2 mt-5">
        <h4>Total Orders: ( {data?.total})</h4>
        {/* <h4>Total Sale: {<PriceFormat price={totalPrice} />}</h4> */}
      </div>
      <div className=" grid md:grid-cols-4 gap-3 p-2">
        {entries?.length &&
          entries?.map((item) => (
            <div key={item?._id} className=" border border-gray-300  p-1">
              <div className="mb-2">
                {entries?.length ? (
                  <div className="hover:bg-zinc-200 space-y-1">
                    <div className="flex">
                      <div
                        className={
                          item.status === "delivered"
                            ? " bg-green-400"
                            : item.status === "cancelled"
                              ? " bg-red-400"
                              : ""
                        }
                      >
                        Status:
                      </div>
                      <div className="ms-3 grow">
                        {" "}
                        <Status satus={item.status} id={item._id.toString()} />
                      </div>
                    </div>

                    <Link
                      href={`tel:${item?.user?.phone}`}
                      className="underline flex"
                    >
                      <MdAddCall className="mt-1 me-2" />
                      {`88${item?.user?.phone}`}
                    </Link>
                    <div className="flex">
                      <Whatsapp
                        number={`88${item?.user?.phone}`}
                        hide={false}
                      />
                      {/* {item?.user?.phone}*/}
                    </div>
                    <p>Name: {item?.user?.name} </p>
                    <p>Address: {item?.user?.address} </p>
                    <p>Item number: {item?.products?.length} </p>
                    <DateSSR date={item?.createdAt} />
                    <h6>
                      Products Price:{" "}
                      {<PriceFormat price={item.total - item.charge} />}{" "}
                    </h6>
                    <h6>
                      Delivery charge:{" "}
                      {<PriceFormat price={item.charge} />}{" "}
                    </h6>
                    <h5>
                      Total Payable: {<PriceFormat price={item.total} />}{" "}
                    </h5>
                    <div className="flex justify-between">
                      <ClientPage item={item} />
                      <DeleteModal
                        value={{
                          id: item?._id.toString(),
                          message: `Do you want to delete the order of ${item?.user?.name}, orderId: ${item?._id}`,
                          action: deleteAction,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <p>no data found</p>
                )}
              </div>
              <h6>Products info</h6>
              {item?.products?.length &&
                item?.products?.map((p, i) => {
                  return (
                    <div key={i} className=" g-5 mb-2 bg-base-200">
                      <div className="grid grid-cols-4 g-4">
                        <div className=" col-span-1">
                          <Link
                            className=""
                            href={`${p?.picture?.at(0)?.secure_url}`}
                            target="_blank"
                          >
                            <Image
                              blurDataURL={blurDataURL()}
                              placeholder="blur"
                              src={`${p?.picture?.at(0)?.secure_url}`}
                              priority={true}
                              className="w-auto h-32 object-contain"
                              width={200}
                              height={200}
                              alt="image"
                            />
                          </Link>
                        </div>
                        <div className=" col-span-3 ms-1 ">
                          <div>
                            <p>Name: {p?.name}</p>
                            <p>
                              Price:{" "}
                              {
                                <PriceFormat
                                  price={p?.price - (p?.price * p?.offer) / 100}
                                />
                              }
                            </p>
                            <p>Category: {p?.category?.name} </p>
                            <p>{`Quantity: ${p?.amount}`}</p>
                            <p>{`Color: ${p?.color[0]}`}</p>
                            <p>{`Size: ${p?.size[0]}`}</p>
                            <h6>
                              Sub-Total:{" "}
                              {
                                <PriceFormat
                                  price={
                                    (p?.price - (p?.price * p?.offer) / 100) *
                                    p.amount
                                  }
                                />
                              }
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
      </div>
      <div className=" mt-3 ">
        <Pagination
          total={data?.total || 1}
          page={page}
          perPage={perPage}
          spms1="keyword"
          spms1Value={keyword}
        />
      </div>
    </div>
  );
};

export default Orders;
