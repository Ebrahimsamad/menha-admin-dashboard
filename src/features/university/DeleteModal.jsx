// DeleteModal.jsx
import React from "react";
import PrimaryButton from "../../ui/PrimaryButton"; // Replace with the correct path

const DeleteModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this university?</p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 mr-2 rounded-full text-gray-800 px-4 py-2"
            onClick={onClose}
          >
            Cancel
          </button>
          ;
          <PrimaryButton onClick={onDelete} className="bg-red-600">
            Delete
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
