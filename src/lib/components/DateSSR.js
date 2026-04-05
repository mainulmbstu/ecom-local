"use client";

import moment from "moment";

const DateSSR = ({ SSRTime }) => {
  return (
    <div className=" ">
      <p>Date: {moment(SSRTime).format("DD-MM-YY hh:mm a")} </p>
    </div>
  );
};

export default DateSSR;
