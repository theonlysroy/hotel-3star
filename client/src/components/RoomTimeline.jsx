// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

export default function RoomTimeline() {
  //   const navigate = useNavigate();
  //   useEffect(() => {
  //     if (!localStorage.getItem("token")) {
  //       navigate("/login");
  //     }
  //   }, []);
  const data = [
    {
      startTime: "2024-11-14T05:06:06.000Z",
      endTime: "2024-11-14T11:29:43.422Z",
      bookingId: "6735853e549897d34c3d195f",
    },
    {
      startTime: "2024-11-14T11:31:55.916Z",
      endTime: "2024-11-14T11:40:23.609Z",
      maintenanceId: "6735dfab2e5ea7cacd85cf6a",
    },
    {
      startTime: "2024-11-14T11:41:18.000Z",
      endTime: "2024-11-15T07:43:27.152Z",
      bookingId: "6735e1de17b6411ec7e0cba3",
    },
    {
      startTime: "2024-11-15T07:44:02.000Z",
      endTime: "2024-11-16T07:44:02.000Z",
      bookingId: "6736fbc23ffaf32d88c6200e",
    },
  ];
  return (
    <div className="p-10 bg-gray-200 min-h-screen">
      <h1 className="mb-4">
        RoomId: <span className="font-semibold">6735806a7e5d82f97282ebbd</span>
      </h1>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full table-auto bg-white text-gray-900">
          <thead>
            <tr className="border-b bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Bookings</th>
              <th className="px-4 py-3">Maintenances</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition duration-200 ease-in-out"
              >
                <td className="px-4 py-3">
                  {new Date(item.startTime).toDateString()}
                </td>
                <td className="px-4 py-3">{item.bookingId || "-"}</td>
                <td className="px-4 py-3">{item.maintenanceId || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
