import React from "react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Confirm Delete
        </h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this scholarship?
        </p>
        <div className="flex justify-end">
          <button
            className="bg-[#b92a3b] hover:bg-[#a02234] text-white px-4 py-2 rounded mr-2"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
