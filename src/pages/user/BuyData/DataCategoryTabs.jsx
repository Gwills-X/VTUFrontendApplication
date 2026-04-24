import { motion } from "framer-motion";

const categories = [
  { id: 1, name: "Data Share" },
  { id: 2, name: "Gifting" },
  { id: 3, name: "SME Plans" },
];

const DataCategoryTabs = ({ selected, onChange }) => {
  return (
    <div className='flex p-1.5 bg-slate-100 rounded-[2rem] w-full max-w-md mx-auto md:mx-0'>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className='relative flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors z-10'>
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
