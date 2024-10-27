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
import { Link, NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaUniversity,
  FaBookOpen,
  FaGlobe,
  FaLanguage,
  FaLayerGroup,
} from "react-icons/fa";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-[#003a65] text-white p-6 shadow-lg mt-16`} // Added mt-16
      >
        {/* Sidebar Links */}
        <ul className="space-y-4 overflow-y-auto h-[80%] custom-scrollbar">
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
        </ul>

        {/* Close Icon for Mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-white focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaTimes size={28} />
        </button>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-6  transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-50 md:opacity-100" : "opacity-100"
        } ${isOpen ? "pointer-events-none md:pointer-events-auto" : ""} ${
          isOpen ? "ml-0" : "ml-0 md:ml-64"
        }`}
      >
        {/* Hamburger Icon */}
        <button
          className="md:hidden fixed bottom-4 left-4 rounded bg-[#003a65] text-white p-2 focus:outline-none z-40"
          onClick={toggleSidebar}
        >
          <FaBars size={28} />
        </button>
        {children}
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
      className="flex items-center gap-4 hover:bg-[#b92a3b] transition-all duration-300 px-4 py-3 block rounded-md text-lg font-medium"
      activeClassName="bg-[#b92a3b] text-white"
    >
      {icon}
      {children}
    </NavLink>
  </li>
);

export default Sidebar;

