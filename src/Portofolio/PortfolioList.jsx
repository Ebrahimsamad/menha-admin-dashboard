import React, { useEffect, useState } from "react";
import portfolioService from "../services/portfolioService";
import PortfolioDetail from "./PortfolioDetail";
import RepeatParagrah from "../ui/RepeatPara";
import SecondaryButton from "../ui/SecondaryButton";

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-300 rounded w-12"></div>
    </td>
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

const PortfolioList = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoading(true);
      try {
        const data = await portfolioService.getAllPortfolios();
        setPortfolios(data.portfolios);
      } catch (err) {
        setError(err.message || "An error occurred while fetching portfolios.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const filteredPortfolios = portfolios.filter((portfolio) => {
    if (filter === "accepted") return portfolio.isAccept;
    if (filter === "rejected") return portfolio.isReject;
    if (filter === "pending") return !portfolio.isAccept && !portfolio.isReject;
    return true;
  });

  const handleCardClick = (portfolioId) => {
    setSelectedPortfolioId(portfolioId);
  };

  const handleBackClick = () => {
    setSelectedPortfolioId(null);
  };

  const updatePortfolioStatus = (id, isAccept, isReject) => {
    setPortfolios((prevPortfolios) =>
      prevPortfolios.map((portfolio) =>
        portfolio._id === id ? { ...portfolio, isAccept, isReject } : portfolio
      )
    );
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {/* Header Section with Title and Back Button */}
      <div className="flex justify-between mb-4">
  <div className="flex-shrink-0">
    {selectedPortfolioId && (
      <SecondaryButton onClick={handleBackClick}>
        Back to List
      </SecondaryButton>
    )}
  </div>
  <div className="flex-grow text-center">
    <RepeatParagrah>
      <h1 className="text-3xl sm:text-6xl">
        Portfolios
      </h1>
    </RepeatParagrah>
  </div>
  <div className="flex-shrink-0 hidden sm:block">
  </div>
</div>


      {/* Filter Section */}
      {!selectedPortfolioId && (
        <div className="flex justify-end mb-6">
          <select
            className="py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      )}

      {/* Skeleton Loader */}
      {loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-100 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left text-gray-600">
                  Profile Image
                </th>
                <th className="py-3 px-4 border-b text-left text-gray-600">
                  User Name
                </th>
                <th className="py-3 px-4 border-b text-left text-gray-600">
                  Level Of Study
                </th>
                <th className="py-3 px-4 border-b text-left text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-semibold text-red-500">
            Error: 404 please check your network
          </p>
        </div>
      ) : (
        <>
          {!selectedPortfolioId ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-100 shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 border-b text-left text-gray-600">
                      Profile Image
                    </th>
                    <th className="py-3 px-4 border-b text-left text-gray-600">
                      User Name
                    </th>
                    <th className="py-3 px-4 border-b text-left text-gray-600">
                      Level Of Study
                    </th>
                    <th className="py-3 px-4 border-b text-left text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPortfolios.length > 0 ? (
                    filteredPortfolios.map((portfolio) => (
                      <tr
                        key={portfolio._id}
                        onClick={() => handleCardClick(portfolio._id)}
                        className="cursor-pointer hover:bg-gray-100 transition-all"
                      >
                        <td className="py-4 px-4 border-b">
                          <img
                            src={portfolio.userID.image}
                            className="w-12 h-12 object-fill rounded-full border border-gray-300"
                            alt="User"
                          />
                        </td>
                        <td className="py-4 px-4 border-b text-gray-600">
                          {portfolio.userID?.userName || "User"}
                        </td>
                        <td className="py-4 px-4 border-b text-gray-600">
                          {portfolio.levelOfStudy}
                        </td>
                        <td className="py-4 px-4 border-b text-gray-600">
                          {portfolio.isAccept ? (
                            <span className="text-green-600 font-semibold">
                              Accepted
                            </span>
                          ) : portfolio.isReject ? (
                            <span className="text-red-600 font-semibold">
                              Rejected
                            </span>
                          ) : (
                            <span className="text-yellow-500 font-semibold">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-4 px-4 text-center text-gray-600"
                      >
                        No portfolios available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <PortfolioDetail
              portfolio={portfolios.find((p) => p._id === selectedPortfolioId)}
              updatePortfolioStatus={updatePortfolioStatus}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PortfolioList;
