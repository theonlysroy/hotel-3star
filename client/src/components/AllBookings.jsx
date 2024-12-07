import { useEffect, useState } from "react";
import axios from "axios";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleBookingsDownload = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/v1/booking/download");
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bookings.csv"; // File name for the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCompleteBooking = async (bookingId) => {
    if (!bookingId) return;
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/booking/${bookingId}/vacate`,
      );
      //   console.log(response);
      alert(`Booking Paid and successfull!!`);
    } catch (error) {
      alert(`Failed to complete booking: ${error.response.data.message}`);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/booking", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.data.success) {
        throw new Error("Failed to fetch bookings");
      }
      return response.data.data;
    } catch (error) {
      setError("Error fetching bookings: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBookings()
      .then((bookings) => setBookings(bookings))
      .catch((err) => console.error(error));
  }, []);

  if (loading) {
    return <div className="text-center text-blue-600">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Bookings List</h1>

      <button
        className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-yellow-600"
        onClick={handleBookingsDownload}
      >
        DOWNLOAD CSV
      </button>
      <div className="overflow-x-auto py-10">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-800 text-white text-left">
              <th className="px-4 py-2 border-b">Booking ID</th>
              <th className="px-4 py-2 border-b">Customer Name</th>
              <th className="px-4 py-2 border-b">Room Number</th>
              <th className="px-4 py-2 border-b">Check In</th>
              <th className="px-4 py-2 border-b">Check Out</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Cost</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b border-gray-800">
                <td className="px-4 py-2">{booking?._id}</td>
                <td className="px-4 py-2">{booking?.customerName}</td>
                <td className="px-4 py-2">{booking?.roomNumber}</td>
                <td className="px-4 py-2">
                  {new Date(booking?.checkInTime).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {new Date(booking?.checkOutTime).toLocaleString()}
                </td>
                <td className="px-4 py-2">{booking?.status}</td>
                <td className="px-4 py-2 font-semibold">
                  $ {booking?.cost || ""}
                </td>
                {booking.status === "Completed" ? (
                  <td className="bg-gray-400 text-white text-sm text-center rounded-lg">
                    Completed
                  </td>
                ) : (
                  <td className="text-center font-semibold text-sm bg-blue-500 text-white hover:bg-blue-700 cursor-pointer rounded-lg">
                    <button onClick={() => handleCompleteBooking(booking._id)}>
                      Complete booking
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
