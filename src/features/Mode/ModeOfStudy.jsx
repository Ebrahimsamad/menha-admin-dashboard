import React, { useEffect, useState } from "react";
import { getAllModesOfStudy, deleteModeOfStudyById } from "../../services/modeservice";
import { toast } from "react-hot-toast"; 
import Spinner from '../../ui/Spinner';
import RepeatParagraph from "../../ui/RepeatPara";
import PrimaryButton from "../../ui/PrimaryButton";

const ModeOfStudy = () => {
  const [modesOfStudy, setModesOfStudy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchModesOfStudy();
  }, []);

  const fetchModesOfStudy = async () => {
    setLoading(true);
    try {
      const data = await getAllModesOfStudy();
      setModesOfStudy(data);
      setError(null);
    } catch (error) {
      setError('Failed to load modes of study. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const deleteConfirmed = async (id) => {
    const token = localStorage.getItem('token');
    setLoadingId(id);
    try {
      await deleteModeOfStudyById(id, token);
      setModesOfStudy(modesOfStudy.filter(mode => mode._id !== id));
      toast.success('Mode of study deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete mode of study. Please try again.');
    } finally {
      setConfirmDeleteId(null);
      setLoadingId(null);
    }
  };

  return (
    <div className="container mx-auto p-9">
      <RepeatParagraph>
        <h1 className="text-2xl sm:text-3xl mb-4">Mode of Study List</h1>
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
                {modesOfStudy.map((mode) => (
                  <tr key={mode._id} className="hover:bg-gray-50 transition">
                    <td className="px-8 py-3 text-gray-800">
                      {mode.modeOfStudy}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <PrimaryButton
                          onClick={() => handleDelete(mode._id)}
                          className={`p-3 transition-colors duration-300 ${
                            loadingId === mode._id
                              ? "text-gray-400"
                              : "text-red-600 hover:bg-red-100 rounded-full hover:shadow-md"
                          }`}
                          disabled={loadingId === mode._id}
                        >
                          {loadingId === mode._id ? "Deleting..." : "Delete"}
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

      {confirmDeleteId && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
          <p>Are you sure you want to delete this mode of study?</p>
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
      )}
    </div>
  );
};

export default ModeOfStudy;
