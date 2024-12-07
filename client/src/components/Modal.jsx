import axios from "axios";
import { useState } from "react";

const BASE_URL = "http://127.0.0.1:8000/api/v1/room-type";

export default function Modal({ closeModal, setReload }) {
  const [typeName, setTypeName] = useState("");
  const [bedroomCount, setBedroomCount] = useState("");
  const [isAirconditioned, setIsAirconditioned] = useState(false);
  const [hasBathtub, setHasBathtub] = useState(false);
  const [hasTv, setHasTv] = useState(false);
  const [hasBalcony, setHasBalcony] = useState(false);
  const [costPerDay, setCostPerDay] = useState("");

  const handleAddRoomType = async () => {
    try {
      if (
        typeName &&
        bedroomCount &&
        costPerDay &&
        !isNaN(bedroomCount) &&
        !isNaN(costPerDay)
      ) {
        const newRoomType = {
          typeName,
          bedroomCount: parseInt(bedroomCount),
          isAirconditioned,
          hasBathtub,
          hasTv,
          hasBalcony,
          costPerDay: parseInt(costPerDay),
        };
        const response = await axios.post(BASE_URL, newRoomType, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response?.data?.success) {
          alert(response?.data?.message);
        }
        // Reset form fields and close the modal
        setBedroomCount("");
        setIsAirconditioned(false);
        setHasBathtub(false);
        setHasTv(false);
        setHasBalcony(false);
        closeModal();
        setReload((prev) => !prev);
      } else {
        alert("Please enter a valid bedroom count and cost per day");
      }
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add New Room Type</h2>

        {/* Room type name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Unique type name
          </label>
          <input
            type="text"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            min="1"
          />
        </div>

        {/* Bedroom Count */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Bedroom Count
          </label>
          <input
            type="number"
            value={bedroomCount}
            onChange={(e) => setBedroomCount(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            min="1"
          />
        </div>

        {/* Checkbox Fields */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isAirconditioned}
              onChange={() => setIsAirconditioned(!isAirconditioned)}
              className="mr-2"
            />
            <label>Air-conditioned</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={hasBathtub}
              onChange={() => setHasBathtub(!hasBathtub)}
              className="mr-2"
            />
            <label>Has Bathtub</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={hasTv}
              onChange={() => setHasTv(!hasTv)}
              className="mr-2"
            />
            <label>Has TV</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={hasBalcony}
              onChange={() => setHasBalcony(!hasBalcony)}
              className="mr-2"
            />
            <label>Has Balcony</label>
          </div>
        </div>

        {/* Cost */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Cost per Day
          </label>
          <input
            type="number"
            value={costPerDay}
            onChange={(e) => setCostPerDay(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            min="1"
          />
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
            onClick={handleAddRoomType}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Room
          </button>
        </div>
      </div>
    </div>
  );
}
