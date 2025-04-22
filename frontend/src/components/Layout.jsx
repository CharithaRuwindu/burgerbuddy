import { Outlet, Link, useNavigate } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdLogout, MdError } from "react-icons/md";
import { TiTick } from "react-icons/ti";

const Layout = () => {
  const [logoutConfirmDialogOpen, setLogoutConfirmDialogOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    const userData = sessionStorage.getItem("user");

    if (token && userData) {
      const user = JSON.parse(userData);
      const userRole = user.role;

      if (userRole === "Admin") {
        navigate("/admsidebar");
      } else if (userRole === "Customer") {
        setIsLoggedIn(true);
      } else {
        navigate("/menu");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    setLogoutConfirmDialogOpen(true);
  };

  const logoutConfirmation = async () => {
      try {
        const refreshToken = sessionStorage.getItem('refreshToken');
  
        await axios.post('/api/Auth/logout', { refreshToken });
        setLogoutConfirmDialogOpen(false);
        displayAlert("Logout successful", "success");
        sessionStorage.clear();
        setIsLoggedIn(false);

        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } catch (error) {
        displayAlert("Logout unsuccessful", "error");
        console.error('Logout failed:', error);
      }
    };

    const displayAlert = (message, type) => {
      setAlertMessage(message);
      setAlertType(type);
      setShowAlert(true);
  
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    };

  return (
    <>
      <nav className="bg-yellow-600 shadow-md text-stone-100 font-medium h-[8vh] content-center">
        <ul className="flex place-content-end space-x-20 mr-8">
          <li className="my-auto">
            <Link to="/">Home</Link>
          </li>
          <li className="my-auto">
            <Link to="/menu">Menu</Link>
          </li>
          <li className="my-auto text-2xl">
            <Link to="/cart"><BsCart4 /></Link>
          </li>
          <li className="my-auto">
          {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="py-1 px-4 bg-yellow-800 rounded shadow-md"
              >
                Logout
              </button>
            ) : (
              <Link to="/login">
                <button className="py-1 px-4 bg-yellow-800 rounded shadow-md">
                  Login
                </button>
              </Link>
            )}
          </li>
        </ul>

        {logoutConfirmDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all">
                    <div className="text-center">
                      <>
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                          <MdLogout className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Logout</h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            You are about to logout. Do you confirm?
                          </p>
                        </div>
                      </>
                    </div>
        
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="button"
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm bg-green-600 hover:bg-green-700 focus:ring-green-500`}
                        onClick={logoutConfirmation}
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={() => setLogoutConfirmDialogOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

        {showAlert &&
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all">
                    <div className="text-center">
                      {alertType === 'error' ? (
                        <>
                          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                            <MdError className="h-10 w-10 text-red-600" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900 mb-2">ERROR</h3>
                          <div className="mt-2">
                            <p className="text-lg text-gray-500">
                              {alertMessage}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <TiTick className="h-10 w-10 text-green-600" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-900 mb-2">SUCCESS</h3>
                          <div className="mt-2">
                            <p className="text-lg text-gray-500">
                              {alertMessage}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              }
      </nav>

      <Outlet/>
    </>
  )
};

export default Layout;