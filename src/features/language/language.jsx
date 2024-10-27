import React, { useEffect, useState } from "react";
import { getAllLanguages, deleteLanguage, editLanguage } from "../../services/language";
import { toast } from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import RepeatParagraph from "../../ui/RepeatPara";
import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";
import SkeletonRow from "../../ui/SkeletonRowTwo";

const validateLanguageName = (name, existingLanguages, currentId = null) => {
  if (!name || typeof name !== 'string') {
    return "Language name must be a valid string.";
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    return "Language name cannot be empty.";
  }

  if (/[\u0600-\u06FF]/.test(trimmedName)) { 
    return "The field must be in English.";
  }

  if (trimmedName.length < 2) {
    return "Language name must be at least 2 characters long.";
  }

  if (trimmedName.length > 50) {
    return "Language name cannot exceed 50 characters.";
  }

  if (!/^[A-Z]/.test(trimmedName)) {
    return "Language name must start with a capital letter.";
  }

  if (!/^[A-Za-z\s-]+$/.test(trimmedName)) {
    return "Language name can only contain letters, spaces, and hyphens.";
  }

  const nameExists = existingLanguages.some(
    lang => lang.name.toLowerCase() === trimmedName.toLowerCase() && 
            lang._id !== currentId
  );

  if (nameExists) {
    return "This language already exists.";
  }

  return "";
};


const Language = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [editName, setEditName] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const data = await getAllLanguages();
      setLanguages(data);
      setError(null);
    } catch (err) {
      setError("Failed to load languages. Please try again.");
      console.error("Error fetching languages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (isProcessing) return;
    setConfirmDeleteId(id);
  };

  const handleEdit = (language) => {
    if (isProcessing) return;
    setEditingLanguage(language);
    setEditName(language.name);
    setValidationError("");
  };

  const handleEditChange = (e) => {
    const value = e.target.value;
    setEditName(value);
    const error = validateLanguageName(value, languages, editingLanguage?._id);
    setValidationError(error);
  };

  const closeEditModal = () => {
    setEditingLanguage(null);
    setEditName("");
    setValidationError("");
    setEditingId(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (isProcessing) return;

    const trimmedName = editName.trim();
    
    if (trimmedName === editingLanguage.name) {
      setValidationError("No changes made.");  
      return;
    }

    const error = validateLanguageName(trimmedName, languages, editingLanguage._id);
    if (error) {
      setValidationError(error);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setEditingId(editingLanguage._id);
    setIsProcessing(true);

    try {
      await editLanguage(editingLanguage._id, { name: trimmedName }, token);
      setLanguages(languages.map(lang =>
        lang._id === editingLanguage._id ? { ...lang, name: trimmedName } : lang
      ));
      closeEditModal();
      toast.success("Language updated successfully!");
    } catch (err) {
      console.error("Error updating language:", err);
      toast.error("Failed to update language. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteConfirmed = async (id) => {
    if (isProcessing) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setDeletingId(id);
    setIsProcessing(true);

    try {
      await deleteLanguage(id, token);
      setLanguages(languages.filter((language) => language._id !== id));
      toast.success("Language deleted successfully!");
    } catch (err) {
      console.error("Error deleting language:", err);
      toast.error("Failed to delete language. Please try again.");
    } finally {
      setConfirmDeleteId(null);
      setDeletingId(null);
      setIsProcessing(false);
    }
  };

  const languageToDelete = languages.find(
    (lang) => lang._id === confirmDeleteId
  );

  return (
    <div className="container mx-auto p-6">
      {/* Edit Modal */}
      {editingLanguage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-center text-[#003a65]">
              Edit Language
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={handleEditChange}
                  disabled={isProcessing}
                  className={`w-full p-2 border rounded transition-colors ${
                    validationError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2`}
                  placeholder="Enter language name"
                />
                {validationError && (
                  <p className="text-red-500 text-sm mt-1">{validationError}</p>
                )}
              </div>
              <div className="flex justify-center space-x-4">
                <PrimaryButton 
                  type="submit" 
                  disabled={!!validationError || isProcessing || editName.trim() === editingLanguage.name}
                >
                  {editingId === editingLanguage._id ? (
                    <div className="flex items-center">
                      <Spinner color="#003a65" />
                      <span className="ml-2">Updating...</span>
                    </div>
                  ) : (
                    "Update"
                  )}
                </PrimaryButton>
                <SecondaryButton 
                  type="button" 
                  onClick={closeEditModal}
                  disabled={isProcessing}
                >
                  Cancel
                </SecondaryButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && languageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-center text-[#003a65]">
              Are you sure you want to delete{" "}
              <span className="text-[#B92A3B]">{languageToDelete.name}</span>?
            </h3>
            <div className="flex justify-center space-x-4">
            <PrimaryButton 
                onClick={() => setConfirmDeleteId(null)}
                disabled={isProcessing}
              >
                Cancel
              </PrimaryButton>
              <SecondaryButton 
                onClick={() => deleteConfirmed(confirmDeleteId)}
                disabled={isProcessing}
              >
                {deletingId === confirmDeleteId ? (
                  <div className="flex items-center">
                    <Spinner color="#003a65" />
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
        <h1 className="text-3xl sm:text-6xl text-center mb-4">Language List</h1>
      </RepeatParagraph>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-100 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left text-gray-600">Language</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(3)].map((_, i) => (
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
                  <th className="px-4 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-4 py-5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {languages.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-4 py-5 text-center text-gray-500">
                      No languages available
                    </td>
                  </tr>
                ) : (
                  languages.map((language) => (
                    <tr key={language._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-5">
                        <h3 className="text-xl font-semibold text-[#003a65]">
                          {language.name}
                        </h3>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <PrimaryButton
                            onClick={() => handleEdit(language)}
                            disabled={isProcessing}
                          >
                            Edit
                          </PrimaryButton>
                          <SecondaryButton
                            onClick={() => handleDelete(language._id)}
                            disabled={isProcessing}
                          >
                            {deletingId === language._id ? (
                              <div className="flex items-center">
                                <Spinner color="#003a65" />
                                <span className="ml-2">Deleting...</span>
                              </div>
                            ) : (
                              "Delete"
                            )}
                          </SecondaryButton>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Language;