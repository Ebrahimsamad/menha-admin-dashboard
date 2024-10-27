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
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  // Paths where the sidebar should be displayed
  const showSidebar = [
    "/admin",
    "/scholarships",
    "/universities",
    "/mode-of-study",
    "/language",
    "/course-type",
    "/field-of-study",
    "/portfolio",
  ].includes(location.pathname);

  return (
    <div className="flex min-h-screen">
      {/* Render Sidebar if the user is authenticated and on specific routes */}
      {isAuthenticated && showSidebar && (
        <Sidebar
          isAuthenticated={isAuthenticated}
          user={user}
          logout={logout}
        />
      )}

      <div className="flex-1">
        {/* Render Navbar if the user is authenticated */}
        {isAuthenticated}

        {/* Main Content */}
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
