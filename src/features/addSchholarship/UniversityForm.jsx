/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { adduniversity } from "./../../services/AddUniversity";
import LazyLoad from "react-lazyload";

export default function UniversityForm({
  onSubmitSuccess,
  university,
  setUniversity,
  isForm1Submitted,
  isForm2Submitted,
}) {
  
  const editMode = localStorage.getItem("editMode");
  const idParam = localStorage.getItem("id");

  const [loading, setLoading] = useState(false);
  const [selectedUniversityData, setSelectedUniversityData] = useState(null);
  const navigate = useNavigate();
  const [showOtherUniversity, setShowOtherUniversity] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  // const [loadingImage, setLoadingImage] = useState(false);
  const [isoption, setIsoption] = useState(true);
  useEffect(()=>{

    if(!isForm2Submitted){
      navigate("/addscholarship/ScholarShip-Form2")
    }
  })
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });
  useEffect(() => {
    const savedData = localStorage.getItem("universityData");
    if (savedData) {
      const formData = JSON.parse(savedData);
      Object.keys(formData).forEach((key) => {
        setValue(key, formData[key], { shouldValidate: true });
      });
    }
  }, [setValue]);
  useEffect(() => {

    // const storedData = localStorage.getItem("universityData");
    // if (storedData) {
    //   const parsedData = JSON.parse(storedData);
    //   // setValue("universityName", parsedData.universityName || "");
    //   // setValue("universityAddress", parsedData.universityAddress || "");
    //   // setValue("universityFaculty", parsedData.universityFaculty || "");
    //   // setValue("universityEmail", parsedData.universityEmail || "");
    //   // setValue("universityPageUrl", parsedData.universityPageUrl || "");
    //   // setValue("universityImage", parsedData.universityImage || "");
    //   // setValue("universityPhone", parsedData.universityPhone || "");
    // }
    const subscription = watch((value) => {
      if (value.universityName && value.universityName !== "other") {
        const selectedUniversity = university.find(
          (uni) => uni._id === value.universityName
        );
        setSelectedUniversityData(selectedUniversity);
        if (selectedUniversity) {
          setIsEditable(false);
          setValue("universityAddress", selectedUniversity.address);
          setValue("universityFaculty", selectedUniversity.faculityName);
          setValue("universityEmail", selectedUniversity.email);
          setValue("universityPageUrl", selectedUniversity.pageUrl);
          setValue("universityImage", selectedUniversity.image);
          setShowOtherUniversity(false);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [university, setValue, watch]);

  const handleUniversityChange = (event) => {
    setSelectedUniversityData(null);
    const selectedValue = event.target.value;
    if (selectedValue === "other") {
      setShowOtherUniversity(true);
      setIsEditable(true);
      setSelectedUniversityData(null);
      setValue("universityAddress", "");
      setValue("universityFaculty", "");
      setValue("universityEmail", "");
      setValue("universityPageUrl", "");
      setValue("universityImage", "");
      setValue("universityPhone", "");
    } else {
      setShowOtherUniversity(false);
      setIsEditable(false);
      const selectedUniversity = university.find(
        (uni) => uni._id === selectedValue
      );
      setSelectedUniversityData(selectedUniversity);
      if (selectedUniversity) {
        setValue("universityAddress", selectedUniversity.address);
        setValue("universityFaculty", selectedUniversity.faculityName);
        setValue("universityEmail", selectedUniversity.email);
        setValue("universityPageUrl", selectedUniversity.pageUrl);
        setValue("universityImage", selectedUniversity.image);
        setValue("universityPhone", selectedUniversity.phone);
      }
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    // if (file) {
    //   const imageUrl = URL.createObjectURL(file);
    //   setValue("universityImage", imageUrl);
    // }
  };

  const handleAddUniversity = async () => {
    const formData = new FormData();

    formData.append("name", watch("universityNameOther"));
    formData.append("address", watch("universityAddress"));
    formData.append("faculityName", watch("universityFaculty"));
    formData.append("email", watch("universityEmail"));
    formData.append("pageUrl", watch("universityPageUrl"));
    formData.append("image", watch("universityImage"));
    formData.append("phone", watch("universityPhone"));

    if (selectedFile) {
      formData.append("image", selectedFile);
    } else {
      formData.append("image", "hamada");
    }

    if (!formData.get("name").trim() || !formData.get("address").trim()) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    try {
      setLoading(true);
     
      const token = localStorage.getItem("token");


      const addedUniversity = await adduniversity(formData, token);


      setUniversity((prevUniversities) => [
        ...prevUniversities,
        addedUniversity.data,
      ]);

      setValue("universityName", addedUniversity.data._id, {
        shouldValidate: true,
      });

      setShowOtherUniversity(false);
      setIsoption(false);
      setIsEditable(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add university. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
          <form className="space-y-6">
            <div className="animate-pulse">
              <div className="flex items-center">
                <div className="h-6 bg-gray-300 w-1/2 rounded mb-4"></div>
              </div>
              <div className="flex items-center">
                <div className="h-6 bg-gray-300 w-3/4 rounded mb-4"></div>
              </div>
              <div className="flex items-center">
                <div className="h-6 bg-gray-300 w-full rounded mb-4"></div>
              </div>
              <div className="flex items-center">
                <div className="h-6 bg-gray-300 w-1/2 rounded mb-4"></div>
              </div>
              <div className="flex items-center">
                <div className="h-6 bg-gray-300 w-1/2 rounded mb-4"></div>
              </div>
              <div className="flex items-center">
                <div className="h-6 bg-gray-300 w-1/2 rounded mb-4"></div>
              </div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    onSubmitSuccess(data);
    setLoading(true);
    try {
      // toast.success("Scholarship submitted successfully!");
      navigate("/addscholarship/submitted");
    } catch (error) {
      // console.error("Error:", error);
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12">
      
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              University Name
            </label>
            {errors.universityName && errors.universityNameOther ? (
              <FaExclamationCircle className="text-red-600" />
            ) : (
              <FaCheckCircle className="text-green-600" />
            )}
          </div>
          <select
            {...register("universityName", {
              required: "University name is required",
            })}
            onChange={handleUniversityChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
          >
            <option value="">Select a university</option>
            {university.map((uni) => (
              <option key={uni._id} value={uni._id}>
                {uni.name}
              </option>
            ))}
            {isoption && <option value="other">Other</option>}
          </select>
          {errors.universityName && errors.universityNameOther && (
            <p className="text-red-600">{errors.universityName.message}</p>
          )}

          {showOtherUniversity && (
            <>
              <input
                type="text"
                {...register("universityNameOther", {
                  required: "Please specify the university name",
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message:
                      "university Name must only contain letters and spaces",
                  },
                  validate: {
                    startsWithCapital: (value) =>
                      /^[A-Z]/.test(value) ||
                      "university Name must start with a capital letter",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
                placeholder="Enter university name"
                disabled={!isEditable}
              />
              {errors.universityNameOther && (
                <p className="text-red-600">
                  {errors.universityNameOther.message}
                </p>
              )}
            </>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              University Address
            </label>
          </div>
          <input
            type="text"
            {...register("universityAddress", {
              required: "University address is required",
              pattern: {
                value: /^[a-zA-Z\s,]+$/,
                message:
                  "University Address must only contain letters , spaces and commas",
              },
              validate: {
                startsWithCapital: (value) =>
                  /^[A-Z]/.test(value) ||
                  "University Address must start with a capital letter",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
            placeholder="Enter university address"
            disabled={!isEditable}
            value={
              selectedUniversityData
                ? selectedUniversityData.address
                : watch("universityAddress") || ""
            }
          />
          {errors.universityAddress && (
            <p className="text-red-600">{errors.universityAddress.message}</p>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              Faculty Name
            </label>
          </div>
          <input
            type="text"
            {...register("universityFaculty", {
              required: "Faculty Name is required",
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: "Faculty Name must only contain letters and spaces",
              },
              validate: {
                startsWithCapital: (value) =>
                  /^[A-Z]/.test(value) ||
                  "Faculty Name must start with a capital letter",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
            placeholder="Enter faculty name"
            disabled={!isEditable}
            value={
              selectedUniversityData
                ? selectedUniversityData.faculityName
                : watch("universityFaculty") || ""
            }
          />
          {errors.universityFaculty && (
            <p className="text-red-600">{errors.universityFaculty.message}</p>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              University Email
            </label>
          </div>
          <input
            type="email"
            {...register("universityEmail", {
              required: "University email is required",
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Invalid email format",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
            placeholder="Enter university email"
            disabled={!isEditable}
            value={
              selectedUniversityData
                ? selectedUniversityData.email
                : watch("universityEmail") || ""
            }
          />
          {errors.universityEmail && (
            <p className="text-red-600">{errors.universityEmail.message}</p>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              University Page URL
            </label>
          </div>

          <input
            type="text"
            {...register("universityPageUrl", {
              required: "Page URL is required",
              pattern: {
                value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/,
                message: "Invalid URL format",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
            placeholder="Enter university page URL"
            disabled={!isEditable}
            value={
              selectedUniversityData
                ? selectedUniversityData.pageUrl
                : watch("universityPageUrl") || ""
            }
          />
          {errors.universityPageUrl && (
            <p className="text-red-600">{errors.universityPageUrl.message}</p>
          )}

          <div className="flex items-center">
            <label
              htmlFor="universityPhone"
              className="text-[#8A690F] mr-2 font-medium text-xl"
            >
              University Phone
            </label>
          </div>
          <input
            type="text"
            {...register("universityPhone", {
              pattern: {
                value: /^[0-9]+$/,
                message: "Only numbers are allowed",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
            placeholder="Enter university phone"
            disabled={!isEditable}
            value={
              selectedUniversityData
                ? selectedUniversityData.phone
                : watch("universityPhone") || ""
            }
          />
          {errors.universityPhone && (
            <p className="text-red-600">{errors.universityPhone.message}</p>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              University Image
            </label>
          </div>
          {selectedUniversityData && selectedUniversityData.image && (
            <img
              src={selectedUniversityData.image}
              alt="University"
              className="w-full max-h-full object-cover rounded-md mb-4"
              loading="lazy"
            />
          )}

          {showOtherUniversity && (
            <>
              <input
                type="file"
                {...register("universityImage")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
                accept="image/*"
                onChange={handleFileChange}
                disabled={!isEditable}
              />
              {errors.universityImage && (
                <p className="text-red-600">{errors.universityImage.message}</p>
              )}
            </>
          )}

          {showOtherUniversity && (
            <button
              type="button"
            
              onClick={handleAddUniversity}
              disabled={!isValid||loading}
              className={`"mt-2 text-white px-4 py-2 rounded" ${
      isValid
        ? "bg-[#003a65] hover:bg-[#002a4b]"
        : "bg-blue-600 hover:bg-blue-700"
    } disabled:bg-gray-400 focus:outline-none`}
            >
              {loading ? "Adding..." : "Add University"}
            </button>
          )}

{editMode ? (
        <button
        type="submit"
        disabled={!isValid || loading||showOtherUniversity}
        className={`w-full py-3  text-white rounded-lg ${
          isValid
            ? "bg-[#003a65] hover:bg-[#002a4b]"
            : "bg-blue-600 hover:bg-blue-700"
        } disabled:bg-gray-400 focus:outline-none`}
      >
        {loading ? "editting..." : "Edit"}
      </button>

) : (
          <button
            type="submit"
            disabled={!isValid || loading||showOtherUniversity}
            className={`w-full py-3  text-white rounded-lg ${
              isValid
                ? "bg-[#003a65] hover:bg-[#002a4b]"
                : "bg-blue-600 hover:bg-blue-700"
            } disabled:bg-gray-400 focus:outline-none`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          )}
        </form>
      </div>
    </div>
  );
}
