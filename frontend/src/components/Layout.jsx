import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="bg-yellow-600 h-14 content-center">
        <ul className="flex place-content-end space-x-20 mr-8">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/menu">Menu</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <button className="bg-slate-400 w-16 h-8"><Link to="/login">Login</Link></button>
          </li>
        </ul>
      </nav>

      <Outlet/>
    </>
  )
};

export default Layout;