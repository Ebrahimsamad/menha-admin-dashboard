// import { Outlet } from "react-router-dom";
// import Navbar from "../features/layout/Navbar";
// import { useAuth } from "../context/AuthContext";

// function Layout() {
//   const { isAuthenticated } = useAuth();
//   return (
//     <>
//       {isAuthenticated ? <Navbar /> : <></>}

//       <>
//         <Outlet />
//       </>
//     </>
//   );
// }

// export default Layout;

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../features/layout/Navbar";
import Sidebar from "../features/layout/Sidebar";
import { useAuth } from "../context/AuthContext";

function Layout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const showSidebar = [
    "/scholarships",
    "/universities",
    "/mode-of-study",
    "/language",
    "/course-type",
    "/field-of-study",
  ].includes(location.pathname);

  return (
    <>
      {isAuthenticated ? <Navbar /> : null}

      <div className="flex">
        {isAuthenticated && showSidebar && <Sidebar />}

        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
