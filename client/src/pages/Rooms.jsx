import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RoomModal from "../components/RoomModal";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAddRoom = () => {
    openModal();
  };

  const fetchData = async () => {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/v1/room?isOccupied=false`,
    );
    setRooms(response.data?.data);
  };
  const fetchRoomtypeData = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/room-type`);
    setRoomTypes(response?.data?.data);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    fetchData();
    fetchRoomtypeData();
  }, [reload]);
  return (
    <div className="w-full p-10 min-h-screen">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={handleAddRoom}
      >
        ADD ROOM
      </button>
      {showModal && (
        <RoomModal
          closeModal={closeModal}
          setReload={setReload}
          roomTypes={roomTypes}
        />
      )}
      <h1 className="text-6xl font-bold text-center">Available Rooms</h1>
      <div className="grid grid-cols-3 gap-4 p-20">
        {rooms.length === 0 && <p>No available rooms currently...</p>}
        {rooms.map((room) => (
          <RoomCard key={room._id} roomId={room._id} room={room} />
        ))}
      </div>
    </div>
  );
}

const RoomCard = ({ room, roomId }) => {
  const navigate = useNavigate();
  const handleClick = (roomId) => {
    navigate(`/bookings/${roomId}`);
  };
  return (
    <div className="max-w-xs rounded-lg bg-slate-800 shadow-md">
      {/* Image */}
      <img
        src={
          room?.coverPhoto
            ? `http://127.0.0.1:8000/api/v1/public/${room?.coverPhoto}`
            : "https://fastly.picsum.photos/id/173/1200/737.jpg?hmac=ujJhJBX1oswhCjRKDEeHR3kHWi-wfK6Q6UhhHuJo9hY"
        }
        alt="Room image"
        className="w-full h-52 object-cover rounded-lg"
      />

      {/* Room Details */}
      <div className="p-4">
        <h2 className="text-2xl font-semibold text-gray-100">
          {room?.roomNumber}
        </h2>
        <p className="text-white mt-2">
          Room-type:{" "}
          <span className="text-orange-400">
            {room?.roomTypeDetails?.typeName || ""}
          </span>
        </p>
        <div className="flex flex-wrap mt-4 space-x-4">
          {/* Air Conditioning */}
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                room.roomTypeDetails.isAirConditioned
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></span>
            <span className="text-gray-100">
              {room.roomTypeDetails.isAirConditioned
                ? "Air-Conditioned"
                : "No AC"}
            </span>
          </div>

          {/* Bedrooms */}
          <div className="flex items-center">
            <span className="text-gray-100">
              Bedrooms: {room.roomTypeDetails.bedroomCount}
            </span>
          </div>

          {/* Balcony */}
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                room.roomTypeDetails.hasBalcony ? "bg-blue-500" : "bg-gray-400"
              }`}
            ></span>
            <span className="text-gray-100">
              {room.roomTypeDetails.hasBalcony ? "Has Balcony" : "No Balcony"}
            </span>
          </div>

          {/* Baathtub */}
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                room.roomTypeDetails.hasBathtub ? "bg-blue-500" : "bg-gray-400"
              }`}
            ></span>
            <span className="text-gray-100">
              {room.roomTypeDetails.hasBathtub ? "Has Bathtub" : "No Bathtub"}
            </span>
          </div>

          {/* Tv */}
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full mr-2 ${
                room.roomTypeDetails.hasTv ? "bg-blue-500" : "bg-gray-400"
              }`}
            ></span>
            <span className="text-gray-100">
              {room.roomTypeDetails.hasTv ? "Has Tv" : "No Tv"}
            </span>
          </div>
        </div>
        {/* Price */}
        <div className="mt-4 text-2xl font-semibold text-white drop-shadow-[0px_0px_12px_rgba(246,245,244,1)]">{`$${
          room.roomTypeDetails?.costPerDay || ""
        } / day`}</div>
      </div>
      <button
        className="px-6 py-2 bg-blue-500 font-semibold text-white rounded-lg m-4 hover:bg-blue-800 transition-colors duration-100"
        onClick={() => handleClick(roomId)}
      >
        Book
      </button>
    </div>
  );
};
