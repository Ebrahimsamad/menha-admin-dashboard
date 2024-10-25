import React, { useEffect, useState } from "react";
import {
  getAllFieldOfStudy,
  deleteFieldOfStudy,
} from "../../services/fieldofstudyservice";
import { toast } from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import RepeatParagraph from "../../ui/RepeatPara";
import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";
import SkeletonRow from "../../ui/SkeletonRowTwo";

const FieldOfStudy = () => {
  const [fieldsOfStudy, setFieldsOfStudy] = useState([]);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState(null);

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

  const handleDeleteFieldOfStudy = (id, name) => {
    setConfirmDeleteId(id);
    setConfirmDeleteName(name);
  };

  const deleteConfirmed = async (id) => {
    const token = localStorage.getItem("token");
    setLoadingId(id);
    try {
      await deleteFieldOfStudy(id, token);
      setFieldsOfStudy(fieldsOfStudy.filter((field) => field._id !== id));
      toast.success("Field of study deleted successfully!");
    } finally {
      setLoadingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-center text-[#003a65] ">
              Are you sure you want to delete the field of study{" "}
              <span className="text-[#B92A3B]">{confirmDeleteName}</span>?{" "}
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
        <h1 className="text-2xl sm:text-3xl mb-4 font-bold">
          Field of Study List
        </h1>
      </RepeatParagraph>

      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-100 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left text-gray-600">
                  Field of study
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
                      <tr
                        key={field._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#003a65]">
                          {field.fieldOfStudy}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <PrimaryButton
                            onClick={() =>
                              handleDeleteFieldOfStudy(
                                field._id,
                                field.fieldOfStudy
                              )
                            }
                            className={`text-red-600 hover:bg-red-100 ${
                              loadingId === field._id ? "opacity-50" : ""
                            }`}
                            disabled={loadingId === field._id}
                          >
                            {loadingId === field._id ? (
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FieldOfStudy;
