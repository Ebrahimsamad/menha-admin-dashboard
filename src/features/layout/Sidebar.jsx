// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaBars,
//   FaTimes,
//   FaGraduationCap,
//   FaUniversity,
//   FaBookOpen,
//   FaGlobe,
//   FaLanguage,
//   FaLayerGroup,
// } from "react-icons/fa";

// const Sidebar = ({ children }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   return (
//     <div className="flex h-screen ">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 transform ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-[#003a65] text-white p-6 z-50 shadow-lg`}
//       >
//         <div className="w-28 ml-6 h-3  mb-8 text-center">
//           <img src="/logo.png" alt="" />
//         </div>
//         <ul className="space-y-4 overflow-auto h-[80%] scrollbar-thin scrollbar-thumb-[#b92a3b] scrollbar-track-[#003a65]">
//           <SidebarLink to="/scholarships" icon={<FaGraduationCap />}>
//             Scholarships
//           </SidebarLink>
//           <SidebarLink to="/universities" icon={<FaUniversity />}>
//             Universities
//           </SidebarLink>
//           <SidebarLink to="/mode-of-study" icon={<FaBookOpen />}>
//             Mode of Study
//           </SidebarLink>
//           <SidebarLink to="/language" icon={<FaLanguage />}>
//             Languages
//           </SidebarLink>
//           <SidebarLink to="/course-type" icon={<FaLayerGroup />}>
//             Course Type
//           </SidebarLink>
//           <SidebarLink to="/field-of-study" icon={<FaGlobe />}>
//             Field of Study
//           </SidebarLink>
//         </ul>

//         {/* Mobile Toggler */}
//         <button
//           className="md:hidden absolute top-4 right-4 text-white focus:outline-none"
//           onClick={toggleSidebar}
//         >
//           {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
//         </button>
//       </div>

//       {/* Page Content */}
//       <div className="flex-1 ml-64 p-6 bg-gray-100 overflow-y-auto">
//         {children}
//       </div>

//       {/* Background Overlay for mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={toggleSidebar}
//         />
//       )}
//     </div>
//   );
// };

// const SidebarLink = ({ to, icon, children }) => (
//   <li>
//     <NavLink
//       to={to}
//       className="flex items-center gap-4 hover:bg-[#b92a3b] transition-all duration-300 px-4 py-3 block rounded-md text-lg font-medium"
//       activeClassName="bg-[#b92a3b]"
//     >
//       {icon}
//       {children}
//     </NavLink>
//   </li>
// );

// export default Sidebar;
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaUniversity,
  FaBookOpen,
  FaGlobe,
  FaLanguage,
  FaLayerGroup,
  FaUser,
  FaUserAlt,
} from "react-icons/fa";

const Sidebar = ({ children, isAuthenticated, user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-[#003a65] text-white shadow-lg fixed inset-y-0 left-0 z-40 w-60 md:w-64 transform transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center border-b border-white/20 py-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-24 h-auto rounded-full"
          />
        </div>

        {/* Sidebar Links */}
        <ul className="space-y-2 mt-6 px-4">
          <SidebarLink to="/admin" icon={<FaUser />}>
            Admin
          </SidebarLink>
          <SidebarLink to="/scholarships" icon={<FaGraduationCap />}>
            Scholarships
          </SidebarLink>
          <SidebarLink to="/universities" icon={<FaUniversity />}>
            Universities
          </SidebarLink>
          <SidebarLink to="/mode-of-study" icon={<FaBookOpen />}>
            Mode of Study
          </SidebarLink>
          <SidebarLink to="/language" icon={<FaLanguage />}>
            Languages
          </SidebarLink>
          <SidebarLink to="/course-type" icon={<FaLayerGroup />}>
            Course Type
          </SidebarLink>
          <SidebarLink to="/field-of-study" icon={<FaGlobe />}>
            Field of Study
          </SidebarLink>
          <SidebarLink to="/portfolio" icon={<FaUserAlt />}>
            Portfolio
          </SidebarLink>
        </ul>

        {/* Logout Section */}
        {isAuthenticated && (
          <div className="mt-auto flex items-center justify-between p-4">
            <span className="text-sm">{user?.userName || "Guest"}</span>
            <button
              onClick={logout}
              className="bg-[#b92a3b] py-2 px-3 rounded-md text-sm hover:bg-white hover:text-[#b92a3b] transition-all"
            >
              Logout
            </button>
          </div>
        )}

        {/* Close Button for Mobile */}
        <button
          className="md:hidden absolute top-4 right-4"
          onClick={toggleSidebar}
        >
          <FaTimes size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 bg-gray-100 transition-all duration-300 ease-in-out ml-0 md:ml-64 ${
          isOpen ? "ml-60" : ""
        }`}
      >
        {/* Navbar (Mobile Only) */}
        {isAuthenticated && (
          <div className="p-4 bg-white shadow-md fixed top-0 left-0 w-full md:hidden z-30">
            <button
              onClick={toggleSidebar}
              className="text-[#003a65] focus:outline-none"
            >
              <FaBars size={28} />
            </button>
          </div>
        )}

        {/* Main Page Content */}
        <div className="p-6 mt-16 md:mt-0">{children}</div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

const SidebarLink = ({ to, icon, children }) => (
  <li>
    <NavLink
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-lg font-medium hover:bg-[#b92a3b] transition-all"
      activeClassName="bg-[#b92a3b]"
    >
      {icon}
      {children}
    </NavLink>
  </li>
);

export default Sidebar;
