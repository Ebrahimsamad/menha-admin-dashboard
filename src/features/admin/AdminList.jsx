import React, { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import {  toast } from "react-hot-toast";
import AdminEdit from "./AdminEdit";
import RepeatPara from "../../ui/RepeatPara";
import SecondaryButton from "../../ui/SecondaryButton";
import PrimaryButton from "../../ui/PrimaryButton";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.error("Failed to parse error message:", parseError);
        errorMessage = error.message;
      }

      setError(`${errorMessage}. Please try again later.`);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteAdmin(id);
      setAdmins(admins.filter((admin) => admin._id !== id));
      toast.success("Admin deleted successfully");
    } catch (error) {
      toast.error("Error deleting admin. Please try again.");
      console.error("Error deleting admin:", error);
    }
  };

  const handleEdit = async (admin) => {
    await fetchAdmins(); // استدعاء التحديث قبل الفتح
    setSelectedAdmin(admin);
    setShowForm(true);
  };

  const handleAddNewAdmin = async () => {
    await fetchAdmins(); // استدعاء التحديث قبل الفتح
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
            onClick={handleAddNewAdmin} // استدعاء الوظيفة الجديدة
          >
            Add New Admin
          </button>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003a65]"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-sm p-4">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100 text-gray-700 text-xs">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">
                    User Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
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
                      <div className="flex items-center gap-2">
                        <SecondaryButton onClick={() => handleEdit(admin)}>
                          Edit
                        </SecondaryButton>
                        <PrimaryButton onClick={() => handleDelete(admin._id)}>
                          Delete
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
  