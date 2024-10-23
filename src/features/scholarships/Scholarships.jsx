// import React, { useEffect, useState } from "react";
// import ScholarshipService from "../../services/ScholarshipService";
// import SecondaryButton from "../../ui/SecondaryButton";
// import PrimaryButton from "../../ui/PrimaryButton";
// import RepeatParagrah from "../../ui/RepeatPara";
// import toast from "react-hot-toast";
// import ConfirmDeleteModal from "./ConfirmDeleteModal";
// import SkeletonRow from "../../ui/SkeletonRowThree";

// const Scholarships = () => {
//   const [scholarships, setScholarships] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedScholarshipId, setSelectedScholarshipId] = useState(null);

//   const fetchScholarships = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const data = await ScholarshipService.fetchScholarships();
//       setScholarships(data);
//     } catch (err) {
//       setError("Failed to fetch scholarships");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchScholarships();
//   }, []);

//   const handleDelete = async () => {
//     setLoading(true);
//     try {
//       await ScholarshipService.deleteScholarship(selectedScholarshipId);
//       toast.success("Scholarship deleted successfully");
//       fetchScholarships();
//     } catch (err) {
//       console.error("Delete error details: ", err);
//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to delete scholarship";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//       setIsModalOpen(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <RepeatParagrah>
//         <h1 className="text-2xl sm:text-3xl mb-4">Scholarships List</h1>
//       </RepeatParagrah>
//       {loading ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead className="bg-gray-100 text-gray-700 text-xs">
//               <tr>
//                 <th className="px-4 py-3 text-left font-semibold">Title</th>
//                 <th className="px-4 py-3 text-left font-semibold">
//                   University
//                 </th>
//                 <th className="px-4 py-3 text-left font-semibold"></th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               <SkeletonRow />
//               <SkeletonRow />
//               <SkeletonRow />
//               <SkeletonRow />
//               <SkeletonRow />
//               <SkeletonRow />
//               <SkeletonRow />
//               <SkeletonRow />
//               <SkeletonRow />
//               <SkeletonRow />
//             </tbody>
//           </table>
//         </div>
//       ) : error ? (
//         <div className="text-red-500 text-center mb-4">{error}</div>
//       ) : (
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           {scholarships.length > 0 ? (
//             <table className="min-w-full leading-normal">
//               <thead>
//                 <tr>
//                   <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Title
//                   </th>
//                   <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     University
//                   </th>
//                   <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {scholarships.map((scholarship) => (
//                   <tr key={scholarship._id}>
//                     <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
//                       {scholarship.title || "N/A"}
//                     </td>
//                     <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
//                       {scholarship.universityId?.name || "N/A"}
//                     </td>
//                     <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
//                       <SecondaryButton
//                         onClick={() => alert(`Edit ${scholarship._id}`)}
//                       >
//                         Edit
//                       </SecondaryButton>
//                       <PrimaryButton
//                         onClick={() => {
//                           setSelectedScholarshipId(scholarship._id);
//                           setIsModalOpen(true);
//                         }}
//                       >
//                         Delete
//                       </PrimaryButton>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="text-center py-4 text-gray-500">
//               No scholarships available at the moment.
//             </div>
//           )}
//         </div>
//       )}
//       <ConfirmDeleteModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={handleDelete}
//       />
//     </div>
//   );
// };

// export default Scholarships;

import React, { useEffect, useState } from "react";
import ScholarshipService from "../../services/ScholarshipService";
import SecondaryButton from "../../ui/SecondaryButton";
import PrimaryButton from "../../ui/PrimaryButton";
import RepeatParagrah from "../../ui/RepeatPara";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import SkeletonRow from "../../ui/SkeletonRowThree";
import { Link } from "react-router-dom";

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState(null);

  const fetchScholarships = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await ScholarshipService.fetchScholarships();
      setScholarships(data);
    } catch (err) {
      setError("Failed to fetch scholarships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await ScholarshipService.deleteScholarship(selectedScholarshipId);
      toast.success("Scholarship deleted successfully");
      fetchScholarships();
    } catch (err) {
      console.error("Delete error details: ", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete scholarship";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <RepeatParagrah>
        <h1 className="text-2xl sm:text-3xl mb-4">Scholarships List</h1>
      </RepeatParagrah>
      <div className="flex justify-end mb-4">
        {!loading && !error && (
          <Link
            to="/addscholarship"
            className="btn btn-primary py-2 text-center text-white px-4 rounded-lg shadow-md bg-[#003a65] hover:bg-[#002a4b] transition text-xs sm:text-sm"
          >
            Add New Scholarship
          </Link>
        )}
      </div>

      {loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700 text-xs">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Title</th>
                <th className="px-4 py-3 text-left font-semibold">
                  University
                </th>
                <th className="px-4 py-3 text-left font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(10)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mb-4">{error}</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {scholarships.length > 0 ? (
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    University
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"></th>
                </tr>
              </thead>

              <tbody>
                {scholarships.map((scholarship) => (
                  <tr key={scholarship._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {scholarship.title || "N/A"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {scholarship.universityId?.name || "N/A"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex flex-col sm:flex-row gap-2 justify-end">
                        <SecondaryButton
                          onClick={() => alert(`Edit ${scholarship._id}`)}
                        >
                          Edit
                        </SecondaryButton>
                        <PrimaryButton
                          onClick={() => {
                            setSelectedScholarshipId(scholarship._id);
                            setIsModalOpen(true);
                          }}
                        >
                          Delete
                        </PrimaryButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No scholarships available at the moment.
            </div>
          )}
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Scholarships;
