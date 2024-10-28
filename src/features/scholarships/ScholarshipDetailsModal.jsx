import React, { useRef, useState, useEffect } from 'react';
import {
   
    FaUniversity,
    FaBookOpen,
    FaGlobe,
    FaLanguage,
    FaLayerGroup,
   
  } from "react-icons/fa";
const ChevronDownIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const ScholarshipDetailsModal = ({ isOpen, onClose, scholarship }) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const checkScroll = () => {
      const hasOverflow = content.scrollHeight > content.clientHeight;
      const isAtBottom = Math.abs(
        content.scrollHeight - content.clientHeight - content.scrollTop
      ) < 10;
      
      setShowScrollIndicator(hasOverflow && !isAtBottom);
    };

    checkScroll();
    content.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      content.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [scholarship]);

  if (!isOpen || !scholarship) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStringValue = (value) => {
    if (!value) return 'Not specified';
    if (typeof value === 'object' && value.name) return value.name;
    return String(value);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl w-full max-w-4xl my-4 overflow-hidden shadow-2xl transform transition-all relative">
        <div className="sticky top-0 bg-[#003a65] text-white px-4 sm:px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl sm:text-2xl font-semibold truncate pr-4">
            {getStringValue(scholarship.title)}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 flex-shrink-0"
            aria-label="Close modal"
          >
            <svg 
              viewBox="0 0 24 24" 
              width="24" 
              height="24" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="transform scale-75"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div 
          ref={contentRef}
          className="p-4 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto max-h-[calc(90vh-80px)] scroll-smooth"
        >
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-100 hover:border-[#003a65] transition-all duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <DetailItem 
                label="University" 
                value={getStringValue(scholarship.universityId)}
                icon={<FaUniversity />}
                tooltip="The institution offering this scholarship"
              />
              <DetailItem 
                label="Field of Study" 
                value={getStringValue(scholarship.fieldOfStudyId.fieldOfStudy)}
                icon={<FaGlobe />}
                tooltip="Academic discipline or area of study"
              />
              <DetailItem 
                label="Course Type" 
                value={getStringValue(scholarship.courseTypeId.courseType)}
                icon={<FaLayerGroup />}
                tooltip="Type of academic program"
              />
              <DetailItem 
                label="Mode of Study" 
                value={getStringValue(scholarship.modeOfStudyId.modeOfStudy)}
                icon={<FaBookOpen />}
                tooltip="How the course will be delivered"
              />
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <DetailCard 
              label="Duration" 
              value={getStringValue(scholarship.duration)} 
              icon="⏱️"
              tooltip="Length of the program"
            />
            <DetailCard 
              label="Country" 
              value={getStringValue(scholarship.country)} 
              icon="🌍"
              tooltip="Location of the institution"
            />
            <DetailCard 
              label="Language" 
              value={getStringValue(scholarship.languageId)} 
              icon={<FaLanguage />}
              tooltip="Primary language of instruction"
            />
          </div>

          {/* GPA Section */}
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-100 hover:border-blue-300 transition-all duration-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-medium text-blue-900">Required GPA</h3>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">
                  {getStringValue(scholarship.gpa)}
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 hover:border-[#003a65] transition-all duration-200">
            <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {getStringValue(scholarship.description)}
            </p>
          </div>
          
          {/* Tags Section */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Tag active={Boolean(scholarship.isWinter)} icon="❄️" tooltip="Available for winter semester">
              Winter Semester
            </Tag>
            <Tag active={Boolean(scholarship.isFree)} icon="💰" tooltip="No tuition fees required">
              Free Education
            </Tag>
            <Tag active={Boolean(scholarship.isFullTime)} icon="📅" tooltip="Full-time commitment required">
              Full Time
            </Tag>
          </div>
        </div>

        {/* Scroll Indicator */}
        {showScrollIndicator && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4 pointer-events-none">
            <div className="bg-[#003a65] text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm animate-bounce">
              <ChevronDownIcon />
              Scroll for more
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper components remain the same
const DetailItem = ({ label, value, icon, tooltip }) => (
  <div className="group cursor-help relative" title={tooltip}>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-lg">{icon}</span>
      <h3 className="font-medium text-gray-700 group-hover:text-[#003a65] transition-colors">
        {label}
      </h3>
    </div>
    <p className="text-gray-600 pl-7 group-hover:text-gray-900 transition-colors">
      {value}
    </p>
  </div>
);

const DetailCard = ({ label, value, icon, tooltip }) => (
  <div 
    className="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#003a65] transition-all duration-200 cursor-help"
    title={tooltip}
  >
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xl">{icon}</span>
      <h3 className="font-medium text-gray-700">{label}</h3>
    </div>
    <p className="text-gray-600 font-medium pl-7">{value}</p>
  </div>
);

const Tag = ({ active, children, icon, tooltip }) => (
  <span
    className={`px-3 sm:px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all duration-200 cursor-help
      ${active 
        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    title={tooltip}
  >
    <span>{icon}</span>
    {children}
  </span>
);

export default ScholarshipDetailsModal;