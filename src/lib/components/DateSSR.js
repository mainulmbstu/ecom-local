"use client";

import moment from "moment";

const DateSSR = ({ date }) => {
  return (
    <div className=" ">
      <p>Date: {moment(date).format("DD-MM-YY hh:mm a")} </p>
    </div>
  );
};

export default DateSSR;
