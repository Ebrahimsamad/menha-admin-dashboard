const PrimaryButton = ({ children ,onClick}) => {
  return (
    <button onClick={onClick} className="bg-[#B92A3B] hover:bg-[#002b4c] text-white font-bold py-2 px-4 rounded-full transition duration-300">
      {children}
    </button>
  );
};

export default PrimaryButton;
