"use client";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Print from "@/lib/components/Print";

const ClientPage = ({ item }) => {
  let [printItem, setPrintItem] = useState("");

  useEffect(() => {
    setPrintItem(item);
  }, [item]);
  //=============== print
  let contentRef = useRef();
  let printAddress = useReactToPrint({
    contentRef,
    documentTitle: printItem?._id,
  });

  return (
    <div>
      {/* <button
        onClick={() => {
          setPrintItem(item);
        }}
        className="btn btn-info"
        disabled={item?.payment?.refund === "refunded"}
      >
        {printItem?._id === item?._id ? "OK" : "Set Print"}
      </button>*/}
      <button
        onClick={() => {
          printAddress();
        }}
        className="btn btn-primary"
        disabled={item?.payment?.refund === "refunded"}
      >
        Print
      </button>
      <div className=" hidden">
        <Print ref={contentRef} printItem={printItem} />
      </div>
    </div>
  );
};

export default ClientPage;
