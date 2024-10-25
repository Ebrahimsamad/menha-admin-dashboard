import React, { useEffect, useState } from "react";
import { getAllLanguages, deleteLanguage } from "../../services/language";
import { toast } from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import RepeatParagraph from "../../ui/RepeatPara";
import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";
import { IoBookOutline } from "react-icons/io5";
import SkeletonRow from "../../ui/SkeletonRowTwo";

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

  const languageToDelete = languages.find(
    (lang) => lang._id === confirmDeleteId
  );

  return (
    <div className="container mx-auto p-6">
      {confirmDeleteId && languageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-center text-[#003a65]">
              Are you sure you want to delet{" "}
              <span className="  text-[#B92A3B]">{languageToDelete.name}</span>?
            </h3>
            <div className="flex justify-center space-x-4">
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
              <PrimaryButton onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <RepeatParagraph>
        <h1 className="text-2xl sm:text-3xl mb-4 font-bold">Language List</h1>
      </RepeatParagraph>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-100 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left text-gray-600">
                    Language
                  </th>
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
                  <th className=""></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {languages.map((language) => (
                  <tr
                    key={language._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-5">
                      <h3 className="text-xl font-semibold text-[#003a65] ">
                        {language.name}
                      </h3>
                      {/* <div className="flex items-center mt-2">
                        <IoBookOutline
                          className="text-gray-600 mr-2"
                          size={16}
                        />
                        {language.course && language.course.length > 0 ? (
                          <div>
                            {language.course.map((c, index) => (
                              <span
                                key={index}
                                className="block text-sm text-gray-600  px-2 py-1 rounded-full mb-1"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-600">
                            No courses available
                          </span>
                        )}
                      </div> */}
                    </td>
                    <td className="px-4 py-4 whitespace-wrap text-center">
                      <div className="flex justify-end mr-4">
                        <PrimaryButton
                          onClick={() => handleDelete(language._id)}
                          className={`p-3 transition-colors duration-300 ${
                            loadingId === language._id
                              ? "text-gray-400"
                              : "text-red-600 hover:bg-red-100 rounded-full hover:shadow-md"
                          }`}
                          disabled={loadingId === language._id}
                        >
                          {loadingId === language._id ? (
                            <div className="flex items-center">
                              <Spinner color={"#003a65"} />
                              <span className="ml-2">Deleting...</span>
                            </div>
                          ) : (
                            "Delete"
                          )}
                        </PrimaryButton>
                      </div>
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
