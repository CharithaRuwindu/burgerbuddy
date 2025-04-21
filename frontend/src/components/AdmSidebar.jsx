import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { MdDashboard, MdPerson, MdFastfood, MdDeliveryDining, MdLogout, MdError } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import axios from 'axios';

const drawerWidth = 240;

const AdmSidebar = () => {
  const [logoutConfirmDialogOpen, setLogoutConfirmDialogOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: '/admindashboard',
      icon: <MdDashboard size={20} />,
      label: 'Dashboard'
    },
    {
      path: '/users',
      icon: <MdPerson size={20} />,
      label: 'Users'
    },
    {
      path: '/items',
      icon: <MdFastfood size={20} />,
      label: 'Items'
    },
    {
      path: '/orders',
      icon: <MdDeliveryDining size={20} />,
      label: 'Orders'
    }
  ];

  useEffect(() => {
    if (location.pathname === '/admsidebar' ||
      (location.pathname !== '/admindashboard' &&
        location.pathname !== '/users' &&
        location.pathname !== '/items' &&
        location.pathname !== '/orders')) {
      navigate('/admindashboard');
    }
  }, [location.pathname, navigate]);

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
    <div
      className="h-screen fixed left-0 top-0 bg-white border-r border-gray-200"
      style={{ width: `${drawerWidth}px` }}
    >
      <div className="flex items-center h-16 px-4 bg-yellow-600 text-stone-100">
        <h2 className="text-xl font-bold">Admin Portal</h2>
      </div>

      <div className="h-px w-full bg-gray-200"></div>

      <nav className="py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`
                flex items-center px-4 py-4 mx-2 rounded-md cursor-pointer transition-colors
                ${isActive(item.path)
                  ? 'bg-gray-100 hover:bg-gray-100'
                  : 'hover:bg-gray-50'}
              `}
              onClick={() => navigate(item.path)}
            >
              <div className={`mr-4 ${isActive(item.path) ? 'text-yellow-600' : 'text-gray-600'}`}>
                {item.icon}
              </div>
              <span className={`text-md ${isActive(item.path) ? 'font-bold text-yellow-600' : 'text-gray-700'}`}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex-grow h-[40%]"></div>

      <div className="border-t border-gray-200 w-full">
        <div
          className="flex items-center px-6 py-4 cursor-pointer hover:bg-gray-50 text-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            handleLogout();
        }}
        >
          <div className="mr-4 text-gray-600">
            <MdLogout size={20} />
          </div>
          <span className="text-md">Logout</span>
        </div>
      </div>

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
    </div>
  );
};

export default AdmSidebar;