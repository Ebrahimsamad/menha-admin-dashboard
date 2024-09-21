import React, { useEffect, useState } from "react";
import { getAllFieldOfStudy, deleteFieldOfStudy } from "../../services/fieldofstudyservice"; 
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-hot-toast"; 
import Spinner from '../../ui/Spinner';
import RepeatParagrah from "../../ui/RepeatPara";

const FieldOfStudy = () => {
  const [fieldsOfStudy, setFieldsOfStudy] = useState([]);
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const fetchFieldsOfStudy = async () => {
      setIsLoading(true); 
      try {
        const data = await getAllFieldOfStudy();
        setFieldsOfStudy(data);
      } catch (error) {
        console.error('Error fetching fields of study:', error);
        setError('Failed to load fields of study. Please try again.');
      } finally {
        setIsLoading(false); 
      }
    };

    fetchFieldsOfStudy();
  }, []);

  const handleDeleteFieldOfStudy = async (id) => {
    const token = localStorage.getItem('token'); 
    setLoadingId(id); 
    try {
      await deleteFieldOfStudy(id, token);
      setFieldsOfStudy(fieldsOfStudy.filter(field => field._id !== id));
      toast.success('Field of study deleted successfully!'); 
    } catch (error) {
      console.error('Error deleting field of study:', error);
      toast.error('Failed to delete field of study. Please try again.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-100 rounded-lg shadow-lg relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-10">
          <Spinner />
        </div>
      )}
      <RepeatParagrah>
        <h1 className="text-4xl font-bold mb-6 text-center">Field of Study Management</h1>
      </RepeatParagrah>
      
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      
      <ul className="space-y-4">
        {fieldsOfStudy.map((field) => (
          <li key={field._id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="flex-grow mb-2 md:mb-0">
              <h3 className="text-2xl font-semibold text-gray-800">{field.fieldOfStudy}</h3>
            </div>
            <button 
              onClick={() => handleDeleteFieldOfStudy(field._id)}
              className={`p-2 transition-colors duration-300 ${loadingId === field._id ? "text-gray-400" : "text-red-600 hover:bg-red-100 rounded-full hover:shadow-md"}`}
              disabled={loadingId === field._id} 
            >
              {loadingId === field._id ? "Deleting..." : <FaTrashAlt size={20} />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FieldOfStudy;
