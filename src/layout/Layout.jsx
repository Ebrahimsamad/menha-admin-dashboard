import { Outlet } from "react-router-dom";
import Navbar from "../features/layout/Navbar";
import { useAuth } from "../context/AuthContext";

function Layout() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated ? <Navbar /> : <></>}

      <>
        <Outlet />
      </>
    </>
  );
}

export default Layout;
