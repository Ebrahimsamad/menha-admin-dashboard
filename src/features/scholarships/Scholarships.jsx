import React, { useEffect, useState } from "react";
import ScholarshipService from "../../services/ScholarshipService";
import SecondaryButton from "../../ui/SecondaryButton";
import PrimaryButton from "../../ui/PrimaryButton";
import RepeatParagrah from "../../ui/RepeatPara";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import SkeletonRow from "../../ui/SkeletonRowThree";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;
  const navigate = useNavigate();

  const fetchScholarships = async (page) => {
    setLoading(true);
    setError("");
    try {
      const data = await ScholarshipService.fetchScholarships(page, pageSize);
      setScholarships(data.scholarships);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError("Failed to fetch scholarships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships(currentPage);
  }, [currentPage]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await ScholarshipService.deleteScholarship(selectedScholarshipId);
      toast.success("Scholarship deleted successfully");
      fetchScholarships(currentPage);
    } catch (err) {
      console.error("Delete error details: ", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete scholarship";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleEditPortfolio = (portfolio) => {
    let gpa = "";
    let gpaOption = "";
    if (Number.isInteger(portfolio.gpa)) {
      gpa += portfolio.gpa;
    } else {
      gpa += portfolio.gpa;
    }
    const form1Data = {
      levelOfStudy: portfolio.levelOfStudy,
      description: portfolio.description,
      title: portfolio.title,
      gpa,
      gpaOption,
      fieldOfStudy: portfolio.fieldOfStudyId._id,
      courseType: portfolio.courseTypeId._id,
      gender: portfolio.gender,
      dateOfBirth: portfolio.dateOfBirthDate,
      militaryStatusImageUrl: portfolio.militaryStatusImage,
      graduationImageUrl: portfolio.graduationImage,
      IDImageUrl: portfolio.IDImage,
    };
    let begining;
    if (portfolio.isWinter) {
      begining = "Winter";
    } else {
      begining = "Summer";
    }
    let funding;
    if (portfolio.isFree) {
      funding = "Free";
    } else {
      funding = "Not-Free";
    }
    let studyType;
    if (portfolio.isFullTime) {
      studyType = "Full-Time";
    } else {
      studyType = "Part-Time";
    }
    const courses = portfolio.languageId.course.join(", ");
    const form2Data = {
      country: portfolio.country,
      duration: portfolio.duration,
      beginning: begining,
      funding: funding,
      language: portfolio.languageId._id,
      modeOfStudy: portfolio.modeOfStudyId._id,
      studyType: studyType,
      course: courses,
    };
    const universityAddress = portfolio.universityId.address;
    const universityImage = portfolio.universityId.image;
    const universityEmail = portfolio.universityId.email;
    const universityFaculty = portfolio.universityId.faculityName;
    const universityPageUrl = portfolio.universityId.pageUrl;

    console.log(portfolio.universityId);

    const universityData = {
      universityName: portfolio.universityId._id,
      universityAddress: universityAddress,
      universityImage: universityImage,
      universityEmail: universityEmail,
      universityFaculty: universityFaculty,
      universityPageUrl: universityPageUrl,
    };

    localStorage.setItem("form1Data", JSON.stringify(form1Data));
    localStorage.setItem("form2Data", JSON.stringify(form2Data));
    localStorage.setItem("universityData", JSON.stringify(universityData));
    localStorage.setItem("editMode", "true");
    localStorage.setItem("id", portfolio._id);
    localStorage.setItem("isForm1Submitted", JSON.stringify(true));
    localStorage.setItem("isForm2Submitted", JSON.stringify(true));
    navigate(
      `/addscholarship/ScholarShip-Form1?editMode=true&id=${portfolio._id}`
    );
  };

  return (
    <div className="container mx-auto p-6">
      <RepeatParagrah>
        <h1 className="text-2xl sm:text-3xl mb-4">Scholarships List</h1>
      </RepeatParagrah>
      <div className="flex justify-end mb-4">
        {!loading && !error && (
          <Link
            onClick={() => {
              localStorage.removeItem("editMode");
              localStorage.removeItem("id");
              localStorage.removeItem("form1Data");
              localStorage.removeItem("form2Data");
              localStorage.removeItem("universityData");
              localStorage.setItem("isForm1Submitted", JSON.stringify(false));
              localStorage.setItem("isForm2Submitted", JSON.stringify(false));
            }}
            to="/addscholarship"
            className="btn btn-primary py-2 text-center text-white px-4 rounded-lg shadow-md bg-[#003a65] hover:bg-[#002a4b] transition text-xs sm:text-sm"
          >
            Add New Scholarship
          </Link>
        )}
      </div>

      {loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700 text-xs">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Title</th>
                <th className="px-4 py-3 text-left font-semibold">
                  University
                </th>
                <th className="px-4 py-3 text-left font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(10)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mb-4">{error}</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {scholarships.length > 0 ? (
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    University
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"></th>
                </tr>
              </thead>

              <tbody>
                {scholarships.map((scholarship) => (
                  <tr key={scholarship._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {scholarship.title || "N/A"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {scholarship.universityId?.name || "N/A"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex flex-col sm:flex-row gap-2 justify-end">
                        <SecondaryButton
                          onClick={() => handleEditPortfolio(scholarship)}
                        >
                          Edit
                        </SecondaryButton>
                        <PrimaryButton
                          onClick={() => {
                            setSelectedScholarshipId(scholarship._id);
                            setIsModalOpen(true);
                          }}
                        >
                          Delete
                        </PrimaryButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No scholarships available at the moment.
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button
          className={`btn ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "text-white bg-[#003a65]"
          }  px-4 py-2 rounded`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`btn ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "text-white  bg-[#003a65]"
          } px-4 py-2 rounded`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Scholarships;
