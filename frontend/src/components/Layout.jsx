import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="bg-yellow-600 shadow-md text-stone-100 font-medium h-14 content-center">
        <ul className="flex place-content-end space-x-20 mr-8">
          <li className="my-auto">
            <Link to="/">Home</Link>
          </li>
          <li className="my-auto">
            <Link to="/menu">Menu</Link>
          </li>
          <li className="my-auto">
            <Link to="/contact">Contact</Link>
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