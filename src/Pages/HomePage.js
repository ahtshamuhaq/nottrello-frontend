import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { dataBase } from "../firebase/FirebaseCofig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import Ably from "ably";
import { toast } from "react-toastify";

const HomePage = () => {
  const history = useNavigate();
  const { currentUser } = useAuth();

  const BASE_URL = "https://weak-ruby-oyster-ring.cyclic.app/";
  const ably = new Ably.Realtime(
    "vrXrCA.OqwQXw:KQOb4-ZvefpMcDN-vfk1-meGK30RdJhkQGCsr1sjCmU"
  );
  const reminderChannel = ably.channels.get("reminder");
  const notificationChannel = ably.channels.get("notifications");

  useEffect(() => {
    const messageHandler = (message) => {
      toast(message.data.message);
    };
    reminderChannel.subscribe("notify", messageHandler);
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.email) {
      axios
        .get(
          `${BASE_URL}/user/dashboard/email/${encodeURIComponent(
            currentUser.email
          )}`
        )
        .then((response) => {
          console.log("frontend", response.data.cards);
          setCards(response.data.cards);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [currentUser]);

  const editTodoItem = (cardIndex, id, newText) => {
    const newCards = [...cards];
    const newCard = newCards[cardIndex]
      ? newCards[cardIndex].map((item) =>
          item.id === id ? { ...item, text: newText } : item
        )
      : [];
    newCards[cardIndex] = newCard;
    setCards(newCards);
  };

  const moveTodoItemToCard = (fromCardIndex, itemId, toCardIndex) => {
    const newCards = [...cards];

    const itemToMove = newCards[fromCardIndex].find(
      (item) => item.id === itemId
    );

    if (!itemToMove) {
      console.warn(`No item found with id ${itemId}`);
      return;
    }

    newCards[fromCardIndex] = newCards[fromCardIndex].filter(
      (item) => item.id !== itemId
    );
    newCards[toCardIndex].push(itemToMove);

    setCards(newCards);
    const targetCardTitle = cards[toCardIndex].find(
      (item) => item.type === "title"
    ).text;
    if (targetCardTitle.toLowerCase() === "done") {
      notificationChannel.publish("cardMovedToDone", {
        message: "Card moved to done by " + currentUser.email,
      });
    }

    axios
      .put(
        `${BASE_URL}/user/dashboard/email/${encodeURIComponent(
          currentUser.email
        )}`,
        { cards: newCards }
      )
      .then((response) => {
        console.log("Data successfully updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };
  const addItemForCard = (cardIndex, text) => {
    const newCards = [...cards];
    newCards[cardIndex].push({
      id: Date.now(),
      text,
      type: "item",
      priority: "medium",
      reminder: "",
    });
    setCards(newCards);

    axios
      .put(
        `${BASE_URL}/user/dashboard/email/${encodeURIComponent(
          currentUser.email
        )}`,
        { cards: newCards }
      )
      .then((response) => {
        console.log("Data successfully updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };
  const deleteTodoItem = (cardIndex, id) => {
    const newCards = [...cards];
    if (!newCards[cardIndex]) {
      console.warn(`No card found at index ${cardIndex}`);
      return;
    }
    newCards[cardIndex] = newCards[cardIndex].filter((item) => item.id !== id);
    setCards(newCards);

    axios
      .put(
        `${BASE_URL}/user/dashboard/email/${encodeURIComponent(
          currentUser.email
        )}`,
        { cards: newCards }
      )
      .then((response) => {
        console.log("Data successfully updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const handleClick = () => {
    signOut(dataBase).then((val) => {
      console.log(val, "val");
      history("/");
    });
  };
  const [isEditing, setIsEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (id, currentText) => {
    setIsEditing(id);
    setEditValue(currentText);
  };

  const findCardIndexOfItem = (id) => {
    return cards.findIndex((card) => card.some((item) => item.id === id));
  };

  const saveEdit = (id) => {
    const cardIndex = findCardIndexOfItem(id);
    if (cardIndex !== -1) {
      editTodoItem(cardIndex, id, editValue);
      setIsEditing(null);

      axios
        .put(
          `${BASE_URL}/user/dashboard/email/${encodeURIComponent(
            currentUser.email
          )}`,
          { cards: cards }
        )
        .then((response) => {
          console.log("Data successfully updated:", response.data);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    }
  };

  const [cardsVisibility, setCardsVisibility] = useState([true]);

  const [cards, setCards] = useState([
    [{ id: 0, text: "Initial Title", type: "title" }],
  ]);

  const addNewCard = () => {
    setCards([
      ...cards,
      [
        {
          id: Date.now(),
          text: "Default Title",
          type: "title",
          priority: "medium",
          reminder: "",
        },
      ],
    ]);
    setCardsVisibility([...cardsVisibility, true]);
  };

  const deleteWholeCard = (cardIndex) => {
    const newCards = [...cards];
    const newVisibilities = [...cardsVisibility];
    newCards.splice(cardIndex, 1);
    newVisibilities.splice(cardIndex, 1);
    setCards(newCards);
    setCardsVisibility(newVisibilities);
    axios
      .put(
        `${BASE_URL}/user/dashboard/email/${encodeURIComponent(
          currentUser.email
        )}`,
        { cards: newCards }
      )
      .then((response) => {
        console.log("Data successfully updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };
  const updatePriority = (cardIndex, itemId, newPriority) => {
    const newCards = [...cards];
    const itemToUpdate = newCards[cardIndex].find((item) => item.id === itemId);
    if (itemToUpdate) {
      itemToUpdate.priority = newPriority;
    }
    setCards(newCards);

    axios
      .put(
        `${BASE_URL}/user/dashboard/email/${encodeURIComponent(
          currentUser.email
        )}`,
        { cards: newCards }
      )
      .then((response) => {
        console.log("Data successfully updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const updateReminder = (cardIndex, itemId, newReminderDateTime) => {
    const newCards = [...cards];
    const itemToUpdate = newCards[cardIndex].find((item) => item.id === itemId);
    if (itemToUpdate) {
      itemToUpdate.reminder = newReminderDateTime;
    }
    setCards(newCards);

    axios
      .put(
        `${BASE_URL}/user/dashboard/email/${encodeURIComponent(
          currentUser.email
        )}`,
        { cards: newCards }
      )
      .then((response) => {
        console.log("Data successfully updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  return (
    <div className="bg-[#8F3F65] min-h-screen">
      <div className="bg-[#6D304D] p-3">
        <div className=" w-11/12 mx-auto flex justify-between">
          <h1 className="text-white font-semibold text-2xl">
            NOTTRELLO DASHBOARD
          </h1>
          <div>
            <h1 className="text-white font-semibold text-2xl">USER-PANEL</h1>
          </div>
        </div>
        <div className=" w-11/12 mx-auto flex justify-between mt-4">
          <h1 className="text-white font-semibold text-2xl">Welcome!</h1>
          <div>
            <button
              className="px-4 py-2 bg-black text-red-800 "
              onClick={handleClick}
            >
              SignOut
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-start items-start mt-4">
        {cards.map((todoItems, cardIndex) => {
          return (
            <div
              key={cardIndex}
              className="bg-black w-1/6 ml-3 mt-3 text-[#a6b1bd] p-3 rounded-lg flex flex-col"
            >
              {todoItems
                .filter((item) => item.type === "title")
                .map((title) => (
                  <div className="flex flex-col">
                    {isEditing === title.id ? (
                      <>
                        <input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                        <button
                          className="text-white"
                          onClick={() => saveEdit(title.id)}
                        >
                          Save Title
                        </button>
                        <button
                          className="ml-3 flex items-center justify-center text-red-500 hover:text-red-700 transition "
                          onClick={() => deleteWholeCard(cardIndex)}
                        >
                          <i className="material-icons">delete</i>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <h1>{title.text}</h1>
                          <div className="flex items-center justify-center text-gray-600 hover:text-gray-800 transition">
                            <button
                              onClick={() => startEditing(title.id, title.text)}
                            >
                              <i className="material-icons">edit</i>
                            </button>

                            <button
                              className="ml-3 flex items-center justify-center text-red-500 hover:text-red-700 transition "
                              onClick={() => deleteWholeCard(cardIndex)}
                            >
                              <i className="material-icons">delete</i>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}

              {todoItems
                .filter((item) => item.type === "item")
                .map((item) => (
                  <div className="flex flex-col mt-3" key={item.id}>
                    {isEditing === item.id ? (
                      <>
                        <input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="ml-2"
                        />
                        <button onClick={() => saveEdit(item.id)}>Save</button>
                      </>
                    ) : (
                      <>
                        <h1 className=" rounded-xl bg-slate-500 p-2">
                          {item.text}
                        </h1>
                        <div className="flex mt-2 justify-between">
                          <button
                            onClick={() => startEditing(item.id, item.text)}
                          >
                            <i className="material-icons">edit</i>
                          </button>
                          <button
                            className="ml-3"
                            onClick={() => deleteTodoItem(cardIndex, item.id)}
                          >
                            <i className="material-icons">delete</i>
                          </button>
                        </div>

                        <select
                          value={item.priority}
                          onChange={(e) =>
                            updatePriority(cardIndex, item.id, e.target.value)
                          }
                          className="mt-2 mb-2"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>

                        <input
                          type="datetime-local"
                          value={item.reminder || ""}
                          onChange={(e) =>
                            updateReminder(cardIndex, item.id, e.target.value)
                          }
                        />
                        <div className="mt-2 flex justify-between">
                          Move to:
                          <select
                            onChange={(e) =>
                              moveTodoItemToCard(
                                cardIndex,
                                item.id,
                                +e.target.value
                              )
                            }
                          >
                            <option value="">Select Card</option>
                            {cards.map((_, index) =>
                              index !== cardIndex ? (
                                <option key={index} value={index}>
                                  Card {index + 1}
                                </option>
                              ) : null
                            )}
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              <button
                className="mt-3 bg-gray-600 p-2 rounded-xl"
                onClick={() => addItemForCard(cardIndex, "New Item")}
              >
                Add an item
              </button>
            </div>
          );
        })}
        <button
          className="flex items-center justify-center bg-[#ad738e] text-white mt-5 p-3 ml-3 rounded-3xl transition"
          onClick={addNewCard}
        >
          <i className="material-icons">add</i> CREATE NEW CARD
        </button>
      </div>
    </div>
  );
};
export default HomePage;
