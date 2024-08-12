import { useEffect, useState } from "react";
import axiosInstance from "../lib/axiosInstance";
import Card from "./card";

function Home({ isAdmin = false, handleEdit, handleDelete, refetch }) {
  const [cardData, setCardData] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [showAns, setShowAns] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/cards")
      .then((data) => {
        const cards = data.data.data;
        setCardData(cards);

        let newIndex;

        if (cards.length === 0) {
          newIndex = -1;
        } else if (cardIndex === -1) {
          newIndex = 0;
        } else {
          newIndex = Math.min(cardIndex, cards.length - 1);
        }

        setCardIndex(newIndex);
      })
      .catch((error) => {
        console.error("Error fetching cards:", error);
      });
  }, [refetch]);

  return (
    <div className=" min-h-svh flex flex-col justify-center gap-2">
      <div>
        {cardData?.map((c, index) => (
          <Card
            question={c.question}
            answer={c.answer}
            show={cardIndex === index}
            showAns={showAns}
            setShowAns={setShowAns}
            key={index}
          />
        ))}
      </div>
      <div className=" text-center font-semibold">{`${cardIndex + 1} / ${
        cardData.length
      }`}</div>

      <div className=" w-full">
        <div className=" flex justify-center gap-2">
          <button
            className=" bg-primary text-primary-foreground px-4 py-1 rounded-sm uppercase hover:scale-105 "
            style={{ transition: "all 0.1s" }}
            onClick={() => {
              if (cardData.length !== 0) {
                setCardIndex((prev) => Math.max(0, prev - 1));
                setShowAns(false);
              }
            }}
          >
            prev
          </button>

          {isAdmin && (
            <>
              <button
                className=" bg-indigo-600 text-primary font-semibold text-sm  px-3 py-1.5 rounded-sm uppercase hover:scale-105 "
                style={{ transition: "all 0.1s" }}
                onClick={() => {
                  handleEdit(cardData[cardIndex]);
                }}
              >
                Edit
              </button>
              <button
                className=" bg-red-600 text-primary font-semibold text-sm  px-3 py-1.5 rounded-sm uppercase hover:scale-105 "
                style={{ transition: "all 0.1s" }}
                onClick={() => {
                  handleDelete(cardData[cardIndex]);
                }}
              >
                Delete
              </button>
            </>
          )}
          <button
            className=" bg-primary text-primary-foreground px-4 py-1 rounded-sm uppercase hover:scale-105"
            style={{ transition: "all 0.1s" }}
            onClick={() => {
              setCardIndex((prev) => Math.min(cardData.length - 1, prev + 1));
              setShowAns(false);
            }}
          >
            next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
