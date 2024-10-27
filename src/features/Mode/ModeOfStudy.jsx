import React, { useEffect, useState } from "react";
import {
  getAllModesOfStudy,
  deleteModeOfStudyById,
} from "../../services/modeservice";
import { toast } from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import RepeatParagraph from "../../ui/RepeatPara";
import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";
import SkeletonRow from "../../ui/SkeletonRowTwo";

const ModeOfStudy = () => {
  const [modesOfStudy, setModesOfStudy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [modeToDelete, setModeToDelete] = useState(null);

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
      setError("Failed to load modes of study. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (mode) => {
    setConfirmDeleteId(mode._id);
    setModeToDelete(mode.modeOfStudy);
  };

  const deleteConfirmed = async (id) => {
    const token = localStorage.getItem("token");
    setLoadingId(id);
    try {
      await deleteModeOfStudyById(id, token);
      setModesOfStudy(modesOfStudy.filter((mode) => mode._id !== id));
      toast.success("Mode of study deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete mode of study. Please try again.");
    } finally {
      setConfirmDeleteId(null);
      setLoadingId(null);
      setModeToDelete(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-center text-[#003a65]">
              Are you sure you want to delete the mode of study:{" "}
              <span className="  text-[#B92A3B]">{modeToDelete}</span>?
            </h3>
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
        <h1 className="text-3xl sm:text-6xl text-center mb-4">Modes of Study</h1>
      </RepeatParagraph>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-100 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left text-gray-600">
                    Mode Of Study
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mode of Study
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modesOfStudy.map((mode) => (
                  <tr key={mode._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {mode.modeOfStudy}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <PrimaryButton
                        onClick={() => handleDelete(mode)}
                        className={`text-red-600 hover:text-red-900`}
                      >
                        {loadingId === mode._id ? (
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

export default ModeOfStudy;
