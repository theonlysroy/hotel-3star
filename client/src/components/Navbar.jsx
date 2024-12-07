import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../assets/hotel3star.png";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate("/");
  };
  return (
    <header className="w-full shadow sticky top-0 z-50">
      <nav className="bg-white px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <img src={logo} className="h-12 ml-3 invert" alt="Logo" />
          </Link>

          {localStorage.getItem("token") ? (
            <>
              <div className="order-3 flex gap-6 font-semibold text-2xl text-gray-900 items-center">
                <span>Admin</span>
                <button
                  className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
              <div
                className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                id="mobile-menu-2"
              >
                <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0 ${
                          isActive ? "text-orange-500" : "text-gray-900"
                        }`
                      }
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/rooms"
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0 ${
                          isActive ? "text-orange-500" : "text-gray-900"
                        }`
                      }
                    >
                      Rooms
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/bookings"
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0 ${
                          isActive ? "text-orange-500" : "text-gray-900"
                        }`
                      }
                    >
                      Bookings
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/room-types"
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0 ${
                          isActive ? "text-orange-500" : "text-gray-900"
                        }`
                      }
                    >
                      Room-Types
                    </NavLink>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center lg:order-2">
                <Link
                  to="/login"
                  className="text-gray-900 font-sans font-semibold hover:bg-gray-500 hover:text-gray-50 focus:ring-4 focus:ring-gray-300 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                >
                  Get started
                </Link>
              </div>
              <div
                className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                id="mobile-menu-2"
              >
                <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0 ${
                          isActive ? "text-orange-500" : "text-gray-900"
                        }`
                      }
                    >
                      Home
                    </NavLink>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
