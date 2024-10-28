/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { addlanguage } from "./../../services/AddLanguage";

  

export default function ScholarshipForm2({
  onSubmitSuccess,
  modeOfStudy,
  courseLanguage,
  setCourseLanguage,
  isForm1Submitted,
  isForm2Submitted,
}) {
  const [duration , setduration] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [selectedLanguageData, setSelectedLanguageData] = useState(null);
  const navigate = useNavigate();
  const [showOtherLanguage, setShowOtherLanguage] = useState(false);
  const [isLanguageEditable, setIsLanguageEditable] = useState(false);
  const [isoption, setIsoption] = useState(true);
  const editMode = localStorage.getItem("editMode");
  const idParam = localStorage.getItem("id");
  useEffect(()=>{

    if(!isForm1Submitted){
      navigate("/addscholarship/ScholarShip-Form1")
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
    const savedData = localStorage.getItem("form2Data");
    if (savedData) {
      const formData = JSON.parse(savedData);
      if (formData.duration) {
        const duration = formData.duration; 
        setduration(duration);
      }
      Object.keys(formData).forEach((key) => {
        setValue(key, formData[key], { shouldValidate: true });
      });
    }
  }, [setValue]);

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem("form2Data", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.language && value.language !== "other") {
        const selectedLanguage = courseLanguage.find(
          (lang) => lang._id === value.language
        );
        setSelectedLanguageData(selectedLanguage);
        if (selectedLanguage) {
          setValue("course", selectedLanguage.course.join(","));
          setShowOtherLanguage(false);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [courseLanguage, setValue, watch]);

  const handleLanguageChange = (event) => {
    setSelectedLanguageData(null);
    const selectedValue = event.target.value;

    if (selectedValue === "other") {
      setSelectedLanguageData(null);
      setShowOtherLanguage(true);
      setIsLanguageEditable(true);
    
    } else {
      setShowOtherLanguage(false);
      setIsLanguageEditable(false);
      const selectedLanguage = courseLanguage.find(
        (lang) => lang._id === selectedValue
      );
      setSelectedLanguageData(selectedLanguage);
      
      if (selectedLanguage) {
        const string = selectedLanguage.course.join(",");
        
      } else {
        setValue("course", "");
      }
    }
  };

  const handleAddLanguage = async () => {
    const newLanguage = {
      name: watch("languageOther"),
      course: watch("course").split(","),
    };
    if (!newLanguage.name || newLanguage.course.length === 0) {
      toast.error(
        "Please fill in all the required fields for the new language."
      );
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const addedLanguage = await addlanguage(newLanguage, token);
      
      setCourseLanguage((prevLanguages) => [
        ...prevLanguages,
        addedLanguage.newLanguage,
      ]);
      setValue("language", addedLanguage.newLanguage._id, {
        shouldValidate: true,
      });
      setShowOtherLanguage(false);
      setIsLanguageEditable(false);
      setIsoption(false);
    } catch (error) {
      toast.error("Failed to add language. Please try again.");
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
    const transformedData = {
      ...data,
      isWinter: data.beginning === "Winter" ? true : false,
      isFree: data.funding === "Free" ? true : false,
      isFullTime: data.studyType === "Full-Time" ? true : false,
    };
   

    onSubmitSuccess(transformedData);
    setLoading(true);
    try {

      navigate("/addscholarship/university-Form");
    } catch (error) {

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
              Country
            </label>
            {errors.country ? (
              <FaExclamationCircle className="text-red-600" />
            ) : (
              <FaCheckCircle className="text-green-600" />
            )}
          </div>
          <input
            type="text"
            {...register("country", {
              required: "Country is required",
              minLength: {
                value: 3,
                message: "Country must be at least 3 characters",
              },
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: "Country must only contain letters and spaces",
              },
              validate: {
                startsWithCapital: (value) =>
                  /^[A-Z]/.test(value) ||
                  "Title must start with a capital letter",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
            placeholder="Enter your country"
          />
          {errors.country && (
            <p className="text-red-600">{errors.country.message}</p>
          )}
          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              Duration (in Years)
            </label>
            {errors.duration &&!duration? (
              <FaExclamationCircle className="text-red-600" />
            ) : (
              <FaCheckCircle className="text-green-600" />
            )}
          </div>
          <input
            type="number"
            value={duration}
            {...register("duration", {
              // required: "Duration is required",
              onChange: (e) => setduration(e.target.value),
              min: {
                value: 1,
                message: "Duration must be at least 1 year",
              },
              max: {
                value: 4,
                message: "Duration cannot exceed 4 years",
              },
              validate: {
                isNumber: (value) =>
                  !isNaN(value) || "Duration must be a valid number",
                positiveNumber: (value) =>
                  value > 0 || "Duration must be a positive number",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
            placeholder="Enter the duration in Years"
          />
          {errors.duration && (
            <p className="text-red-600">{errors.duration.message}</p>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              Mode of Study
            </label>
            {errors.modeOfStudy ? (
              <FaExclamationCircle className="text-red-600" />
            ) : (
              <FaCheckCircle className="text-green-600" />
            )}
          </div>
          <select
            {...register("modeOfStudy", {
              required: "Mode of Study is required",
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
          >
            {" "}
            <option value="">Select Mode of Study</option>
            {modeOfStudy.map((mode) => (
              <option key={mode._id} value={mode._id}>
                {mode.modeOfStudy}
              </option>
            ))}
          </select>
          {errors.modeOfStudy && (
            <p className="text-red-600">{errors.modeOfStudy.message}</p>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              Language
            </label>
            {errors.language && errors.languageOther ? (
              <FaExclamationCircle className="text-red-600" />
            ) : (
              <FaCheckCircle className="text-green-600" />
            )}
          </div>
          <select
            {...register("language", { required: "Language is required" })}
            onChange={handleLanguageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
          >
            <option value="">Select a language</option>
            {courseLanguage.map((lang) => (
              <option key={lang._id} value={lang._id}>
                {lang.name}
              </option>
            ))}
            {isoption && <option value="other">Other</option>}
          </select>
          {errors.language && errors.languageOther && (
            <p className="text-red-600">{errors.language.message}</p>
          )}

          {showOtherLanguage && (
            <>
              <input
                type="text"
                {...register("languageOther", {
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
                disabled={!isLanguageEditable}
              />
              {errors.languageOther && (
                <p className="text-red-600">{errors.languageOther.message}</p>
              )}
            </>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              Courses
            </label>
          </div>
          <input
            type="text"
            {...register("course", { required: "Courses are required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
            placeholder="Available course"
            disabled={!isLanguageEditable}
            value={
              selectedLanguageData
                ? selectedLanguageData.course
                : watch("course") || ""
            }
          />
          {errors.course && (
            <p className="text-red-600">{errors.course.message}</p>
          )}

          {showOtherLanguage && (
            <button
              type="button"
              onClick={handleAddLanguage}
              disabled={!isValid ||loading}
              className={`"mt-2 text-white px-4 py-2 rounded" ${
                isValid
                  ? "bg-[#003a65] hover:bg-[#002a4b]"
                  : "bg-blue-600 hover:bg-blue-700"
              } disabled:bg-gray-400 focus:outline-none`}
              
            >
              {loading ? "Adding..." : "Add Language"}
            </button>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              Beginning
            </label>
            {errors.beginning ? (
              <FaExclamationCircle className="text-red-600" />
            ) : (
              <FaCheckCircle className="text-green-600" />
            )}
          </div>
          <select
            {...register("beginning", {
              required: "Beginning season is required",
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
          >
              <option value="">Select beginning value</option>
            <option value="Winter">Winter</option>
            <option value="Summer">Summer</option>
          </select>
          {errors.beginning && (
            <p className="text-red-600">{errors.beginning.message}</p>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              Funding
            </label>
            {errors.funding ? (
              <FaExclamationCircle className="text-red-600" />
            ) : (
              <FaCheckCircle className="text-green-600" />
            )}
          </div>
          <select
            {...register("funding", { required: "Funding status is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
          >
            <option value="">Select funding value</option>
            <option value="Free">Free</option>
            <option value="Not-Free">Not-Free</option>
          </select>
          {errors.funding && (
            <p className="text-red-600">{errors.funding.message}</p>
          )}

          <div className="flex items-center">
            <label className="text-[#8A690F] mr-2 font-medium text-xl">
              Full-Time/Part-Time
            </label>
            {errors.studyType ? (
              <FaExclamationCircle className="text-red-600" />
            ) : (
              <FaCheckCircle className="text-green-600" />
            )}
          </div>
          <select
            {...register("studyType", {
              required: "Full-Time/Part-Time is required",
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-[#003a65] focus:ring-[#003a65] focus:border-[#003a65]"
          >
            <option value="">Select study Type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
          </select>
          {errors.studyType && (
            <p className="text-red-600">{errors.studyType.message}</p>
          )}

          {editMode ? (
        <button
        type="submit"
        disabled={!isValid || loading||showOtherLanguage}
        className={`w-full py-3  text-white rounded-lg ${
          isValid
            ? "bg-[#003a65] hover:bg-[#002a4b]"
            : "bg-blue-600 hover:bg-blue-700"
        } disabled:bg-gray-400 focus:outline-none`}
      >
        {loading ? "editting..." : "Next"}
      </button>

) : (
          <button
            type="submit"
            disabled={!isValid || loading||showOtherLanguage}
            className={`w-full py-3  text-white rounded-lg ${
              isValid
                ? "bg-[#003a65] hover:bg-[#002a4b]"
                : "bg-blue-600 hover:bg-blue-700"
            } disabled:bg-gray-400 focus:outline-none`}
          >
            {loading ? "Submitting..." : "Next"}
          </button>
          )}
        </form>
      </div>
    </div>
  );
}
