import React, { useState } from "react";

function Card({ question, answer, show, showAns, setShowAns }) {
  function handleShowAns() {
    setShowAns((prev) => !prev);
  }
  return (
    <div
      className={` ${
        show ? "card-show" : "card-hide "
      } card h-[500px] w-[300px] bg-primary text-primary-foreground cursor-pointer rounded-md mt-4 select-none`}
      onClick={handleShowAns}
    >
      <div
        className={` card-inner text-center h-full w-full  ${
          showAns && "card-inner-rotate"
        }`}
      >
        <div className=" p-4 absolute inset-0 card-front  flex flex-col gap-2">
          <p className=" font-bold text-xl underline">Question</p>
          <p className=" flex-1 grid place-items-center w-full font-semibold overflow-x-hidden scrollbar">
            {question}
          </p>
        </div>
        <div className=" p-4 absolute inset-0 card-back  flex flex-col gap-2">
          <p className=" font-bold text-xl underline">Answer</p>
          <p className=" flex-1 grid place-items-center w-full overflow-x-hidden scrollbar ">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Card;
