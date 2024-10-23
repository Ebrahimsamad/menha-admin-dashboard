// import React, { useEffect, useState } from "react";
// import UniversityService from "../../services/UniversityService";
// import UniversityModal from "./UniversityModal"; // Importing the modal component
// import PrimaryButton from "../../ui/PrimaryButton";
// import RepeatParagraph from "../../ui/RepeatPara";
// import toast from "react-hot-toast";

// const Universities = () => {
//   const [universities, setUniversities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [currentUniversity, setCurrentUniversity] = useState(null);

//   const fetchUniversities = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const data = await UniversityService.fetchUniversities();
//       setUniversities(data);
//     } catch (err) {
//       setError("Failed to fetch universities. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUniversities();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this university?")) {
//       return;
//     }

//     setLoading(true);
//     try {
//       await UniversityService.deleteUniversity(id);
//       toast.success("University deleted successfully");
//       fetchUniversities(); // Refresh list
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to delete university. Please try again.";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     const data = new FormData();

//     // Append the required fields to FormData
//     data.append("name", formData.name);
//     data.append("address", formData.address);
//     data.append("email", formData.email); // Add email
//     data.append("phone", formData.phone); // Add phone number

//     // Append image file if it exists
//     if (formData.image) {
//       data.append("image", formData.image.file);
//     }

//     try {
//       if (currentUniversity) {
//         await UniversityService.editUniversity(currentUniversity._id, data);
//         toast.success("University updated successfully");
//       } else {
//         await UniversityService.createUniversity(data);
//         toast.success("University created successfully");
//       }
//       fetchUniversities(); // Refresh list
//       setModalOpen(false);
//       resetCurrentUniversity();
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to save university. Please try again.";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetCurrentUniversity = () => {
//     setCurrentUniversity(null);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <RepeatParagraph>
//         <h1 className="text-2xl sm:text-3xl mb-4">Universities List</h1>
//       </RepeatParagraph>

//       {loading ? (
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003a65]"></div>
//         </div>
//       ) : error ? (
//         <div className="text-red-500 text-center mb-4">{error}</div>
//       ) : (
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           {universities.length > 0 ? (
//             <table className="min-w-full leading-normal">
//               <thead>
//                 <tr>
//                   <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Address
//                   </th>
//                   <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {universities.map((university) => (
//                   <tr key={university._id}>
//                     <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
//                       {university.name || "N/A"}
//                     </td>
//                     <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
//                       {university.address || "N/A"}
//                     </td>
//                     <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
//                       <PrimaryButton
//                         onClick={() => handleDelete(university._id)}
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
//               No universities available at the moment.
//             </div>
//           )}
//         </div>
//       )}

//       <UniversityModal
//         isOpen={isModalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleSubmit}
//         currentUniversity={currentUniversity}
//       />
//     </div>
//   );
// };

// export default Universities;

// Universities.jsx
import React, { useEffect, useState } from "react";
import UniversityService from "../../services/UniversityService";
import UniversityModal from "./UniversityModal";
import PrimaryButton from "../../ui/PrimaryButton";
import RepeatParagraph from "../../ui/RepeatPara";
import toast from "react-hot-toast";
import DeleteModal from "./DeleteModal"; // Import the custom delete modal
import SkeletonRow from "../../ui/SkeletonRowThree";

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentUniversity, setCurrentUniversity] = useState(null);
  const [universityToDelete, setUniversityToDelete] = useState(null);

  const fetchUniversities = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await UniversityService.fetchUniversities();
      setUniversities(data);
    } catch (err) {
      setError("Failed to fetch universities. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const openDeleteModal = (university) => {
    setUniversityToDelete(university);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    console.log("Deleting university with ID:", universityToDelete._id); // Debugging step
    setLoading(true);
    try {
      await UniversityService.deleteUniversity(universityToDelete._id);
      toast.success("University deleted successfully");
      fetchUniversities(); // Refresh list after successful delete
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete university. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("email", formData.email);
    data.append("phone", formData.phone);

    if (formData.image) {
      data.append("image", formData.image.file);
    }

    try {
      if (currentUniversity) {
        await UniversityService.editUniversity(currentUniversity._id, data);
        toast.success("University updated successfully");
      } else {
        await UniversityService.createUniversity(data);
        toast.success("University created successfully");
      }
      fetchUniversities();
      setModalOpen(false);
      resetCurrentUniversity();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to save university. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetCurrentUniversity = () => {
    setCurrentUniversity(null);
  };

  return (
    <div className="container mx-auto p-6">
      <RepeatParagraph>
        <h1 className="text-2xl sm:text-3xl mb-4">Universities List</h1>
      </RepeatParagraph>

      {loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700 text-xs">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  Admin Name
                </th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mb-4">{error}</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {universities.length > 0 ? (
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {universities.map((university) => (
                  <tr key={university._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {university.name || "N/A"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {university.address || "N/A"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <PrimaryButton
                        onClick={() => openDeleteModal(university)}
                        className="mr-2"
                      >
                        Delete
                      </PrimaryButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No universities available at the moment.
            </div>
          )}
        </div>
      )}

      <UniversityModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        currentUniversity={currentUniversity}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Universities;
