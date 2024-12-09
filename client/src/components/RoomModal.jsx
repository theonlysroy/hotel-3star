import axios from "axios";
import { useEffect, useState } from "react";

const BASE_URL = "http://127.0.0.1:8000/api/v1/room";

export default function RoomModal({ closeModal, setReload, roomTypes }) {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");

  const handleAddRoom = async () => {
    try {
      if (roomNumber && roomType) {
        const newRoom = {
          roomNumber: String(roomNumber),
          roomType,
        };
        const response = await axios.post(BASE_URL, newRoom, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response?.data?.success) {
          alert(response?.data?.message);
        }
        // Reset form fields and close the modal
        setRoomNumber("");
        setRoomType("");
        closeModal();
        setReload((prev) => !prev);
      } else {
        alert("Please enter room number and room type");
      }
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.error);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add New Room</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Room Number
          </label>
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Room Type
          </label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select a Room Type</option>
            {roomTypes?.map((roomType) => (
              <option key={roomType._id} value={roomType._id}>
                {roomType.typeName}
              </option>
            ))}
          </select>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAddRoom}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Room
          </button>
        </div>
      </div>
    </div>
  );
}
