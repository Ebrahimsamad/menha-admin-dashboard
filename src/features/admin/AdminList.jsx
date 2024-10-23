import React, { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import { toast } from "react-hot-toast";
import AdminEdit from "./AdminEdit";
import RepeatPara from "../../ui/RepeatPara";
import SecondaryButton from "../../ui/SecondaryButton";
import PrimaryButton from "../../ui/PrimaryButton";
import Spinner from "../../ui/Spinner";
import SkeletonRow from "../../ui/SkeletonRowThree";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await adminService.getAllAdmins();
      setAdmins(data || []);
      setError(null);
    } catch (error) {
      let errorMessage = "An error occurred";
      try {
        const parsedError = JSON.parse(error.message.match(/{.*}/)[0]);
        errorMessage = parsedError.message;
      } catch (parseError) {
        errorMessage = error.message;
      }
      setError(`${errorMessage}. Please try again later.`);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteConfirmation(true);
    setConfirmDeleteId(admin._id);
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;

    setLoadingId(confirmDeleteId);
    try {
      await adminService.deleteAdmin(adminToDelete._id);
      setAdmins(admins.filter((admin) => admin._id !== adminToDelete._id));
      toast.success("Admin deleted successfully");
    } catch (error) {
      toast.error("Error deleting admin. Please try again.");
    } finally {
      setShowDeleteConfirmation(false);
      setAdminToDelete(null);
      setLoadingId(null);
    }
  };

  const handleEdit = async (admin) => {
    await fetchAdmins();
    setSelectedAdmin(admin);
    setShowForm(true);
  };

  const handleAddNewAdmin = async () => {
    await fetchAdmins();
    setSelectedAdmin(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setSelectedAdmin(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-6">
      <RepeatPara>
        <h1 className="text-2xl sm:text-3xl mb-4">Admin List</h1>
      </RepeatPara>

      <div className="flex justify-end mb-4">
        {!loading && !error && (
          <button
            className="btn btn-primary py-2 text-center text-white px-4 rounded-lg shadow-md bg-[#003a65] hover:bg-[#002a4b] transition text-xs sm:text-sm"
            onClick={handleAddNewAdmin}
          >
            Add New Admin
          </button>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100 text-gray-700 text-xs">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">
                    Admin Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </tbody>
            </table>
          </div>
        ) : error ? (
          <div className="text-red-600 text-sm p-4">{error}</div>
        ) : (
          <div className="overflow-x-auto ">
            <table className="min-w-full ">
              <thead className="bg-gray-100 text-gray-700 text-xs">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">
                    Admin Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                {admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-800">
                      {admin.userName}
                    </td>
                    <td className="px-4 py-3 text-gray-800">{admin.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col sm:flex-row gap-2 justify-end">
                        <SecondaryButton onClick={() => handleEdit(admin)}>
                          Edit
                        </SecondaryButton>
                        <PrimaryButton onClick={() => handleDelete(admin)}>
                          {loadingId === admin._id ? (
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

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4 text-center text-[#003a65]">
              Are you sure you want to delete the admin{" "}
              <span className="text-[#B92A3B]">{adminToDelete?.userName}</span>?
            </h3>
            <div className="flex justify-center space-x-4">
              <SecondaryButton onClick={confirmDelete}>
                {loadingId === confirmDeleteId ? (
                  <div className="flex items-center">
                    <Spinner color={"#003a65"} />
                    <span className="ml-2">Deleting...</span>
                  </div>
                ) : (
                  "Delete"
                )}
              </SecondaryButton>
              <PrimaryButton onClick={() => setShowDeleteConfirmation(false)}>
                Cancel
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <AdminEdit
          admin={selectedAdmin}
          onClose={handleFormClose}
          onUpdate={fetchAdmins}
        />
      )}
    </div>
  );
};

export default AdminList;
