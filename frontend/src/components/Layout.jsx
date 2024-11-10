import { Outlet, Link } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";

const Layout = () => {
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
            <Link to="/login"><button className="py-1 px-4 bg-yellow-800 rounded shadow-md">Login</button></Link>
          </li>
        </ul>
      </nav>

      <Outlet/>
    </>
  )
};

export default Layout;