import React, { useEffect, useState, useCallback } from "react";
import UniversityService from "../../services/UniversityService";
import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";
import RepeatParagraph from "../../ui/RepeatPara";
import toast from "react-hot-toast";
import DeleteModal from "./DeleteModal";
import SkeletonRow from "../../ui/SkeletonRowThree";
import EditUniversityModal from "./EditUniversityModal";

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingId, setLoadingId] = useState(null);

  const fetchUniversities = useCallback(async (currentPage) => {
    setLoading(true);
    setError("");
    try {
      const data = await UniversityService.fetchUniversities(currentPage);
      setUniversities(data.universities);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError("Failed to fetch universities. Please try again later.");
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUniversities(page);
  }, [page, fetchUniversities]);

  const openDeleteModal = (university) => {
    setUniversityToDelete(university);
    setDeleteModalOpen(true);
  };

  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await UniversityService.deleteUniversity(id);
      toast.success("University deleted successfully");
      fetchUniversities(page);
      setDeleteModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleEdit = (university) => {
    setEditingUniversity(university);
  };

  const handleEditSuccess = async (updatedUniversity) => {
    try {
      await fetchUniversities(page);
      setEditingUniversity(null);
    } catch (err) {
      toast.error("Failed to refresh data after update");
    }
  };

  const handlePreviousPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="container mx-auto p-6">
      <EditUniversityModal
        university={editingUniversity}
        onClose={() => setEditingUniversity(null)}
        onSuccess={handleEditSuccess}
        universities={universities}
      />

      <RepeatParagraph>
        <h1 className="text-3xl sm:text-6xl text-center mb-4">Universities List</h1>
      </RepeatParagraph>

      {loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700 text-xs">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Address</th>
                <th className="px-4 py-3 text-left font-semibold">Image</th>
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
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Image
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
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {university.image && (
                        <img
                          src={university.image}
                          alt={university.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <div className="flex justify-end space-x-2">
                        <PrimaryButton
                          onClick={() => handleEdit(university)}
                          className="p-3 text-blue-600 hover:bg-blue-100 rounded-full hover:shadow-md"
                        >
                          Edit
                        </PrimaryButton>
                        <SecondaryButton
                          onClick={() => openDeleteModal(university)}
                          className="p-3 text-red-600 hover:bg-red-100 rounded-full hover:shadow-md"
                        >
                          Delete
                        </SecondaryButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No universities available at the moment.
            </div>
          )}
        </div>
      )}

      {universities.length > 0 && (
        <div className="flex justify-between mt-4">
          <button
            className={`btn ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "text-white bg-[#003a65]"
            } px-4 py-2 rounded`}
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
              page === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "text-white bg-[#003a65]"
            } px-4 py-2 rounded`}
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        confirmDeleteName={universityToDelete?.name}
        confirmDeleteId={universityToDelete?._id}
        loadingId={loadingId}
        setLoadingId={setLoadingId}
      />
    </div>
  );
};

export default Universities;