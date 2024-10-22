import { Link } from "react-router-dom";
import PrimaryButton from './../../ui/PrimaryButton';

export default function Submitted() {
  return (
  <div className="bg-[#003A65] w-full max-w-[700px] rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mx-auto mt-6 lg:mt-10">
     
      <div className="bg-[#002A45] p-4 sm:p-6 rounded-t-lg text-center">
        <Link to="/dashboard">
          <img
            src="/public/logo.png"
            alt="Men7a Logo"
            className="h-12 sm:h-16 w-auto mx-auto mb-3 sm:mb-4 object-contain"
          />
        </Link>
        <p className="text-white text-lg sm:text-xl mt-2">Welcome to Our Service</p>
      </div>

    
      <div className="bg-white p-4 sm:p-6 rounded-b-lg text-[#b92a3b] text-center">
        <h4 className="mb-3 lg:mb-8 md:mb-4 sm:mb-4 font-semibold text-2xl sm:text-3xl md:text-4xl">
          Your Scholarship is added.
        </h4>
      
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/scholarship">
            <PrimaryButton className="btn btn-primary bg-yellow-400 text-[#003a65] hover:bg-yellow-300">
              VIEW SCHOLARSHIPS
            </PrimaryButton>
          </Link>

          <Link to="/addscholarship">
            <PrimaryButton className="btn btn-primary bg-yellow-400 text-[#003a65] hover:bg-yellow-300">
              Add New Scholarship
            </PrimaryButton>
          </Link>
        </div>
         
      </div>
    </div>
  );
}
