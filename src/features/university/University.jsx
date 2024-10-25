import React, { useEffect, useState } from "react";
import UniversityService from "../../services/UniversityService";
import UniversityModal from "./UniversityModal";
import PrimaryButton from "../../ui/PrimaryButton";
import RepeatParagraph from "../../ui/RepeatPara";
import toast from "react-hot-toast";
import DeleteModal from "./DeleteModal";
import SkeletonRow from "../../ui/SkeletonRowThree";

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentUniversity, setCurrentUniversity] = useState(null);
  const [universityToDelete, setUniversityToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUniversities = async (page) => {
    setLoading(true);
    setError("");
    try {
      const data = await UniversityService.fetchUniversities(page);
      setUniversities(data.universities);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError("Failed to fetch universities. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities(page);
  }, [page]);

  const openDeleteModal = (university) => {
    setUniversityToDelete(university);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await UniversityService.deleteUniversity(universityToDelete._id);
      toast.success("University deleted successfully");
      fetchUniversities(page);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete university. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("email", formData.email);
    data.append("phone", formData.phone);

    if (formData.image) {
      data.append("image", formData.image.file);
    }

    try {
      if (currentUniversity) {
        await UniversityService.editUniversity(currentUniversity._id, data);
        toast.success("University updated successfully");
      } else {
        await UniversityService.createUniversity(data);
        toast.success("University created successfully");
      }
      fetchUniversities(page);
      setModalOpen(false);
      resetCurrentUniversity();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to save university. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetCurrentUniversity = () => {
    setCurrentUniversity(null);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <RepeatParagraph>
        <h1 className="text-2xl sm:text-3xl mb-4">Universities List</h1>
      </RepeatParagraph>

      {loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700 text-xs">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Address</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(10)].map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mb-4">{error}</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {universities.length > 0 ? (
            <>
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {universities.map((university) => (
                    <tr key={university._id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {university.name || "N/A"}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {university.address || "N/A"}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                        <PrimaryButton
                          onClick={() => openDeleteModal(university)}
                          className="mr-2"
                        >
                          Delete
                        </PrimaryButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex justify-between mt-4">
                <button
                  className={`btn ${
                    page === 1 ? "bg-gray-300" : "bg-[#003a65]"
                  } text-white px-4 py-2 rounded`}
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  className={`btn ${
                    page === totalPages ? "bg-gray-300" : "bg-[#003a65]"
                  } text-white px-4 py-2 rounded`}
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No universities available at the moment.
            </div>
          )}
        </div>
      )}

      <UniversityModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        currentUniversity={currentUniversity}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Universities;
