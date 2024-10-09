import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiX, FiCheckCircle } from "react-icons/fi"; // Icons for validation
import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";
import Spinner from "../../ui/Spinner"; // Spinner import

const UniversityModal = ({ isOpen, onClose, onSubmit, currentUniversity }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      address: "",
      email: "",
      phone: "",
      pageUrl: "",
      image: { file: null, preview: "", altText: "" },
    },
  });

  const imageWatch = watch("image"); // Watch image field
  const isImageUploaded = !!imageWatch?.preview; // Check if image is uploaded

  useEffect(() => {
    if (currentUniversity) {
      setValue("name", currentUniversity.name);
      setValue("address", currentUniversity.address);
      setValue("email", currentUniversity.email);
      setValue("phone", currentUniversity.phone);
      setValue("pageUrl", currentUniversity.pageUrl);
      setValue("image", {
        file: null,
        preview: currentUniversity.image.url,
        altText: currentUniversity.image.altText,
      });
    } else {
      resetForm();
    }
  }, [currentUniversity, isOpen]);

  const resetForm = () => {
    setValue("name", "");
    setValue("address", "");
    setValue("email", "");
    setValue("phone", "");
    setValue("pageUrl", "");
    setValue("image", { file: null, preview: "", altText: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", {
        file: file,
        preview: URL.createObjectURL(file), // Image preview
        altText: "Uploaded image",
      });
    }
  };

  const clearImage = () => {
    setValue("image", { file: null, preview: "", altText: "" });
  };

  const submitForm = (data) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-1/3">
        <h2 className="text-xl mb-4">
          {currentUniversity ? "Edit University" : "Add University"}
        </h2>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="mb-2">
            <input
              type="text"
              placeholder="University Name"
              {...register("name", { required: "University name is required" })}
              className="border p-2 w-full"
            />
            {errors.name ? (
              <div className="text-red-500 flex items-center">
                <FiX className="mr-2" /> {errors.name.message}
              </div>
            ) : (
              <div className="text-green-500 flex items-center">
                <FiCheckCircle className="mr-2" /> Name looks good
              </div>
            )}
          </div>

          <div className="mb-2">
            <input
              type="text"
              placeholder="Address"
              {...register("address", { required: "Address is required" })}
              className="border p-2 w-full"
            />
            {errors.address ? (
              <div className="text-red-500 flex items-center">
                <FiX className="mr-2" /> {errors.address.message}
              </div>
            ) : (
              <div className="text-green-500 flex items-center">
                <FiCheckCircle className="mr-2" /> Address looks good
              </div>
            )}
          </div>

          <div className="mb-2">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="border p-2 w-full"
            />
            {errors.email ? (
              <div className="text-red-500 flex items-center">
                <FiX className="mr-2" /> {errors.email.message}
              </div>
            ) : (
              <div className="text-green-500 flex items-center">
                <FiCheckCircle className="mr-2" /> Email looks good
              </div>
            )}
          </div>

          <div className="mb-2">
            <input
              type="text"
              placeholder="Phone"
              {...register("phone", { required: "Phone number is required" })}
              className="border p-2 w-full"
            />
            {errors.phone ? (
              <div className="text-red-500 flex items-center">
                <FiX className="mr-2" /> {errors.phone.message}
              </div>
            ) : (
              <div className="text-green-500 flex items-center">
                <FiCheckCircle className="mr-2" /> Phone number looks good
              </div>
            )}
          </div>

          <div className="mb-2">
            <input
              type="text"
              placeholder="Page URL"
              {...register("pageUrl", { required: "Page URL is required" })}
              className="border p-2 w-full"
            />
            {errors.pageUrl ? (
              <div className="text-red-500 flex items-center">
                <FiX className="mr-2" /> {errors.pageUrl.message}
              </div>
            ) : (
              <div className="text-green-500 flex items-center">
                <FiCheckCircle className="mr-2" /> Page URL looks good
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 w-full"
            />
            {isImageUploaded && (
              <div className="relative mt-2">
                <img
                  src={imageWatch.preview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  <FiX size={18} />
                </button>
              </div>
            )}
          </div>

          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Spinner />
            ) : currentUniversity ? (
              "Update University"
            ) : (
              "Add University"
            )}
          </PrimaryButton>
          <SecondaryButton onClick={onClose} type="button">
            Cancel
          </SecondaryButton>
        </form>
      </div>
    </div>
  );
};

export default UniversityModal;
