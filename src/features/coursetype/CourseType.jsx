import React, { useEffect, useState } from "react";
import {
  getAllCourseTypes,
  deleteCourseTypeById,
} from "../../services/courseservice";
import { toast } from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import RepeatParagraph from "../../ui/RepeatPara";
import PrimaryButton from "../../ui/PrimaryButton";

const CourseType = () => {
  const [courseTypes, setCourseTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
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

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const deleteConfirmed = async (id) => {
    const token = localStorage.getItem("token");
    setLoadingId(id);
    try {
      await deleteCourseTypeById(id, token);
      setCourseTypes(courseTypes.filter((type) => type._id !== id));
      toast.success("Course type deleted successfully!");
    } catch (error) {
      console.error("Error deleting course type:", error);
      toast.error("Failed to delete course type. Please try again.");
    } finally {
      setConfirmDeleteId(null);
      setLoadingId(null);
    }
  };

  return (
    <div className="container mx-auto p-9">
      {confirmDeleteId && (
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <p>Are you sure you want to delete this course type?</p>
          <div className="flex justify-start space-x-4 mt-2">
            <button
              onClick={() => deleteConfirmed(confirmDeleteId)}
              className="text-red-600 hover:bg-red-100 rounded-full p-2"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="text-gray-600 hover:bg-gray-100 rounded-full p-2"
            >
              No
            </button>
          </div>
        </div>
      )}

      <RepeatParagraph>
        <h1 className="text-2xl sm:text-3xl mb-4">Course Type List</h1>
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
            <table className="min-w-full">
              <thead className="bg-gray-100 text-gray-700 text-xs">
                <tr>
                  <th className="px-4 py-5 font-semibold"></th>
                  <th className="px-4 py-5 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                {courseTypes.map((type) => (
                  <tr key={type._id} className="hover:bg-gray-50 transition">
                    <td className="px-9 py-4 whitespace-wrap text-sm font-medium text-gray-800">
                      {type.courseType}
                    </td>
                    <td className="px-9 py-4 whitespace-wrap text-sm text-right">
                      <PrimaryButton
                        onClick={() => handleDelete(type._id)}
                        className={`p-3 transition-colors duration-300 ${
                          loadingId === type._id
                            ? "text-gray-400"
                            : "text-red-600 hover:bg-red-100 rounded-full hover:shadow-md"
                        }`}
                        disabled={loadingId === type._id}
                      >
                        {loadingId === type._id ? "Deleting..." : "Delete"}
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
