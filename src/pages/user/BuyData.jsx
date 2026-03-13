import { useState } from "react";

import NetworkSelector from "./BuyData/NetworkSelector";
import DataCategoryTabs from "./BuyData/DataCategoryTabs";
import PlanList from "./BuyData/PlanList";

const BuyData = () => {
  const [networkId, setNetworkId] = useState(null);
  const [category, setCategory] = useState(null);

  // When user selects a plan, we just open the purchase modal (handled inside PlanCard)
  const handlePlanSelect = (plan) => {
    // Nothing needed here, PlanCard will handle showing PurchaseModal
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-6xl mx-auto space-y-8'>
        <h1 className='text-3xl font-bold'>Buy Data</h1>

        <NetworkSelector onSelect={setNetworkId} />

        {networkId && (
          <>
            <DataCategoryTabs
              networkId={networkId}
              selected={category}
              onChange={setCategory}
            />

            {category && (
              <PlanList
                networkId={networkId}
                category={category}
                onSelectPlan={handlePlanSelect}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BuyData;
