import React, { useEffect, useState } from "react";
import ScholarshipService from "../../services/ScholarshipService";
import SecondaryButton from "../../ui/SecondaryButton";
import PrimaryButton from "../../ui/PrimaryButton";
import RepeatParagrah from "../../ui/RepeatPara";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import SkeletonRow from "../../ui/SkeletonRowThree";
import { Link } from "react-router-dom";

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchUniversity, setSearchUniversity] = useState("");
  const pageSize = 10;

  // Fetch scholarships based on current page and search filters
  const fetchScholarships = async (page, title, university) => {
    setLoading(true);
    setError("");
    try {
      const data = await ScholarshipService.fetchScholarshipsSearch({
        title,
        university,
        page,
        size: pageSize,
      });
      setScholarships(data.scholarships);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError("Failed to fetch scholarships. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch scholarships whenever currentPage, searchTitle, or searchUniversity changes
  useEffect(() => {
    fetchScholarships(currentPage, searchTitle, searchUniversity);
  }, [currentPage, searchTitle, searchUniversity]);

  // Handle scholarship deletion
  const handleDelete = async (scholarshipId) => {
    setLoadingId(scholarshipId);
    try {
      await ScholarshipService.deleteScholarship(scholarshipId);
      toast.success("Scholarship deleted successfully");
      fetchScholarships(currentPage, searchTitle, searchUniversity);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete scholarship.";
      toast.error(errorMessage);
    } finally {
      setLoadingId(null);
    }
  };

  // Update search title and reset currentPage to 1
  const handleSearchTitleChange = (e) => {
    setSearchTitle(e.target.value);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  // Update search university and reset currentPage to 1
  const handleSearchUniversityChange = (e) => {
    setSearchUniversity(e.target.value);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  // Pagination controls
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

  return (
    <div className="container mx-auto p-6">
      <RepeatParagrah>
        <h1 className="text-3xl sm:text-6xl text-center mb-4">
          Scholarships List
        </h1>
      </RepeatParagrah>

      {/* Search Inputs */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          name="title"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={handleSearchTitleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 mr-4 w-full sm:w-1/3"
        />
        <input
          type="text"
          name="university"
          placeholder="Search by university..."
          value={searchUniversity}
          onChange={handleSearchUniversityChange}
          className="border border-gray-300 rounded-lg px-4 py-2 mr-4 w-full sm:w-1/3"
        />
        {!loading && !error && (
          <Link
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
              {[...Array(pageSize)].map((_, i) => (
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
                      {scholarship.universityId?.name ||
                        "University data unavailable"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex flex-col sm:flex-row gap-2 justify-end">
                        <SecondaryButton
                          onClick={() => alert(`Edit ${scholarship._id}`)}
                        >
                          Edit
                        </SecondaryButton>
                        <PrimaryButton
                          onClick={() => {
                            setSelectedScholarship(scholarship);
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

      {/* Pagination Controls */}
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
        onClose={() => {
          setIsModalOpen(false);
          setSelectedScholarship(null);
        }}
        onConfirm={handleDelete}
        confirmDeleteName={selectedScholarship?.title}
        confirmDeleteId={selectedScholarship?._id}
        loadingId={loadingId}
        setLoadingId={setLoadingId}
      />
    </div>
  );
};

export default Scholarships;
