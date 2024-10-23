const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
    </td>
  </tr>
);

export default SkeletonRow;
