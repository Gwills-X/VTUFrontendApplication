import { useEffect, useState } from "react";
import api from "../../api/api";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);
  const [message, setMessage] = useState({
    response: "",
    color: "",
  });
  const [showMessage, setShowMessage] = useState(false);

  async function fetchTransactions() {
    const res = await api("/user/transactions");
    console.log(res.data.data.data);
    setTimeout(() => {
      setTransactions(res.data.data.data);
    }, 100);
  }
  useEffect(() => {
    fetchTransactions();
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    try {
      const response = await api.delete(`/user/transactions/${id}`);

      // If successful
      getResponse(response.data.message, "green");

      // Remove from UI only if deletion actually succeeded
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (error) {
      // If backend returned validation/business error (like 400)
      if (error.response) {
        getResponse(
          error.response.data.message || "Action not allowed.",
          "red",
        );
      } else {
        getResponse("Something went wrong. Try again.", "red");
      }
    }
  };
  function getResponse(message, color) {
    setMessage({
      ...message,
      response: message,
      color: color,
    });
    setTimeout(() => {
      setShowMessage(true);
    }, 1);
  }
  setTimeout(() => {
    setShowMessage(false);
  }, 3000);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div className='max-w-4xl mx-auto p-4 '>
      {showMessage && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 '>
          <div
            className={`text-${message.color}-500 bg-white p-4 rounded-[15px]  `}>
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
                      className={`font-bold ${tx.status === "success" ? "text-green-600" : tx.status === "failed" ? "text-red-600" : "text-yellow-600"}`}>
                      {tx.status}
                    </span>
                  </p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => toggleExpand(tx.id)}
                    className='flex items-center gap-1 text-blue-600 hover:underline'>
                    {isExpanded ? "Read Less" : "Read More"}{" "}
                    {isExpanded ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className='text-red-600 hover:text-red-800'>
                    <X size={20} />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className='mt-2 text-gray-700 space-y-1'>
                  <p>Phone Number: {tx.phone_number ?? "N/A"}</p>
                  <p>Reference: {tx.reference ?? "N/A"}</p>
                  <p>Created At: {new Date(tx.created_at).toLocaleString()}</p>
                  <p>Updated At: {new Date(tx.updated_at).toLocaleString()}</p>
                  {/* Add any other fields you want */}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionsPage;
