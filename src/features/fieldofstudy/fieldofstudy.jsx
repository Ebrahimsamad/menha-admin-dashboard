import React, { useEffect, useState } from "react";
import {
  getAllFieldOfStudy,
  deleteFieldOfStudy,
  updateFieldOfStudy,
} from "../../services/fieldofstudyservice";
import Spinner from "../../ui/Spinner";
import RepeatParagraph from "../../ui/RepeatPara";
import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";
import SkeletonRow from "../../ui/SkeletonRowTwo";
import { toast } from "react-hot-toast";

const validateInput = (value) => {
  if (typeof value !== 'string') {
    return "The field must be a string.";
  }

  if (!value.trim()) {
    return "Field cannot be empty.";
  }

  if (/[\u0600-\u06FF]/.test(value)) { 
    return "The field must be in English.";
  }

  if (value[0] !== value[0].toUpperCase()) {
    return "The first letter must be capitalized.";
  }

  if (value.length < 5) {
    return "The field must be at least 5 characters long.";
  }

  return "";
};


const FieldOfStudy = () => {
  const [fieldsOfStudy, setFieldsOfStudy] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editFieldId, setEditFieldId] = useState(null);
  const [editFieldName, setEditFieldName] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const fetchFieldsOfStudy = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAllFieldOfStudy();
        setFieldsOfStudy(data);
      } catch {
        setError("Failed to load fields of study.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFieldsOfStudy();
  }, []);

  const handleEditChange = (e) => {
    const value = e.target.value;
    setEditFieldName(value);
    const error = validateInput(value);
    setValidationError(error);
  };

  const handleDeleteFieldOfStudy = (id, name) => {
    setConfirmDeleteId(id);
    setEditFieldName(name);
  };

  const deleteConfirmed = async (id) => {
    const token = localStorage.getItem("token");
    setLoadingId(id);
    try {
      await deleteFieldOfStudy(id, token);
      setFieldsOfStudy(fieldsOfStudy.filter((field) => field._id !== id));
      toast.success("Field-of-study deleted successfully!");
    } catch {
      
    } finally {
      setLoadingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleEditFieldOfStudy = (id, name) => {
    setEditFieldId(id);
    setEditFieldName(name);
    setEditingField({ _id: id, name });
    setValidationError("");
  };

  const closeEditModal = () => {
    setEditingField(null);
    setEditFieldName("");
    setValidationError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const error = validateInput(editFieldName);
    if (error) {
      setValidationError(error);
      return;
    }

    if (editFieldName === editingField.name) {
      setValidationError("No changes made");
      return;
    }

    setLoadingId(editFieldId);
    try {
      await updateFieldOfStudy(editFieldId, { fieldOfStudy: editFieldName }, token);
      setFieldsOfStudy((prevFields) =>
        prevFields.map((field) =>
          field._id === editFieldId ? { ...field, fieldOfStudy: editFieldName } : field
        )
      );
      closeEditModal();
      toast.success("Field of study updated successfully!");
    } catch {
      toast.error("Failed to update field of study.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {editingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-center text-[#003a65]">
              Edit Field of Study
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="text"
                  value={editFieldName}
                  onChange={handleEditChange}
                  className={`w-full p-2 border rounded transition-colors ${
                    validationError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter field of study name"
                />
                {validationError && (
                  <p className="text-red-500 text-sm mt-1">{validationError}</p>
                )}
              </div>
              <div className="flex justify-center space-x-4">
                <PrimaryButton
                  type="submit"
                  disabled={!!validationError || loadingId === editingField._id}
                >
                  {loadingId === editingField._id ? (
                    <div className="flex items-center">
                      <Spinner color={"#003a65"} />
                      <span className="ml-2">Updating...</span>
                    </div>
                  ) : (
                    "Update"
                  )}
                </PrimaryButton>
                <SecondaryButton type="button" onClick={closeEditModal}>
                  Cancel
                </SecondaryButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-center text-[#003a65]">
              Are you sure you want to delete the field of study{" "}
              <span className="text-[#B92A3B]">{editFieldName}</span>?
            </h3>
            <div className="flex justify-center space-x-4">
            <PrimaryButton onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </PrimaryButton>
              <SecondaryButton onClick={() => deleteConfirmed(confirmDeleteId)}>
                {loadingId === confirmDeleteId ? (
                  <div className="flex items-center">
                    <Spinner color={"#003a65"} />
                    <span className="ml-2">Deleting...</span>
                  </div>
                ) : (
                  "Delete"
                )}
              </SecondaryButton>
            
            </div>
          </div>
        </div>
      )}

      <RepeatParagraph>
        <h1 className="text-3xl sm:text-6xl text-center mb-4">
          Field of Study List
        </h1>
      </RepeatParagraph>

      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-100 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left text-gray-600">
                  Field of Study
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
      ) : (
        <>
          {error && (
            <p className="text-red-600 text-sm p-4 text-center">{error}</p>
          )}

          {fieldsOfStudy.length === 0 ? (
            <p className="text-gray-600 text-center">
              No fields of study available.
            </p>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Field of Study
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fieldsOfStudy.map((field) => (
                      <tr key={field._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#003a65]">
                          {field.fieldOfStudy}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <PrimaryButton
                            onClick={() => handleEditFieldOfStudy(field._id, field.fieldOfStudy)}
                          >
                            Edit
                          </PrimaryButton>
                          <SecondaryButton
                            onClick={() => handleDeleteFieldOfStudy(field._id, field.fieldOfStudy)}
                            className="ml-4"
                          >
                            Delete
                          </SecondaryButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FieldOfStudy;
