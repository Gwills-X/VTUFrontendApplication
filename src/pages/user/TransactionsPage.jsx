import { useEffect, useState } from "react";
import api from "../../api/api";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [message, setMessage] = useState({
    response: "",
    color: "",
  });
  const [showMessage, setShowMessage] = useState(false);

  async function fetchTransactions(page = 1) {
    setLoading(true);

    try {
      const res = await api(`/user/transactions?page=${page}`);

      const data = res.data.data;

      setTransactions(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    setTimeout(() => {
      fetchTransactions();
    }, 1);
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div className='max-w-4xl mx-auto p-4'>
      {showMessage && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div
            className={`text-${message.color}-500 bg-white p-4 rounded-[15px]`}>
            {message.response}
          </div>
        </div>
      )}

      <h2 className='text-2xl font-bold mb-4'>My Transactions</h2>

      {transactions.length === 0 && <p>No transactions found.</p>}

      <div className='space-y-4'>
        {transactions.map((tx) => {
          const isExpanded = expandedIds.includes(tx.id);

          return (
            <div
              key={tx.id}
              className='border rounded-lg p-4 shadow-sm flex flex-col'>
              <div className='flex justify-between items-start'>
                <div>
                  <p className='font-semibold'>{tx.type.replace("_", " ")}</p>
                  <p>Amount: ₦{tx.amount}</p>

                  <p>
                    Status:{" "}
                    <span
                      className={`font-bold ${
                        tx.status === "success"
                          ? "text-green-600"
                          : tx.status === "failed"
                            ? "text-red-600"
                            : "text-yellow-600"
                      }`}>
                      {tx.status}
                    </span>
                  </p>
                </div>

                <div className='flex gap-2'>
                  <button
                    onClick={() => toggleExpand(tx.id)}
                    className='flex items-center gap-1 text-blue-600 hover:underline'>
                    {isExpanded ? "Read Less" : "Read More"}
                    {isExpanded ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className='mt-2 text-gray-700 space-y-1'>
                  <p>Phone Number: {tx.phone_number ?? "N/A"}</p>
                  <p>Reference: {tx.reference ?? "N/A"}</p>
                  <p>Created At: {new Date(tx.created_at).toLocaleString()}</p>
                  <p>Updated At: {new Date(tx.updated_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}

      <div className='flex justify-between mt-6'>
        <button
          disabled={currentPage === 1}
          onClick={() => fetchTransactions(currentPage - 1)}
          className='bg-gray-200 px-4 py-2 rounded disabled:opacity-50'>
          Previous
        </button>

        <span className='font-semibold'>
          Page {currentPage} of {lastPage}
        </span>

        <button
          disabled={currentPage === lastPage}
          onClick={() => fetchTransactions(currentPage + 1)}
          className='bg-gray-200 px-4 py-2 rounded disabled:opacity-50'>
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsPage;
