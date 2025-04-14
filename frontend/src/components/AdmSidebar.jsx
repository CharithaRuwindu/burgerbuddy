import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { MdDashboard, MdPerson, MdFastfood, MdDeliveryDining, MdLogout } from "react-icons/md";

const drawerWidth = 240;

const AdmSidebar = () => {
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    navigate('/login');
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
      <div className="flex-grow"></div>

      <div className="border-t border-gray-200 w-full">
        <div 
          className="flex items-center px-6 py-4 cursor-pointer hover:bg-gray-50 text-gray-700"
          onClick={handleLogout}
        >
          <div className="mr-4 text-gray-600">
            <MdLogout size={20} />
          </div>
          <span className="text-md">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default AdmSidebar;