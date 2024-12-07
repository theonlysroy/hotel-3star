import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal";

export default function RoomTypes() {
  const navigate = useNavigate();
  const [roomTypes, setRoomTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAddRoomtype = (e) => {
    openModal();
  };

  const handleEdit = (roomTypeId) => {};
  const handleDelete = (roomTypeId) => {};

  const fetchData = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/room-type`);
    setRoomTypes(response?.data?.data);
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    fetchData();
  }, [reload]);
  return (
    <div className="w-full min-h-screen p-10">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={handleAddRoomtype}
      >
        ADD ROOM TYPE
      </button>
      {showModal && <Modal closeModal={closeModal} setReload={setReload} />}
      <h1 className="text-6xl font-bold text-center">Room Types</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-20">
        {roomTypes.length === 0 && <p>No rooms types found...</p>}
        {roomTypes.map((roomType) => (
          <RoomTypeCard key={roomType?._id} roomType={roomType} />
        ))}
      </div>
    </div>
  );
}
function RoomTypeCard({ roomType }) {
  return (
    <div className="max-w-md rounded-lg border border-gray-300 shadow-md overflow-hidden bg-gray-800 text-white">
      {/* Room Type Details */}
      <div className="p-4">
        <p className="text-lg">{`Type: ${roomType?.typeName || ""}`}</p>
        <span className=" font-semibold">{`Bedrooms: ${roomType?.bedroomCount}`}</span>

        <div className="grid grid-cols-2 gap-1 mt-4">
          {/* Air Conditioning */}
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                roomType?.isAirconditioned ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span className="">
              {roomType?.isAirconditioned ? "Air-Conditioned" : "No AC"}
            </span>
          </div>

          {/* Balcony */}
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                roomType?.hasBalcony ? "bg-blue-500" : "bg-gray-400"
              }`}
            ></span>
            <span className="">
              {roomType?.hasBalcony ? "Has Balcony" : "No Balcony"}
            </span>
          </div>

          {/* Baathtub */}
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                roomType?.hasBathtub ? "bg-blue-500" : "bg-gray-400"
              }`}
            ></span>
            <span className="">
              {roomType?.hasBathtub ? "Has Bathtub" : "No Bathtub"}
            </span>
          </div>

          {/* Tv */}
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                roomType?.hasTv ? "bg-blue-500" : "bg-gray-400"
              }`}
            ></span>
            <span className="">{roomType?.hasTv ? "Has Tv" : "No Tv"}</span>
          </div>
          <p className="">
            Cost per day:{" "}
            <span className="font-semibold text-orange-400">
              $ {roomType?.costPerDay || "0"}
            </span>
          </p>
        </div>
        <div className="space-x-2">
          <button
            className="border border-red-400 px-2.5 py-1 mt-4 rounded-lg hover:bg-red-400 transition-all duration-100"
            onClick={() => handleDelete(roomType?._id)}
          >
            Delete
          </button>
          <button
            className="px-2.5 py-1 mt-4 rounded-lg bg-indigo-500 hover:bg-indigo-700 font-semibold tracking-wider transition-all duration-100"
            onClick={() => handleEdit(roomType?._id)}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
