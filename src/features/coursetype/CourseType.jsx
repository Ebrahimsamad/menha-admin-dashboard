import React, { useEffect, useState } from "react";
import {
  getAllCourseTypes,
  deleteCourseTypeById,
  editCourseTypeById,
} from "../../services/courseservice";
import { toast } from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import RepeatParagraph from "../../ui/RepeatPara";
import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";
import SkeletonRow from "../../ui/SkeletonRowTwo";

const CourseType = () => {
  const [courseTypes, setCourseTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editCourseTypeId, setEditCourseTypeId] = useState(null);
  const [editCourseTypeValue, setEditCourseTypeValue] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    fetchCourseTypes();
  }, []);

  const validateInput = (value) => {
    if (typeof value !== "string") {
      return "The field must be a string.";
    }

    if (!value.trim()) {
      return "Field cannot be empty.";
    }

    if (value[0] !== value[0].toUpperCase()) {
      return "The first letter must be capitalized.";
    }

    if (/[\u0600-\u06FF]/.test(value)) {
      return "The field must be in English.";
    }

    if (value.length < 5) {
      return "Field must be at least 5 characters long.";
    }

    const currentCourseType = courseTypes.find(
      (type) => type._id === editCourseTypeId
    );

    if (currentCourseType && value.trim() === currentCourseType.courseType) {
      return "No changes made.";
    }

    const nameExists = courseTypes.some(
      (type) =>
        type.courseType.toLowerCase() === value.trim().toLowerCase() &&
        type._id !== editCourseTypeId
    );

    if (nameExists) {
      return "This course type name already exists";
    }

    return "";
  };

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
  };

  const handleEdit = (courseType) => {
    setEditCourseTypeId(courseType._id);
    setEditCourseTypeValue(courseType.courseType);
    setValidationError("");
  };

  const handleEditChange = (e) => {
    const value = e.target.value;
    setEditCourseTypeValue(value);
    setValidationError(validateInput(value));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationResult = validateInput(editCourseTypeValue);
    if (validationResult) {
      setValidationError(validationResult);
      return;
    }

    const token = localStorage.getItem("token");
    setLoadingId(editCourseTypeId);
    setIsSubmitting(true);

    try {
      await editCourseTypeById(
        editCourseTypeId,
        { courseType: editCourseTypeValue.trim() },
        token
      );

      setCourseTypes((prevTypes) =>
        prevTypes.map((type) =>
          type._id === editCourseTypeId
            ? { ...type, courseType: editCourseTypeValue.trim() }
            : type
        )
      );
      setEditCourseTypeId(null);
      setValidationError("");
      toast.success("Course Type updated successfully!");
    } catch (error) {
      console.error("Error updating course type:", error);
      toast.error("Failed to update course type. Please try again.");
    } finally {
      setLoadingId(null);
      setIsSubmitting(false);
    }
  };

  const deleteConfirmed = async (id) => {
    if (loadingId === id) {
      return;
    }

    const token = localStorage.getItem("token");
    setLoadingId(id);
    try {
      await deleteCourseTypeById(id, token);
      setCourseTypes((prevTypes) =>
        prevTypes.filter((courseType) => courseType._id !== id)
      );
      toast.success("Course Type deleted successfully!");
    } catch (error) {
      console.error("Error deleting course type:", error);
      toast.error("Failed to delete course type. Please try again.");
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
              Are you sure you want to delete this course type?
            </h3>
            <div className="flex justify-center space-x-4">
              <SecondaryButton onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
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
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {editCourseTypeId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate-fade-in"
          >
            <h3 className="text-lg font-semibold mb-4 text-center text-[#003a65]">
              Edit Course Type
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                value={editCourseTypeValue}
                onChange={handleEditChange}
                className={`border rounded-lg p-2 w-full ${
                  validationError ? "border-red-500" : "border-gray-300"
                }`}
                required
                disabled={isSubmitting}
              />
              {validationError && (
                <div className="text-red-500 text-sm">{validationError}</div>
              )}
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <SecondaryButton
                type="button"
                onClick={() => {
                  setEditCourseTypeId(null);
                  setValidationError("");
                }}
                disabled={isSubmitting}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                disabled={
                  isSubmitting || validationError || !editCourseTypeValue.trim()
                }
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Spinner color={"#003a65"} />
                    <span className="ml-2">Updating...</span>
                  </div>
                ) : (
                  "Update"
                )}
              </PrimaryButton>
            </div>
          </form>
        </div>
      )}

      <RepeatParagraph>
        <h1 className="text-3xl sm:text-6xl text-center mb-4">
          Course Type List
        </h1>
      </RepeatParagraph>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-100 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left text-gray-600">
                    Course Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(8)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
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
                    <td className="px-4 py-4 whitespace-nowrap space-x-2 text-right text-sm font-medium">
                      <SecondaryButton
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleEdit(type)}
                        disabled={isSubmitting}
                      >
                        Edit
                      </SecondaryButton>
                      <PrimaryButton
                        className="text-red-600 hover:text-red-900 ml-4"
                        onClick={() => handleDelete(type._id, type.courseType)}
                        disabled={isSubmitting}
                      >
                        Delete
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
