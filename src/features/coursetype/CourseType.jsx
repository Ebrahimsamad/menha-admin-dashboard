import React, { useEffect, useState } from "react";
import {
  getAllCourseTypes,
  deleteCourseTypeById,
} from "../../services/courseservice";
import { toast } from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import RepeatParagraph from "../../ui/RepeatPara";
import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";

const CourseType = () => {
  const [courseTypes, setCourseTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchCourseTypes();
  }, []);

  const fetchCourseTypes = async () => {
    setLoading(true);
    try {
      const data = await getAllCourseTypes();
      setCourseTypes(data);
      setError(null);
    } catch (error) {
      setError("Failed to load course types. Please try again.");
      console.error("Error fetching course types:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, name) => {
    setConfirmDeleteId(id);
    setConfirmDeleteName(name);
  };

  const deleteConfirmed = async (id) => {
    const token = localStorage.getItem("token");
    setLoadingId(id);
    try {
      await deleteCourseTypeById(id, token);
      setCourseTypes(courseTypes.filter((type) => type._id !== id));
      toast.success("Course type deleted successfully!");
    } finally {
      setConfirmDeleteId(null);
      setLoadingId(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-center text-[#003a65]">
  Are you sure you want to delete the course type?
</h3>
<div className="text-lg font-semibold mb-4 text-center">
  <span className="text-[#B92A3B]">{confirmDeleteName}</span>
</div>

            <div className="flex justify-center space-x-4">
              <SecondaryButton
                onClick={() => deleteConfirmed(confirmDeleteId)}
                disabled={loadingId === confirmDeleteId}
              >
                {loadingId === confirmDeleteId ? (
                  <div className="flex items-center">
                    <Spinner color={"#003a65"} />
                    <span className="ml-2">Deleting...</span>
                  </div>
                ) : (
                  "Delete"
                )}
              </SecondaryButton>
              <PrimaryButton onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <RepeatParagraph>
        <h1 className="text-2xl sm:text-3xl mb-4 font-bold">Course Type List</h1>
      </RepeatParagraph>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-red-600 text-sm p-4">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course name
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courseTypes.map((type) => (
                  <tr key={type._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#003a65]">
                      {type.courseType}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <PrimaryButton
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(type._id, type.courseType)}
                      >
                        {loadingId === type._id ? (
                          <div className="flex items-center">
                            <Spinner />
                            <span className="ml-2">Processing...</span>
                          </div>
                        ) : (
                          "Delete"
                        )}
                      </PrimaryButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseType;
