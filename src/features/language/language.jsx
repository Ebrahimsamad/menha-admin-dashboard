import React, { useEffect, useState } from "react";
import { getAllLanguages, deleteLanguage } from "../../services/language";
import { FaTrashAlt } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { toast } from "react-hot-toast"; 
import Spinner from '../../ui/Spinner';

const Language = () => {
  const [languages, setLanguages] = useState([]);
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoading(true); 
      try {
        const data = await getAllLanguages();
        setLanguages(data);
      } catch (error) {
        console.error('Error fetching languages:', error);
        setError('Failed to load languages. Please try again.');
      } finally {
        setIsLoading(false); 
      }
    };

    fetchLanguages();
  }, []);

  const handleDeleteLanguage = async (id) => {
    const token = localStorage.getItem('token'); 
    setLoadingId(id); 
    try {
      await deleteLanguage(id, token);
      setLanguages(languages.filter(language => language._id !== id));
      toast.success('Language deleted successfully!'); 
    } catch (error) {
      console.error('Error deleting language:', error);
      toast.error('Failed to delete language. Please try again.');
    } finally {
      setLoadingId(null);

    }
    
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-10">
          <Spinner />
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Language Management</h1>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <ul className="space-y-4">
        {languages.map((language) => (
          <li key={language._id} className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{language.name}</h3>
              <div className="flex items-center mt-2">
                <IoBookOutline className="text-gray-600 mr-2" size={16} />
                {language.course.map((c, index) => (
                  <span key={index} className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded-full mr-2">{c}</span>
                ))}
              </div>
            </div>
            <button 
              onClick={() => handleDeleteLanguage(language._id)}
              className={`p-2 ${loadingId === language._id ? "text-gray-400" : "text-red-600"} hover:bg-red-100 rounded-full transition-colors duration-300`}
              disabled={loadingId === language._id} 
            >
              {loadingId === language._id ? "Deleting..." : <FaTrashAlt size={20} />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Language;
