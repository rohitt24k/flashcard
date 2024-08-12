import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import Card from "../home/card";
import Home from "../home";

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [loading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const questionFieldRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/auth/is-logged-in")
      .then((response) => {
        setIsLoggedIn(true);
      })
      .catch((error) => {
        setIsLoggedIn(false);
        navigate("/login");
      });
  }, []);

  function handleSumbit(e) {
    e.preventDefault();
    setIsLoading(true);
    if (isEditing) {
      axiosInstance
        .patch(`/cards/${editData.id}`, { ...formData })
        .then((data) => {
          console.log(data.data.data);
          setFormData({ question: "", answer: "" });
          setIsEditing(false);
          setRefetch((prev) => !prev);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axiosInstance
        .post("/cards", { ...formData })
        .then((data) => {
          console.log(data);
          setFormData({ question: "", answer: "" });
          setRefetch((prev) => !prev);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  function handleClear() {
    setIsEditing(false);
    setEditData({});
    setFormData({ question: "", answer: "" });
  }

  function handleEdit(cardData) {
    if (cardData) {
      cardData && setIsEditing(true);
      setEditData(cardData);
      questionFieldRef.current?.focus();
      setFormData({ question: cardData.question, answer: cardData.answer });
    }
  }

  function handleDelete(cardData) {
    cardData &&
      axiosInstance.delete(`/cards/${cardData?.id}`).then((response) => {
        console.log(response);
        setRefetch((prev) => !prev);
      });
  }

  return (
    <div className=" min-h-svh flex flex-col md:flex-row items-center md:gap-8">
      <div className=" bg-primary text-primary-foreground p-4 rounded-md mt-8">
        <p className=" text-2xl font-bold mb-2 ">Add a Card</p>
        <form onSubmit={handleSumbit} className=" w-[250px]">
          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium leading-6"
            >
              Question
            </label>
            <div className="mt-1">
              <textarea
                id="question"
                name="question"
                value={formData.question}
                onInput={(e) =>
                  setFormData((prev) => ({ ...prev, question: e.target.value }))
                }
                required
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-secondary px-2"
                ref={questionFieldRef}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mt-1">
              <label
                htmlFor="answer"
                className="block text-sm font-medium leading-6"
              >
                Answer
              </label>
            </div>
            <div className="mt-1">
              <textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onInput={(e) =>
                  setFormData((prev) => ({ ...prev, answer: e.target.value }))
                }
                required
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-secondary px-2"
              />
            </div>
          </div>

          <div className=" flex gap-2">
            <button
              type="submit"
              className=" mt-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading || !isLoggedIn}
            >
              {!loading ? (
                isEditing ? (
                  "Edit"
                ) : (
                  "Add Question"
                )
              ) : (
                <div class="flex items-center justify-center ">
                  <div class="loader"></div>
                </div>
              )}
            </button>
            <button
              type="button"
              className=" mt-4 flex w-full justify-center rounded-md bg-white border text-primary-foreground px-3 py-1.5 text-sm font-semibold leading-6 sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading || !isLoggedIn}
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col justify-center gap-2 ">
        <Home
          isAdmin={true}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          refetch={refetch}
        />
      </div>
    </div>
  );
}

export default Admin;
