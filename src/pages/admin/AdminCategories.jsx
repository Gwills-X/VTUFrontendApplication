import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { Plus, Network, Layers, RefreshCw, Check, X } from "lucide-react";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/plan-categories/all");

      // 🔥 Ensure correct structure
      setCategories(res.data.data || []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async () => {
    if (!network || !categoryName) return toast.error("Fill all fields");

    try {
      await api.post("/admin/network-plan-categories", {
        network,
        plan_category_name: categoryName,
      });

      toast.success("Category created!");
      setNetwork("");
      setCategoryName("");
      fetchCategories();
    } catch {
      toast.error("Failed to create category");
    }
  };

  // ✅ TOGGLE MAIN CATEGORY
  const toggleMain = async (id) => {
    try {
      await api.post(`/admin/plan-categories/${id}/toggle`);
      toast.success("Category updated");
      fetchCategories();
    } catch {
      toast.error("Failed to update category");
    }
  };

  // ✅ TOGGLE NETWORK CATEGORY
  const toggleNetwork = async (id) => {
    try {
      await api.post(`/admin/network-plan-categories/${id}/toggle`);
      toast.success("Network category updated");
      fetchCategories();
    } catch {
      toast.error("Failed to update network category");
    }
  };

  // Modern Toggle Switch Component
  const ToggleSwitch = ({ isOn, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        isOn ? "bg-blue-600" : "bg-gray-300"
      }`}>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isOn ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className='p-4 md:p-8 bg-slate-50 min-h-screen font-sans'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-black text-slate-800 tracking-tight'>
              Plan Categories
            </h1>
            <p className='text-slate-500'>
              Manage network data types and visibility
            </p>
          </div>
          <button
            onClick={fetchCategories}
            className='p-2 text-slate-400 hover:text-blue-600 transition-colors'>
            <RefreshCw size={22} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* CREATE SECTION CARD */}
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10'>
          <div className='flex items-center gap-2 mb-4 text-blue-600 font-bold text-sm uppercase tracking-wider'>
            <Plus size={18} /> Add New Category
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <input
                type='text'
                placeholder='Network (e.g MTN)'
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className='w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition'
              />
            </div>
            <div className='flex-1'>
              <input
                type='text'
                placeholder='Category (e.g Gifting)'
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className='w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition'
              />
            </div>
            <button
              onClick={createCategory}
              className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2'>
              <Plus size={20} /> Create
            </button>
          </div>
        </div>

        {/* LIST SECTION */}
        {loading && categories.length === 0 ? (
          <div className='text-center py-20 text-slate-400 font-medium'>
            Loading amazing categories...
          </div>
        ) : (
          <div className='grid gap-8'>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className='bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden'>
                {/* HEADER */}
                <div className='bg-slate-50/50 px-6 py-4 flex justify-between items-center border-b border-slate-100'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-blue-100 p-2 rounded-lg text-blue-600'>
                      <Layers size={20} />
                    </div>
                    <h2 className='text-lg font-black text-slate-800 uppercase tracking-tight'>
                      {cat.name}
                    </h2>
                  </div>

                  <div className='flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-slate-200'>
                    <span
                      className={`text-[10px] font-black uppercase ${
                        cat.active ? "text-green-600" : "text-slate-400"
                      }`}>
                      {cat.active ? "Active" : "Disabled"}
                    </span>
                    <ToggleSwitch
                      isOn={cat.active}
                      onToggle={() => toggleMain(cat.id)}
                    />
                  </div>
                </div>

                {/* NETWORKS */}
                <div className='p-6'>
                  <p className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-4'>
                    Linked Networks
                  </p>

                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {(cat.network_categories || []).map((net) => (
                      <div
                        key={net.id}
                        className={`p-4 rounded-2xl border transition-all flex justify-between items-center ${
                          net.active
                            ? "border-blue-100 bg-blue-50/30"
                            : "border-slate-100 bg-white opacity-60"
                        }`}>
                        <div className='flex items-center gap-3'>
                          <Network
                            size={16}
                            className={
                              net.active ? "text-blue-500" : "text-slate-400"
                            }
                          />
                          <span className='font-bold text-slate-700'>
                            {net.name}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleNetwork(net.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                            net.active
                              ? "bg-green-500 text-white shadow-md"
                              : "bg-slate-200 text-slate-500"
                          }`}>
                          {net.active ? <Check size={16} /> : <X size={16} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
