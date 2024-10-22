/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { addCourseType } from "../../services/AddScholarshipCourseType";
import { AddFieldOfStudy } from "../../services/AddScholarshipFieldOfStudy";

export default function ScholarShipForm1({
  onSubmitSuccess,
  courseTypes,
  fieldsOfStudy,
  setCourseType,
  setFieldOfStudy,
}) {
  const [loading, setLoading] = useState(false);
  const [showOtherFieldOfStudy, setShowOtherFieldOfStudy] = useState(false);
  const [showOtherCourseType, setShowOtherCourseType] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [showAddFieldButton, setShowAddFieldButton] = useState(false);
  const [isoption, setIsoption] = useState(true);
  const [isoptionFieldOfStudy, setisoptionFieldOfStudy] = useState(true);

  const [courseTypeOther, setCourseTypeOther] = useState("");
  const [fieldOfStudyOther, setfieldOfStudyOther] = useState("");

  const [gpaOther, setGpaOther] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const savedData = localStorage.getItem("form1Data");
    if (savedData) {
      const formData = JSON.parse(savedData);
      Object.keys(formData).forEach((key) => {
        setValue(key, formData[key], { shouldValidate: true });
      });
    }
  }, [setValue]);
  useEffect(() => {
    if (courseTypes.length > 0) {
      // console.log("Updated Course Types:", courseTypes);
    }
  }, [courseTypes]);

  useEffect(() => {
    if (fieldsOfStudy.length > 0) {
      // console.log("Updated field of study:", fieldsOfStudy);
    }
  }, [fieldsOfStudy]);

  const saveDataToLocalStorage = () => {
    const currentValues = getValues();
    localStorage.setItem("form1Data", JSON.stringify(currentValues));
  };

  const onSubmit = async (data) => {
    setLoading(true);

    onSubmitSuccess(data);

    try {
      // console.log("Form Data:", data);

      navigate("/addscholarship/ScholarShip-Form2");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseTypeChange = (event) => {
    const selectedValue = event.target.value;
    setValue("courseType", selectedValue, { shouldValidate: true });

    if (selectedValue === "other") {
      setShowOtherCourseType(true);
    } else {
      setShowOtherCourseType(false);
      setValue("courseTypeOther", "");
    }

    saveDataToLocalStorage();
  };

  const handleAddCourseType = async () => {
    if (courseTypeOther.trim() === "") {
      toast.error("Please enter a valid course type.");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      console.log("Adding course type:", { courseType: courseTypeOther });

      const newCourseType = await addCourseType(
        { courseType: courseTypeOther },
        token
      );

      // console.log("Newly added course type:", newCourseType);

      setCourseType((prevCourseTypes) => [
        ...prevCourseTypes,
        newCourseType.newCourseType,
      ]);
      setValue("courseType", newCourseType.newCourseType._id, {
        shouldValidate: true,
      });

      // console.log("Newly added course type:", courseTypes);
      // console.log(getValues());
      // console.log("Newly added course type:", newCourseType);

      setShowOtherCourseType(false);
      setCourseTypeOther("");
      setShowAddButton(false);
      setIsoption(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message ||
          "Failed to add Course Type. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFieldOfStudyChange = (event) => {
    const selectedValue = event.target.value;
    setValue("fieldOfStudy", selectedValue, { shouldValidate: true });
    if (selectedValue === "other") {
      setShowOtherFieldOfStudy(true);
    } else {
      setShowOtherFieldOfStudy(false);
      setValue("fieldOfStudyOther", "");
    }
    saveDataToLocalStorage();
  };

  const handleAddFieldOfStudy = async () => {
    // console.log("fieldOfStudyOther:", fieldOfStudyOther);
    if (fieldOfStudyOther.trim() === "") {
      toast.error("Please enter a valid field of study.");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      console.log("Adding field of study:", {
        fieldOfStudy: fieldOfStudyOther,
      });
      const newFieldOfStudy = await AddFieldOfStudy(
        { fieldOfStudy: fieldOfStudyOther },
        token
      );

      // console.log("Newly added field of study:", newFieldOfStudy);

      setFieldOfStudy((prevFieldOfStudy) => [
        ...prevFieldOfStudy,
        newFieldOfStudy.newFieldOfStudy,
      ]);
      setValue("fieldOfStudy", newFieldOfStudy.newFieldOfStudy._id, {
        shouldValidate: true,
      });

      // console.log("Newly added Field of study:", fieldsOfStudy);
      // console.log(getValues());

      // console.log("Newly added Field of study:", newFieldOfStudy);

      setShowOtherFieldOfStudy(false);
      setfieldOfStudyOther("");
      setShowAddFieldButton(false);
      setisoptionFieldOfStudy(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message ||
          "Failed to add field of study. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentValues = getValues();
    if (currentValues.courseType) {
      saveDataToLocalStorage();
    }
  }, [getValues, setValue]);

  useEffect(() => {
    const currentValues = getValues();
    if (currentValues.fieldOfStudy) {
      saveDataToLocalStorage();
    }
  }, [getValues, setValue]);

  const handleGpaChange = (event) => {
    const selectedValue = event.target.value;
    setValue("gpaOption", selectedValue, { shouldValidate: true });

    if (selectedValue === "other") {
      setGpaOther(true);
    } else {
      setGpaOther(false);
      setValue("gpa", "");
    }

    saveDataToLocalStorage();
  };
  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12">
  //       <Toaster />
  //       <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
  //         <form className="space-y-6">
  //           <div className="animate-pulse">
  //             <div className="flex items-center">
  //               <div className="h-6 bg-gray-300 w-1/2 rounded mb-4"></div>
  //             </div>
  //             <div className="flex items-center">
  //               <div className="h-6 bg-gray-300 w-3/4 rounded mb-4"></div>
  //             </div>
  //             <div className="flex items-center">
  //               <div className="h-6 bg-gray-300 w-full rounded mb-4"></div>
  //             </div>
  //             <div className="flex items-center">
  //               <div className="h-6 bg-gray-300 w-1/2 rounded mb-4"></div>
  //             </div>
  //             <div className="flex items-center">
  //               <div className="h-6 bg-gray-300 w-1/2 rounded mb-4"></div>
  //             </div>
  //             <div className="flex items-center">
  //               <div className="h-6 bg-gray-300 w-1/2 rounded mb-4"></div>
  //             </div>
  //             <div className="h-12 bg-gray-300 rounded"></div>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              Title
            </label>
            {errors.title ? (
              <FaExclamationCircle className="text-red-600" />
            ) : (
              <FaCheckCircle className="text-green-600" />
            )}
          </div>
          <input
            type="text"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
              pattern: {
                value: /^[a-zA-Z]+$/,
                message: "Title must only contain letters without spaces",
              },
              validate: {
                noSpaces: (value) =>
                  !/\s/.test(value) || "Title must not contain spaces",
                startsWithCapital: (value) =>
                  /^[A-Z]/.test(value) ||
                  "Title must start with a capital letter",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
            placeholder="Enter the title"
          />
          {errors.title && (
            <p className="text-red-600">{errors.title.message}</p>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              Description
            </label>
            {errors.description ? (
              <FaExclamationCircle className="text-red-600" />
            ) : (
              <FaCheckCircle className="text-green-600" />
            )}
          </div>
          <textarea
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: "Description must only contain letters and spaces",
              },
              validate: {
                startsWithCapital: (value) =>
                  /^[A-Z]/.test(value) ||
                  "Title must start with a capital letter",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
            placeholder="Enter a brief description"
          />
          {errors.description && (
            <p className="text-red-600">{errors.description.message}</p>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              GPA (1 - 4)
            </label>
            {errors.gpaOption ? (
              <FaExclamationCircle className="text-red-600" />
            ) : (
              <FaCheckCircle className="text-green-600" />
            )}
          </div>
          <select
            {...register("gpaOption", { required: "GPA is required" })}
            onChange={handleGpaChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
          >
            <option value="">Select GPA</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="4">5</option>
            <option value="other">Other</option>
          </select>
          {errors.gpaOption && (
            <p className="text-red-600">{errors.gpaOption.message}</p>
          )}

          {gpaOther && (
            <input
              type="text"
              {...register("gpa", {
                required: "GPA is required when 'Other' is selected",
                min: { value: 1, message: "GPA must be between 1 and 5" },
                max: { value: 5, message: "GPA must be between 1 and 5" },
                pattern: {
                  value: /^[0-9]+(\.[0-9]{1,2})?$/,
                  message: "GPA must be a valid number",
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
              placeholder="Enter GPA"
              onChange={(e) => {
                setValue("gpa", e.target.value, { shouldValidate: true });
                saveDataToLocalStorage();
              }}
            />
          )}
          {errors.gpa && <p className="text-red-600">{errors.gpa.message}</p>}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              Field of Study
            </label>
            {errors.fieldOfStudyOther ? (
              <FaExclamationCircle className="text-red-600" />
            ) : (
              <FaCheckCircle className="text-green-600" />
            )}
          </div>
          <select
            {...register("fieldOfStudy", {
              required: "Field of Study is required",
            })}
            onChange={handleFieldOfStudyChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
          >
            <option value="">Select Field of Study</option>
            {fieldsOfStudy.map((field) => (
              <option key={field._id} value={field._id}>
                {field.fieldOfStudy}
              </option>
            ))}
            {isoptionFieldOfStudy && <option value="other">Other</option>}
          </select>
          {showOtherFieldOfStudy && (
            <>
              <input
                type="text"
                {...register("fieldOfStudyOther", {
                  required:
                    "Field of Study is required when 'Other' is selected",
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message:
                      "Field of Study must only contain letters and spaces",
                  },
                  validate: {
                    startsWithCapital: (value) =>
                      /^[A-Z]/.test(value) ||
                      "Title must start with a capital letter",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
                placeholder="Please specify"
                onChange={(e) => {
                  setValue("fieldOfStudyOther", e.target.value, {
                    shouldValidate: true,
                  });
                  setfieldOfStudyOther(e.target.value);
                  saveDataToLocalStorage();
                  setShowAddFieldButton(e.target.value.trim() !== "");
                }}
              />

              {errors.fieldOfStudyOther && (
                <p className="text-red-600">
                  {errors.fieldOfStudyOther.message}
                </p>
              )}

              {showAddFieldButton && (
                <button
                  type="button"
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleAddFieldOfStudy}
                  disabled={loading}
                >
                  {loading ? "Adding....." : "Add"}
                </button>
              )}
            </>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              Course Type
            </label>
            {errors.courseTypeOther ? (
              <FaExclamationCircle className="text-red-600" />
            ) : (
              <FaCheckCircle className="text-green-600" />
            )}
          </div>
          <select
            {...register("courseType", { required: "Course Type is required" })}
            onChange={handleCourseTypeChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
          >
            <option value="">Select Course Type</option>
            {courseTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.courseType}
              </option>
            ))}
            {isoption && <option value="other">Other</option>}
          </select>

          {showOtherCourseType && (
            <>
              <input
                type="text"
                {...register("courseTypeOther", {
                  required: "Course Type is required when 'Other' is selected",
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: "Course Type must only contain letters and spaces",
                  },
                  validate: {
                    startsWithCapital: (value) =>
                      /^[A-Z]/.test(value) ||
                      "Title must start with a capital letter",
                  },
                })}
                className="w-full px-4 py-2 border  border-gray-300 rounded-md mt-2 focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
                placeholder="Please specify"
                onChange={(e) => {
                  setValue("courseTypeOther", e.target.value, {
                    shouldValidate: true,
                  });

                  setCourseTypeOther(e.target.value);

                  saveDataToLocalStorage();
                  setShowAddButton(e.target.value.trim() !== "");
                }}
              />
              {errors.courseTypeOther && (
                <p className="text-red-600">{errors.courseTypeOther.message}</p>
              )}

              {showAddButton && (
                <button
                  type="button"
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleAddCourseType}
                  disabled={!isValid || loading}
                >
                  {loading ? "Adding....." : "Add"}
                </button>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={!isValid || loading||showAddButton||showAddFieldButton}
            className={`w-full py-3  text-white rounded-lg ${
              isValid
                ? "bg-[#003a65] hover:bg-[#002a4b]"
                : "bg-blue-600 hover:bg-blue-700"
            } disabled:bg-gray-400 focus:outline-none`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
