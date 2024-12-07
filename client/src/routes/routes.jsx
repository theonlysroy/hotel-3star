import { createRoutesFromElements, Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Rooms from "../pages/Rooms";
import Signin from "../pages/Signin";
import Booking from "../components/Booking";
import AllBookings from "../components/AllBookings";
import Test from "../components/Test";
import RoomTypes from "../components/RoomTypes";

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="register" element={<Signup />} />
    <Route path="login" element={<Signin />} />
    <Route path="rooms" element={<Rooms />} />
    <Route path="bookings/:roomId" element={<Booking />} />
    <Route path="bookings" element={<AllBookings />} />
    <Route path="room-types" element={<RoomTypes />} />
    <Route
      path="success"
      element={<h1 className="text-green-500 text-5xl">Success</h1>}
    />
    <Route
      path="cancel"
      element={<h1 className="text-red-500 text-5xl">Cancel</h1>}
    />
    <Route path="test" element={<Test />} />
  </Route>,
);

export default routes;
