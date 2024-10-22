import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { FaCheck } from "react-icons/fa"; 

export default function AddScholarshipNavbar({
  isForm1Submitted,
  isForm2Submitted,
}) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  

  return (
    <nav className="bg-white shadow-lg relative">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row items-center justify-between">
        <div className="hidden lg:flex items-center w-full justify-between">
          <Link to="/dashboard" className="flex items-center mb-4 lg:mb-0">
            <img
              src="/output-onlinepngtools.png"
              alt="Men7a Logo"
              className="w-24 h-12 md:w-40 md:h-8 object-contain"
            />
          </Link>

          <div className="flex-grow flex justify-around bg-gray-100 p-4 rounded-lg shadow-md">
         
            <Link
              to="/addscholarship/ScholarShip-Form1"
              className={`flex flex-col items-center space-y-2 ${
                location.pathname.includes("ScholarShip-Form1")
                  ? "border-b-2 border-[#b92a3b] text-[#003a65] font-bold"
                    : "text-[#003a65]"
              }`}
            >
              <div
                className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
                  isForm1Submitted
                    ? "bg-white border-[#003a65]"
                    : "bg-[#003a65]"
                }`}
              >
                {isForm1Submitted && (
                  <FaCheck className="text-[#003a65]" /> 
                )}
              </div>
              <span>ScholarShip-Form1</span>
            </Link>

          
            <Link
              to={isForm1Submitted ? "/addscholarship/ScholarShip-Form2" : "#"}
              className={`flex flex-col items-center space-y-2 ${
                location.pathname.includes("ScholarShip-Form2")
                 ? "border-b-2 border-[#b92a3b] text-[#003a65] font-bold"
                    : "text-[#003a65]"
              }`}
            >
              <div
                className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
                  isForm2Submitted
                    ? "bg-white border-[#003a65]"
                    : "bg-[#003a65]"
                }`}
              >
                {isForm2Submitted && (
                  <FaCheck className="text-[#003a65]" /> 
                )}
              </div>
              <span>ScholarShip Form2</span>
            </Link>

          
            <Link
              to={isForm2Submitted ? "/addscholarship/university-Form" : "#"}
              className={`flex flex-col items-center space-y-2 ${
                location.pathname.includes("university-Form")
                  ? "border-b-2 border-[#b92a3b] text-[#003a65] font-bold"
                  : "text-[#003a65]"
              }`}
            >
              <div
                className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
                  isForm2Submitted
                    ? "bg-white border-[#003a65]"
                    :  "bg-[#003a65]"
                }`}
              >
                {isForm2Submitted && (
                  <FaCheck className="text-[#003a65]" /> 
                )}
              </div>
              <span>University Form</span>
            </Link>
          </div>
        </div>

        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-[#003a65] focus:outline-none"
          >
            {isMenuOpen ? (
              <FiX
                size={28}
                className="hover:text-[#b92a3b] transition-colors"
              />
            ) : (
              <FiMenu
                size={28}
                className="hover:text-[#b92a3b] transition-colors"
              />
            )}
          </button>
        </div>
      </div>

      <div
  className={`${
    isMenuOpen ? "flex" : "hidden"
  } lg:hidden flex-col space-y-6 items-center bg-white absolute top-0 right-0 w-full h-screen p-6 z-20 transition-transform duration-300 transform ${
    isMenuOpen ? "translate-x-0" : "translate-x-full"
  }`}
>
  <div className="flex items-center justify-center mb-6">
    <Link className="flex items-center">
      <img
        src="/output-onlinepngtools.png"
        alt="Men7a Logo"
        className="w-24 h-12 sm:w-28 sm:h-14 md:w-32 md:h-16 object-contain"
      />
    </Link>
  </div>

  <ul className="space-y-6">
    <li>
      <Link
        to="/addscholarship/ScholarShip-Form1"
        className={`flex flex-col items-center space-y-2 ${
          location.pathname.includes("ScholarShip-Form1")
            ? "border-b-2 border-[#b92a3b] text-[#003a65] font-bold"
            : "text-[#003a65]"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
            isForm1Submitted ? "bg-white border-[#003a65]" : "bg-[#003a65]"
          }`}
        >
          {isForm1Submitted && <FaCheck className="text-[#003a65]" />}
        </div>
        <span className="text-sm sm:text-base">Scholarship Form1</span>
      </Link>
    </li>

    <li>
      <Link
        to={isForm1Submitted ? "/addscholarship/ScholarShip-Form2" : "#"}
        className={`flex flex-col items-center space-y-2 ${
          location.pathname.includes("ScholarShip-Form2")
            ? "border-b-2 border-[#b92a3b] text-[#003a65] font-bold"
            : "text-[#003a65]"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
            isForm2Submitted ? "bg-white border-[#003a65]" : "bg-[#003a65]"
          }`}
        >
          {isForm2Submitted && <FaCheck className="text-[#003a65]" />}
        </div>
        <span className="text-sm sm:text-base">Scholarship Form2</span>
      </Link>
    </li>

    <li>
      <Link
        to={isForm2Submitted ? "/addscholarship/university-Form" : "#"}
        className={`flex flex-col items-center space-y-2 ${
          location.pathname.includes("university-Form")
            ? "border-b-2 border-[#b92a3b] text-[#003a65] font-bold"
            : "text-[#003a65]"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${
            isForm2Submitted ? "bg-white border-[#003a65]" : "bg-[#003a65]"
          }`}
        >
          {isForm2Submitted && <FaCheck className="text-[#003a65]" />}
        </div>
        <span className="text-sm sm:text-base">University Form</span>
      </Link>
    </li>
  </ul>
</div>

    </nav>
  );
}
