import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../api/api";

const DataCategoryTabs = ({ networkId, selected, onChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailableCategories = async () => {
      if (!networkId) return;

      try {
        setLoading(true);
        // We call the User DataPlanController index
        // It returns plans filtered by network
        const res = await api.get(`/user/dataplans?network=${networkId}`);
        const plans = res.data;

        // Extract unique categories from the plans
        // We use a Map to keep unique PlanCategory objects by their ID
        const uniqueCategories = Array.from(
          new Map(
            plans.map((plan) => [plan.category.id, plan.category]),
          ).values(),
        );

        setCategories(uniqueCategories);

        // Auto-select the first category if nothing is selected or
        // if the previous selection isn't in the new list
        if (uniqueCategories.length > 0) {
          const isSelectedStillValid = uniqueCategories.find(
            (c) => c.id === selected,
          );
          if (!isSelectedStillValid) {
            onChange(uniqueCategories[0].id);
          }
        } else {
          onChange(null);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableCategories();
  }, [networkId]); // Refetch only when the network changes

  if (loading) {
    return (
      <div className='flex gap-2 animate-pulse'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='h-10 w-24 bg-slate-200 rounded-full' />
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className='flex p-1.5 bg-slate-100 rounded-[2rem] w-full max-w-md mx-auto md:mx-0 overflow-x-auto no-scrollbar'>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className='relative flex-1 min-w-[100px] py-3 text-[10px] font-black uppercase tracking-widest transition-colors z-10'>
          <span
            className={selected === cat.id ? "text-white" : "text-slate-400"}>
            {cat.name}
          </span>
          {selected === cat.id && (
            <motion.div
              layoutId='activeTab'
              className='absolute inset-0 bg-slate-900 rounded-[1.8rem] -z-10'
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default DataCategoryTabs;
