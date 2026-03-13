import { useEffect, useState } from "react";
import api from "../../api/api";

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchUserId, setSearchUserId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  /*
  |--------------------------------------------------------------------------
  | Fetch Transactions
  |--------------------------------------------------------------------------
  */

  const fetchTransactions = async (page = 1) => {
    setLoading(true);

    try {
      const res = await api.get(`admin/transactions?page=${page}`);

      const response = res.data.data;

      setTransactions(response.data);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Fetch Transactions by User
  |--------------------------------------------------------------------------
  */

  const fetchTransactionsByUser = async (userId) => {
    if (!userId) return fetchTransactions(1);

    setLoading(true);

    try {
      const res = await api.get(`admin/transactions/user/${Number(userId)}`);

      setTransactions(res.data.data.transactions || []);
      setLastPage(1);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to fetch user transactions", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Approve / Reject
  |--------------------------------------------------------------------------
  */

  const changeTransactionStatus = async (id, status) => {
    try {
      await api.put(`admin/transactions/${id}/status`, { status });

      fetchTransactions(currentPage);
    } catch (err) {
      console.error("Failed to update transaction status", err);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const goToNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Manage Transactions</h1>

      {/* Search */}
      <div className='mb-4 flex items-center gap-2'>
        <input
          type='number'
          placeholder='Search by User ID'
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
          className='border p-2 rounded w-64'
        />

        <button
          onClick={() => fetchTransactionsByUser(searchUserId)}
          className='px-3 py-2 bg-blue-600 text-white rounded'>
          Search
        </button>

        <button
          onClick={() => {
            setSearchUserId("");
            fetchTransactions(1);
          }}
          className='px-3 py-2 bg-gray-300 rounded'>
          Reset
        </button>
      </div>

      {/* Table */}
      <div className='overflow-x-auto bg-white shadow rounded-2xl'>
        <table className='min-w-full text-sm text-left'>
          <thead className='bg-gray-100 text-gray-600 uppercase text-xs'>
            <tr>
              <th className='px-6 py-4'>ID</th>
              <th className='px-6 py-4'>User ID</th>
              <th className='px-6 py-4'>Amount</th>
              <th className='px-6 py-4'>Status</th>
              <th className='px-6 py-4'>Date</th>
              <th className='px-6 py-4'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {!loading && transactions.length !== 0 ? (
              transactions.map((txn) => (
                <tr key={txn.id} className='border-t'>
                  <td className='px-6 py-4'>{txn.id}</td>
                  <td className='px-6 py-4'>{txn.user_id}</td>
                  <td className='px-6 py-4'>₦{txn.amount}</td>

                  <td className='px-6 py-4'>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        txn.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : txn.status === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                      }`}>
                      {txn.status}
                    </span>
                  </td>

                  <td className='px-6 py-4'>{txn.created_at}</td>

                  <td className='px-6 py-4 flex gap-2'>
                    {txn.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            changeTransactionStatus(txn.id, "success")
                          }
                          className='px-2 py-1 bg-green-600 text-white rounded text-xs'>
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            changeTransactionStatus(txn.id, "failed")
                          }
                          className='px-2 py-1 bg-red-600 text-white rounded text-xs'>
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : !loading && transactions.length === 0 ? (
              <tr>
                <td className='px-6 py-4'>No transactions...</td>
              </tr>
            ) : (
              <tr>
                <td className='px-6 py-4'>Loading transactions...</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className='flex justify-between items-center p-4'>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className='px-3 py-1 bg-gray-200 rounded disabled:opacity-50'>
            Previous
          </button>

          <span className='text-sm'>
            Page {currentPage} of {lastPage}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === lastPage}
            className='px-3 py-1 bg-gray-200 rounded disabled:opacity-50'>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageTransactions;
