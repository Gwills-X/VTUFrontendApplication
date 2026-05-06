import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Layers, Zap, ArrowRight } from "lucide-react";

import NetworkSelector from "./BuyData/NetworkSelector";
import DataCategoryTabs from "./BuyData/DataCategoryTabs";
import PlanList from "./BuyData/PlanList";

const BuyData = () => {
  const [networkId, setNetworkId] = useState(null);
  const [category, setCategory] = useState(null);
  const [planNumber, setPlanNumber] = useState("");

  const handlePlanSelect = (plan) => {
    // Logic handled internally by PlanCard
  };

  return (
    <div className='min-h-screen bg-white md:bg-slate-50/50 p-4 md:p-10'>
      <div className='max-w-5xl mx-auto space-y-10'>
        {/* PAGE HEADER */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-black text-slate-900 tracking-tight'>
              Buy Data Bundle
            </h1>
            <p className='text-slate-500 font-medium mt-1 text-sm md:text-base'>
              Instant high-speed internet for all networks.
            </p>
          </div>
          <div className='hidden md:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100'>
            <Zap size={16} className='text-blue-600' fill='currentColor' />
            <span className='text-xs font-black text-blue-700 uppercase tracking-widest text-[10px]'>
              Instant Delivery
            </span>
          </div>
        </div>

        {/* STEP 1: NETWORK SELECTOR */}
        <section className='space-y-4'>
          <div className='flex items-center gap-3 ml-2'>
            <span className='flex items-center justify-center w-6 h-6 bg-slate-900 text-white text-[10px] font-black rounded-full'>
              1
            </span>
            <h2 className='text-xs font-black text-slate-400 uppercase tracking-widest'>
              Select Network Provider
            </h2>
          </div>
          <div className='bg-white p-2 md:p-6 rounded-[2.5rem] shadow-sm border border-slate-100'>
            <NetworkSelector
              onSelect={(id) => {
                setNetworkId(id);
                setCategory(null); // Reset category if network changes
              }}
            />
          </div>
        </section>

        {/* STEP 2 & 3: CATEGORY AND PLANS */}
        <AnimatePresence mode='wait'>
          {networkId ? (
            <motion.div
              key='data-selection'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='space-y-10'>
              {/* CATEGORY TABS */}
              <section className='space-y-4'>
                <div className='flex items-center gap-3 ml-2'>
                  <span className='flex items-center justify-center w-6 h-6 bg-slate-900 text-white text-[10px] font-black rounded-full'>
                    2
                  </span>
                  <h2 className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                    Choose Data Type
                  </h2>
                </div>
                <DataCategoryTabs
                  networkId={networkId}
                  selected={category}
                  onChange={setCategory}
                />
              </section>

              {/* PLAN LIST */}
              <AnimatePresence mode='wait'>
                {category && (
                  <motion.section
                    key='plan-list'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='space-y-4'>
                    <div className='flex items-center justify-between ml-2'>
                      <div className='flex items-center gap-3'>
                        <span className='flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-[10px] font-black rounded-full'>
                          3
                        </span>
                        <h2 className='text-xs font-black text-slate-400 uppercase tracking-widest'>
                          Select Your Preferred Plan
                        </h2>
                      </div>
                      <div className='hidden md:flex items-center gap-1 text-slate-400'>
                        <Layers size={14} />
                        <span className='text-[10px] font-bold uppercase tracking-tighter'>
                          {planNumber} Plans
                        </span>
                      </div>
                    </div>

                    <div className='bg-white p-4 md:p-8 rounded-[3rem] shadow-sm border border-slate-100'>
                      <PlanList
                        networkId={networkId}
                        category={category}
                        setPlanNumber={setPlanNumber}
                        onSelectPlan={handlePlanSelect}
                      />
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* EMPTY STATE */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='py-20 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200'>
              <div className='w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-300'>
                <Globe size={32} />
              </div>
              <div>
                <h3 className='text-slate-900 font-black tracking-tight'>
                  Waiting for selection
                </h3>
                <p className='text-slate-400 text-sm font-medium'>
                  Please pick a network above to view available data plans.
                </p>
              </div>
              <ArrowRight className='text-slate-200 animate-pulse' />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BuyData;
