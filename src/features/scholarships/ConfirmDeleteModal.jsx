import React from "react";
import SecondaryButton from "../../ui/SecondaryButton";
import PrimaryButton from "../../ui/PrimaryButton";
import Spinner from "../../ui/Spinner";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  confirmDeleteName,
  confirmDeleteId,
  loadingId,
  setLoadingId,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (loadingId === confirmDeleteId) return;
    setLoadingId(confirmDeleteId);
    onConfirm(confirmDeleteId).finally(() => {
      setLoadingId(null);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate-fade-in">
        <h3 className="text-lg font-semibold mb-4 text-center text-[#003a65]">
          Are you sure you want to delete the course type?
        </h3>
        <div className="text-lg font-semibold mb-4 text-center">
          <span className="text-[#B92A3B]">{confirmDeleteName}</span>
        </div>

        <div className="flex justify-center space-x-4">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton
            onClick={handleConfirm}
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
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
