import React, { useEffect, useState, useCallback } from "react";
import { getAllCourseTypes, deleteCourseTypeById } from "../../services/courseservice";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-hot-toast"; 
import Spinner from '../../ui/Spinner';
import RepeatParagraph from "../../ui/RepeatPara";

const CourseType = () => {
  const [courseTypes, setCourseTypes] = useState([]);
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const fetchCourseTypes = async () => {
      setIsLoading(true); 
      try {
        const data = await getAllCourseTypes(); 
        setCourseTypes(data);
      } catch (error) {
        console.error('Error fetching course types:', error);
        setError('Failed to load course types. Please try again.');
      } finally {
        setIsLoading(false); 
      }
    };

    fetchCourseTypes();
  }, []);

  const handleDeleteCourseType = useCallback((id) => {
    setConfirmDeleteId(id);
  }, []);

  const deleteConfirmed = async (id) => {
    const token = localStorage.getItem('token'); 
    setLoadingId(id); 
    try {
      await deleteCourseTypeById(id, token); 
      setCourseTypes(prevTypes => prevTypes.filter(type => type._id !== id));
      toast.success('Course type deleted successfully!'); 
    } catch (error) {
      console.error('Error deleting course type:', error);
      toast.error('Failed to delete course type. Please try again.');
    } finally {
      setConfirmDeleteId(null);
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-10">
          <Spinner />
        </div>
      )}
      <RepeatParagraph>
        <h1 className="text-4xl font-bold mb-6 text-center">Course Type Management</h1>
      </RepeatParagraph>
      
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      
      {confirmDeleteId && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
          <p>Are you sure you want to delete this course type?</p>
          <button onClick={() => deleteConfirmed(confirmDeleteId)} className="text-red-600 hover:bg-red-100 rounded-full p-2">Yes</button>
          <button onClick={() => setConfirmDeleteId(null)} className="text-gray-600 hover:bg-gray-100 rounded-full p-2">No</button>
        </div>
      )}
      
      {courseTypes.length === 0 ? (
        <p className="text-gray-600 text-center">No course types available.</p>
      ) : (
        <ul className="space-y-4">
          {courseTypes.map((type) => (
            <li key={type._id} className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-center transition-transform transform hover:scale-105 hover:shadow-xl">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">{type.courseType}</h3>
              </div>
              <button 
                onClick={() => handleDeleteCourseType(type._id)}
                className={`p-2 transition-colors duration-300 ${loadingId === type._id ? "text-gray-400" : "text-red-600 hover:bg-red-100 rounded-full hover:shadow-md"}`}
                disabled={loadingId === type._id} 
              >
                {loadingId === type._id ? "Deleting..." : <FaTrashAlt size={20} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseType;
