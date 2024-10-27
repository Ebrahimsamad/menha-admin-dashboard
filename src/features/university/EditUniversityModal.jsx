import React, { useState, useEffect } from "react";
import UniversityService from "../../services/UniversityService";
import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";

const EditUniversityModal = ({ university, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    image: null,
    faculityName: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    if (university) {
      setEditForm({
        name: university.name || "",
        address: university.address || "",
        image: null,
        faculityName: university.faculityName || "",
        email: university.email || "",
      });
    }
  }, [university]);

  if (!university) return null;

  const handleInputChange = (e, field) => {
    const value = field === "image" ? e.target.files[0] : e.target.value;
    setEditForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => ({
      ...prev,
      ...(field === "name" &&
      (value.trim().length < 5 ||
        value.charAt(0) !== value.charAt(0).toUpperCase())
        ? {
            name: "Name must be at least 5 characters long and start with a capital letter.",
          }
        : { name: "" }),
      ...(field === "address" && value.trim().length < 5
        ? { address: "Address must be at least 5 characters long." }
        : { address: "" }),
      ...(field === "email" && !emailRegex.test(value)
        ? { email: "Please enter a valid email address." }
        : { email: "" }),
      ...(field === "image" && value && value.size > 5 * 1024 * 1024
        ? { image: "Image size should be less than 5MB." }
        : { image: "" }),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    if (
      !editForm.name.trim() ||
      editForm.name.trim().length < 5 ||
      editForm.name.charAt(0) !== editForm.name.charAt(0).toUpperCase()
    ) {
      newErrors.name =
        "Name must be at least 5 characters long and start with a capital letter.";
      valid = false;
    }

    if (!editForm.address.trim() || editForm.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters long.";
      valid = false;
    }

    if (!editForm.email.trim() || !emailRegex.test(editForm.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) return;

    const isChanged =
      editForm.name.trim() !== university.name.trim() ||
      editForm.address.trim() !== university.address.trim() ||
      editForm.faculityName.trim() !== university.faculityName.trim() ||
      editForm.email.trim() !== university.email.trim() ||
      (editForm.image && editForm.image.size > 0); 

    if (!isChanged) {
      toast.error("No changes were made. University details are up-to-date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", editForm.name.trim());
      formData.append("address", editForm.address.trim());
      formData.append("faculityName", editForm.faculityName.trim());
      formData.append("email", editForm.email.trim());
      if (editForm.image) {
        formData.append("image", editForm.image);
      }

      const updatedUniversity = await UniversityService.editUniversity(
        university._id,
        formData
      );
      toast.success("University updated successfully");

      onSuccess(updatedUniversity);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate-fade-in max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-center text-[#003a65]">
          Edit University
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => handleInputChange(e, "name")}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter university name"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                value={editForm.address}
                onChange={(e) => handleInputChange(e, "address")}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter address"
                required
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faculty Name
              </label>
              <input
                type="text"
                value={editForm.faculityName}
                onChange={(e) => handleInputChange(e, "faculityName")}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter faculty name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => handleInputChange(e, "email")}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter email address"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleInputChange(e, "image")}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
            <PrimaryButton type="submit" disabled={isSubmitting}>
  {isSubmitting ? (
    <div className="flex items-center">
      <Spinner color="#003a65" />
      <span className="ml-2">Updating...</span>
    </div>
  ) : (
    "Update"
  )}
</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUniversityModal;
