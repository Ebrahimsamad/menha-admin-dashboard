function BlueButton({ children, width = "" }) {
  return (
    <button
      type="submit"
      className={`mt-8 ${width} px-6 py-3 bg-[#003a65] text-white font-semibold rounded-lg hover:bg-[#a32233] transition duration-300`}
    >
      {children}
    </button>
  );
}

export default BlueButton;
