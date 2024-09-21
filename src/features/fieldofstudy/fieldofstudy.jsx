import React, { useEffect, useState } from "react";
import {
  getAllFieldOfStudy,
  deleteFieldOfStudy,
} from "../../services/fieldofstudyservice";
import { toast } from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import RepeatParagraph from "../../ui/RepeatPara";
import PrimaryButton from "../../ui/PrimaryButton";

const FieldOfStudy = () => {
  const [fieldsOfStudy, setFieldsOfStudy] = useState([]);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const fetchFieldsOfStudy = async () => {
      setIsLoading(true);
      try {
        const data = await getAllFieldOfStudy();
        setFieldsOfStudy(data);
      } catch (error) {
        console.error("Error fetching fields of study:", error);
        setError("Failed to load fields of study. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFieldsOfStudy();
  }, []);

  const handleDeleteFieldOfStudy = (id) => {
    setConfirmDeleteId(id);
  };

  const deleteConfirmed = async (id) => {
    const token = localStorage.getItem("token");
    setLoadingId(id);
    try {
      await deleteFieldOfStudy(id, token);
      setFieldsOfStudy(fieldsOfStudy.filter((field) => field._id !== id));
      toast.success("Field of study deleted successfully!");
    } catch (error) {
      console.error("Error deleting field of study:", error);
      toast.error("Failed to delete field of study. Please try again.");
    } finally {
      setLoadingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="container mx-auto p-9">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      ) : (
        <>
          <RepeatParagraph>
            <h1 className="text-2xl sm:text-3xl mb-4">Field of Study List</h1>
          </RepeatParagraph>

          {error && (
            <p className="text-red-600 text-sm p-4 text-center">{error}</p>
          )}

          {confirmDeleteId && (
            <div
              className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <p>Are you sure you want to delete this mode of study?</p>
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

          {fieldsOfStudy.length === 0 ? (
            <p className="text-gray-600 text-center">
              No fields of study available.
            </p>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100 text-gray-700 text-xs">
                    <tr>
                      <th className="px-4 py-5 font-semibold"></th>
                      <th className="px-4 py-5 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                    {fieldsOfStudy.map((field) => (
                      <tr key={field._id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-4 whitespace-wrap text-sm font-medium text-gray-800">
                          {field.fieldOfStudy}
                        </td>
                        <td className=" px-9 py-4 whitespace-wrap text-sm text-right">
                          <PrimaryButton
                            onClick={() => handleDeleteFieldOfStudy(field._id)}
                            className={`p-3 transition-colors duration-300 ${
                              loadingId === field._id
                                ? "text-gray-400"
                                : "text-red-600 hover:bg-red-100 rounded-full hover:shadow-md"
                            }`}
                            disabled={loadingId === field._id}
                          >
                            {loadingId === field._id ? "Deleting..." : "Delete"}
                          </PrimaryButton>
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
