import React, { useEffect, useState } from "react";
import { getAllLanguages, deleteLanguage } from "../../services/language";
import { toast } from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import RepeatParagraph from "../../ui/RepeatPara";
import PrimaryButton from "../../ui/PrimaryButton";
import { IoBookOutline } from "react-icons/io5"; 

const Language = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      setLoading(true);
      try {
        const data = await getAllLanguages();
        setLanguages(data);
        setError(null);
      } catch (error) {
        setError("Failed to load languages. Please try again.");
        console.error("Error fetching languages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const deleteConfirmed = async (id) => {
    const token = localStorage.getItem("token");
    setLoadingId(id);
    try {
      await deleteLanguage(id, token);
      setLanguages(languages.filter((language) => language._id !== id));
      toast.success("Language deleted successfully!");
    } catch (error) {
      console.error("Error deleting language:", error);
      toast.error("Failed to delete language. Please try again.");
    } finally {
      setConfirmDeleteId(null);
      setLoadingId(null);
    }
  };

  return (
<div className="container mx-auto p-9">
        {confirmDeleteId && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
          <p>Are you sure you want to delete this language?</p>
          <div className="flex justify-start space-x-4 mt-2">
            <button onClick={() => deleteConfirmed(confirmDeleteId)} className="text-red-600 hover:bg-red-100 rounded-full p-2">
              Yes
            </button>
            <button onClick={() => setConfirmDeleteId(null)} className="text-gray-600 hover:bg-gray-100 rounded-full p-2">
              No
            </button>
          </div>
        </div>
      )}

      <RepeatParagraph>
        <h1 className="text-2xl sm:text-3xl mb-4 font-semibold">Language List</h1>
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
                {languages.map((language) => (  
                  <tr key={language._id} className="  p-4 rounded-lg shadow transition-all duration-200">
                    <td className="px-4 py-5">
                      <h3 className="text-xl font-semibold text-gray-800">{language.name}</h3>
                      <div className="flex items-center mt-2">
                        <IoBookOutline className="text-gray-600 mr-2" size={16} />
                        {language.course && language.course.length > 0 ? (
                          <div>
                            {language.course.map((c, index) => (
                              <span key={index} className="block text-sm text-gray-600  px-2 py-1 rounded-full mb-1">{c}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-600">No courses available</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-wrap text-sm text-center">
                      <PrimaryButton
                        onClick={() => handleDelete(language._id)}
                        className={`p-3 transition-colors duration-300 ${
                          loadingId === language._id
                            ? "text-gray-400"
                            : "text-red-600 hover:bg-red-100 rounded-full hover:shadow-md"
                        }`}
                        disabled={loadingId === language._id}
                      >
                        {loadingId === language._id ? "Deleting..." : "Delete"}
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

export default Language;
