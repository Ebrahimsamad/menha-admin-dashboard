const SecondaryButton = ({ children }) => {
  return (
    <button className="bg-white text-[#002b4c] font-bold py-2 px-4 rounded-full border border-[#002b4c] hover:bg-[#B92A3B] hover:text-white transition duration-300">
      {children}
    </button>
  );
};

export default SecondaryButton;
