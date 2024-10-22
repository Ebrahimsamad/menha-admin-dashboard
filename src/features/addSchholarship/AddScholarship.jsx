import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import ScholarShipForm1 from "./ScholarShipForm1";
import ScholarShipForm2 from "./ScholarShipForm2";
import UniversityForm from "./UniversityForm";

import Navbar from "./AddScholarshipNavbar";
import RepeatPara from "../../ui/RepeatPara";
import { getAllSelectData } from "../../services/AddScholarship";
import { postScholarship } from "../../services/PostScholarship";
import Submitted from "./Submitted";
import ProtectedRoute from "./../../ui/ProtectedRoute";

export default function AddScholarship() {
  const [form1Data, setForm1Data] = useState({});
  const [form2Data, setForm2Data] = useState({});
  const [universityData, setUniversityData] = useState({});

  const [isForm1Submitted, setIsForm1Submitted] = useState(false);
  const [isForm2Submitted, setIsForm2Submitted] = useState(false);

  const [courseType, setCourseType] = useState([]);
  const [courseLanguage, setCourseLanguage] = useState([]);
  const [fieldOfStudy, setFieldOfStudy] = useState([]);
  const [modeOfStudy, setModeOfStudy] = useState([]);
  const [university, setUniversity] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const location = useLocation();



  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const form1State = localStorage.getItem("isForm1Submitted");
    const form2State = localStorage.getItem("isForm2Submitted");
    const savedForm1Data = localStorage.getItem("form1Data");
    const savedForm2Data = localStorage.getItem("form2Data");
    const savedUniversityData = localStorage.getItem("universityData");

    if (
      form1State !== "false" &&
      form1State !== null &&
      form1State !== "undefined"
    ) {
      setIsForm1Submitted(JSON.parse(form1State));
    }

    if (form2State !== null && form2State !== "undefined") {
      setIsForm2Submitted(JSON.parse(form2State));
    }

    if (savedForm1Data && savedForm1Data !== "undefined") {
      setForm1Data(JSON.parse(savedForm1Data));
    }

    if (savedForm2Data && savedForm2Data !== "undefined") {
      setForm2Data(JSON.parse(savedForm2Data));
    }
    if (savedUniversityData && savedUniversityData !== "undefined") {
      setUniversityData(JSON.parse(savedUniversityData));
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getAllSelectData();
        setCourseType(data.courseType);
        setCourseLanguage(data.courseLanguage);
        setFieldOfStudy(data.fieldOfStudy);
        setModeOfStudy(data.modeOfStudy);
        setUniversity(data.university);
        setScholarships(data.scholarships);
      } catch (error) {
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleForm1Submit = (data) => {
    setForm1Data(data);

    setIsForm1Submitted(true);
    localStorage.setItem("form1Data", JSON.stringify(data));
    localStorage.setItem("isForm1Submitted", JSON.stringify(true));
  };

  const handleForm2Submit = (data) => {
    setForm2Data(data);
    setIsForm2Submitted(true);
    localStorage.setItem("form2Data", JSON.stringify(data));
    localStorage.setItem("isForm2Submitted", JSON.stringify(true));
  };

  const handleUniversityFormSubmit = async (data) => {
    setUniversityData(data);

    localStorage.setItem("universityData", JSON.stringify(data));
    const combinedData = {
      ...form1Data,
      ...form2Data,
      ...data,
    };
    const finalDataForBackend = {
      fieldOfStudyId: combinedData.fieldOfStudy,
      courseTypeId: combinedData.courseType,
      modeOfStudyId: combinedData.modeOfStudy,
      universityId: combinedData.universityName,
      languageId: combinedData.language,
      isFree: combinedData.isFree,
      isFullTime: combinedData.isFullTime,
      isWinter: combinedData.isWinter,
      country: combinedData.country,
      duration: combinedData.duration,
      title: combinedData.title,
      description: combinedData.description,
      gpa:
        combinedData.gpaOption === "other"
          ? combinedData.gpa
          : combinedData.gpaOption,
    };

      // console.log("finalDataForBackend:", finalDataForBackend);

    try {
      const token = localStorage.getItem("token");
      const response = await postScholarship(finalDataForBackend, token);
      console.log("Successfully added scholarship:", response);

      setIsForm1Submitted(false);
      setIsForm2Submitted(false);
      localStorage.removeItem("form1Data");
      localStorage.removeItem("form2Data");
      localStorage.removeItem("universityData");
      setForm1Data({});
      setForm2Data({});
      setUniversityData({});
      localStorage.setItem("isForm1Submitted", JSON.stringify(false));
      localStorage.setItem("isForm2Submitted", JSON.stringify(false));
    } catch (error) {
      console.error("Error submitting the final data:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 ">
        <div className="container mx-auto py-12">
          <div className="flex justify-center mb-8">
            <div className="animate-pulse w-full">
              <div className="h-10 bg-gray-300 rounded mb-4 mx-auto w-1/2"></div>
            </div>
          </div>

          <nav className="bg-white shadow-lg relative">
            <div className="container mx-auto p-4 flex flex-col lg:flex-row items-center justify-between">
              <div className="hidden lg:flex items-center w-full justify-between">
                <Link
                  to="/dashboard"
                  className="flex items-center mb-4 lg:mb-0"
                >
                  <div className="skeleton-loader w-24 h-12 md:w-40 md:h-8 bg-gray-300 rounded"></div>
                </Link>

                <div className="flex-grow flex justify-around bg-gray-100 p-4 rounded-lg shadow-md">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="skeleton-loader w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="skeleton-loader w-24 h-4 bg-gray-300 rounded mt-2"></div>
                  </div>

                  <div className="flex flex-col items-center space-y-2">
                    <div className="skeleton-loader w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="skeleton-loader w-24 h-4 bg-gray-300 rounded mt-2"></div>
                  </div>

                  <div className="flex flex-col items-center space-y-2">
                    <div className="skeleton-loader w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="skeleton-loader w-24 h-4 bg-gray-300 rounded mt-2"></div>
                  </div>
                </div>
              </div>

              <div className="lg:hidden flex items-center">
                <button className="text-[#003a65] focus:outline-none">
                  <div className="skeleton-loader w-8 h-8 bg-gray-300 rounded"></div>
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
                <div className="skeleton-loader w-40 h-8 bg-gray-300 rounded"></div>
              </div>

              <ul className="space-y-6">
                <li>
                  <div className="skeleton-loader w-3/4 h-6 bg-gray-300 rounded"></div>
                </li>
                <li>
                  <div className="skeleton-loader w-3/4 h-6 bg-gray-300 rounded"></div>
                </li>
                <li>
                  <div className="skeleton-loader w-3/4 h-6 bg-gray-300 rounded"></div>
                </li>
              </ul>
            </div>
          </nav>

          <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-20 h-6 bg-gray-300 rounded-md"></div>
                  <div className="ml-2 w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
                <div className="w-full h-10 bg-gray-300 rounded-md"></div>

                <div className="flex items-center">
                  <div className="w-28 h-6 bg-gray-300 rounded-md"></div>
                  <div className="ml-2 w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
                <div className="w-full h-20 bg-gray-300 rounded-md"></div>

                <div className="flex items-center">
                  <div className="w-32 h-6 bg-gray-300 rounded-md"></div>
                  <div className="ml-2 w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
                <div className="w-full h-10 bg-gray-300 rounded-md"></div>

                <div className="w-full h-12 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-12">
        <div className="flex justify-center mb-8">
          {location.pathname !== "/addscholarship/submitted" && (
            <RepeatPara>
              <h3 className=" text-3xl text-center sm:text-xl md:text-6xl">
                New Portfolio
              </h3>
            </RepeatPara>
          )}
        </div>
        {location.pathname !== "/addscholarship/submitted" && (
          <Navbar
            isForm1Submitted={isForm1Submitted}
            isForm2Submitted={isForm2Submitted}
          />
        )}
        <div className="mt-0">
          <Routes>
            <Route
              path=""
              element={
                <Navigate to="/addscholarship/ScholarShip-Form1" replace />
              }
            />
            <Route
              path="ScholarShip-Form1"
              element={
                <ScholarShipForm1
                  onSubmitSuccess={handleForm1Submit}
                  courseTypes={courseType}
                  courseLanguages={university}
                  fieldsOfStudy={fieldOfStudy}
                  setCourseType={setCourseType}
                  setFieldOfStudy={setFieldOfStudy}
                />
              }
            />
            <Route
              path="submitted"
              element={
                <ProtectedRoute>
                  <Submitted />
                </ProtectedRoute>
              }
            />
            <Route
              path="ScholarShip-Form2"
              element={
                <ScholarShipForm2
                  onSubmitSuccess={handleForm2Submit}
                  modeOfStudy={modeOfStudy}
                  courseLanguage={courseLanguage}
                  setCourseLanguage={setCourseLanguage}
                />
              }
            />
            <Route
              path="university-Form"
              element={
                <UniversityForm
                  onSubmitSuccess={handleUniversityFormSubmit}
                  university={university}
                  setUniversity={setUniversity}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
