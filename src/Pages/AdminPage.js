import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [userDashboard, setUserDashboard] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const BASE_URL = "http://localhost:5000";
  const socket = io("http://localhost:5000");

  socket.on("adminNotification", (data) => {
    toast(data.message);
  });
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/all-users`)
      .then((response) => {
        const userEmails = response.data.map((user) => user.email);
        setUsers(userEmails);
      })
      .catch((error) => {
        console.error("Error fetching user emails:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedUserEmail) {
      axios
        .get(
          `${BASE_URL}/user/dashboard/email/${encodeURIComponent(
            selectedUserEmail
          )}`
        )
        .then((response) => {
          setUserDashboard(response.data.cards);
        })
        .catch((error) => {
          console.error("Error fetching user dashboard:", error);
        });
    }
  }, [selectedUserEmail]);
  const [editPriority, setEditPriority] = useState("");
  const [editReminder, setEditReminder] = useState("");

  const handleSaveEdit = (id) => {
    const url = `${BASE_URL}/user/dashboard/email/${encodeURIComponent(
      selectedUserEmail
    )}/item/${id}`;
    console.log("Request URL:", url);
    axios
      .put(
        `${BASE_URL}/user/dashboard/email/${encodeURIComponent(
          selectedUserEmail
        )}/card/${id}`,
        {
          newText: editValue,
          newPriority: editPriority || "low",
          newReminder: editReminder || "",
        }
      )
      .then((response) => {
        setUserDashboard(response.data.cards);
        setIsEditing(null);
        setEditValue("");
      })
      .catch((error) => {
        console.error("Error updating item:", error);
      });
  };
  const moveCard = (currentIndex, targetIndex) => {
    const updatedDashboard = [...userDashboard];
    const [removedCard] = updatedDashboard.splice(currentIndex, 1);
    updatedDashboard.splice(targetIndex, 0, removedCard);

    setUserDashboard(updatedDashboard);

    axios
      .put(
        `${BASE_URL}/user/dashboard/email/${encodeURIComponent(
          selectedUserEmail
        )}`,
        {
          cards: updatedDashboard,
        }
      )
      .then((response) => {
        console.log("Dashboard updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating dashboard:", error);
      });
  };

  return (
    <div className="bg-[#8F3F65] min-h-screen p-6">
      {/* User Selection Dropdown */}
      <div className="mb-6">
        <label className="block text-white mb-2" htmlFor="userSelect">
          Select a user
        </label>
        <select
          id="userSelect"
          value={selectedUserEmail}
          onChange={(e) => setSelectedUserEmail(e.target.value)}
          className="block w-full bg-white rounded-md p-2"
        >
          <option value="" disabled>
            Select a user
          </option>
          {users.map((userEmail) => (
            <option key={userEmail} value={userEmail}>
              {userEmail}
            </option>
          ))}
        </select>
      </div>

      {/* Render User's Dashboard */}
      <div className="flex flex-wrap">
        {userDashboard.map((card, cardIndex) => (
          <div
            key={cardIndex}
            className="bg-black w-1/6 ml-3 mt-3 text-[#a6b1bd] p-3 rounded-lg flex flex-col"
          >
            {card.map((item) =>
              isEditing === item.id ? (
                <div className="flex flex-col" key={item.id}>
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="mb-2 p-2 rounded-md"
                  />
                  <div className="mt-2 mb-2">
                    <label className="text-white mr-2">Priority:</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="p-1 rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="mt-2 mb-2">
                    <label className="text-white mr-2">Reminder:</label>
                    <input
                      type="datetime-local"
                      value={editReminder}
                      onChange={(e) => setEditReminder(e.target.value)}
                      className="p-1 rounded-md"
                    />
                  </div>
                  <button
                    className="text-white p-2 rounded-md mb-2"
                    onClick={() => handleSaveEdit(item.id)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex flex-col mt-3" key={item.id}>
                  <h1 className="ml-2">{item.text}</h1>
                  <div className="mt-2">
                    Priority:{" "}
                    <span className="text-white">{item.priority}</span>
                  </div>
                  <div className="mt-2">
                    Reminder:{" "}
                    <span className="text-white">{item.reminder}</span>
                  </div>
                  <div className="flex mt-2">
                    <button
                      className="text-white p-2 rounded-md"
                      onClick={() => {
                        setIsEditing(item.id);
                        setEditValue(item.text);
                        setEditPriority(item.priority);
                        setEditReminder(item.reminder || "");
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )
            )}
            <div className="mt-2">
              <label className="text-white mr-2">Move to position:</label>
              <select
                defaultValue={cardIndex}
                onChange={(e) => moveCard(cardIndex, Number(e.target.value))}
                className="p-1 rounded-md"
              >
                {userDashboard.map((_, index) => (
                  <option key={index} value={index}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
