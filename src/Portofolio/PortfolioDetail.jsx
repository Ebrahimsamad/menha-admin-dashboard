import React, { useState } from "react";
import { toast } from "react-hot-toast";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import RepeatParagrah from "../ui/RepeatPara";
import portfolioService from "../services/portfolioService";
import Spinner from "../ui/Spinner";

const PortfolioDetail = ({ portfolio, updatePortfolioStatus }) => {
  const [showRejectReasonModal, setShowRejectReasonModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [imageToShow, setImageToShow] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await portfolioService.acceptPortfolio(portfolio._id);
      updatePortfolioStatus(portfolio._id, true, false);
      toast.success("Portfolio accepted successfully!");
    } catch (err) {
      toast.error("Error accepting portfolio.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (loading) return;
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    setLoading(true);
    try {
      await portfolioService.rejectPortfolio(portfolio._id, rejectReason);
      updatePortfolioStatus(portfolio._id, false, true);
      toast.success("Portfolio rejected successfully.");
      setShowRejectReasonModal(false);
      setRejectReason("");
    } catch (err) {
      toast.error("Error rejecting portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openImagePopup = (image) => {
    setImageToShow(image);
    setShowImagePopup(true);
  };

  const closeImagePopup = () => {
    setShowImagePopup(false);
    setImageToShow("");
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto mt-8 border border-gray-200">
      <div className="flex items-center mb-6">
        <img
          src={portfolio.userID.image}
          alt="User Profile"
          className="w-24 h-24 rounded-full mr-4 border-2"
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {portfolio.userID?.userName}
          </h2>
          <p className="text-gray-600">{portfolio.userID?.email}</p>
          <span
            className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mt-2 ${
              portfolio.isAccept
                ? "bg-green-100 text-green-800"
                : portfolio.isReject
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {portfolio.isAccept
              ? "Accepted"
              : portfolio.isReject
              ? "Rejected"
              : "Pending"}
          </span>
        </div>
      </div>
      <RepeatParagrah>
        <h3 className="text-3xl">Personal Information</h3>
      </RepeatParagrah>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[
          { label: "Phone", value: portfolio.phone },
          { label: "Gender:", value: portfolio.gender },
          { label: "Age:", value: portfolio.age },
          { label: "Level of Study", value: portfolio.levelOfStudy },
          {
            label: "Military Status",
            value: portfolio.militaryStatusImage && (
              <button
                onClick={() => openImagePopup(portfolio.militaryStatusImage)}
                className="text-[#B5A269] underline hover:text-[#e6cb7a]"
              >
                View Image
              </button>
            ),
          },
          {
            label: "ID Image",
            value: portfolio.IDImage && (
              <button
                onClick={() => openImagePopup(portfolio.IDImage)}
                className="text-[#B5A269] underline hover:text-[#e6cb7a]"
              >
                View Image
              </button>
            ),
          },
          {
            label: "Graduation Image",
            value: portfolio.graduationImage && (
              <button
                onClick={() => openImagePopup(portfolio.graduationImage)}
                className="text-[#B5A269] underline hover:text-[#e6cb7a]"
              >
                View Image
              </button>
            ),
          },
        ].map((detail, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="text-lg text-[#003a65] font-semibold mb-2">
              {detail.label}
            </h3>
            <p className="text-gray-700">{detail.value || "N/A"}</p>
          </div>
        ))}
      </div>
      <RepeatParagrah>
        <h3 className="text-3xl">Scholarship Information</h3>
      </RepeatParagrah>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[
          { label: "Course Type", value: portfolio.courseTypeId?.courseType },
          {
            label: "Field of Study",
            value: portfolio.fieldOfStudyId?.fieldOfStudy,
          },
          {
            label: "Mode of Study",
            value: portfolio.modeOfStudyId?.modeOfStudy,
          },
          {
            label: "Beginning:",
            value: portfolio.isWinter ? "winter" : "summer",
          },
          {
            label: "Full-Time/part-time",
            value: portfolio.isFullTime ? "Full-Time" : "Part-Time",
          },
          {
            label: "Free/Not Free",
            value: portfolio.isFree ? " free" : "not free",
          },
          { label: "Language", value: portfolio.languageId?.name },
          {
            label: "Language Courses",
            value:
              portfolio.languageId?.course &&
              portfolio.languageId.course.length > 0
                ? portfolio.languageId.course.join(", ")
                : "N/A",
          },
          { label: "GPA", value: portfolio.gpa },
        ].map((detail, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="text-lg text-[#003a65] font-semibold mb-2">
              {detail.label}
            </h3>
            <p className="text-gray-700">{detail.value || "N/A"}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        {!portfolio.isAccept && !portfolio.isReject && (
          <>
            <SecondaryButton onClick={handleAccept} disabled={loading}>
              {loading ? (
                <div className=" flex items-center ">
                  <Spinner color={"#003a65"} />{" "}
                  <span className="ms-2"> Accepting...</span>
                </div>
              ) : (
                "Accept"
              )}
            </SecondaryButton>
            <PrimaryButton
              onClick={() => setShowRejectReasonModal(true)}
              disabled={loading}
            >
              Reject
            </PrimaryButton>
          </>
        )}
      </div>
      {showImagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <img
              src={imageToShow}
              alt="Document"
              className="max-w-full h-auto"
            />
            <button
              className="mt-4 bg-gray-300 text-gray-800 rounded px-4 py-2 hover:bg-gray-400"
              onClick={closeImagePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showRejectReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">
              Provide a Reason for Rejection
            </h3>
            <textarea
              className="w-full border border-gray-300 p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
            ></textarea>
            <div className="flex justify-end">
              <SecondaryButton
                onClick={() => setShowRejectReasonModal(false)}
                disabled={loading}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleReject} disabled={loading}>
                {loading ? (
                  <div className=" flex items-center ">
                    <Spinner /> <span className="ms-2"> Processing...</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PortfolioDetail;
