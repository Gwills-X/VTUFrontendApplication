import { useEffect, useState } from "react";
import PlanCard from "./PlanCard";
import api from "../../../api/api";

const PlanList = ({ networkId, category }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);

        const res = await api.get("/user/dataplans", {
          params: {
            network: networkId,
            plan_category_id: category,
          },
        });

        setPlans(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Failed to fetch data plans", error);
      } finally {
        setLoading(false);
      }
    };

    if (networkId && category) {
      fetchPlans();
    }
  }, [networkId, category]);

  if (loading) {
    return (
      <div className='text-center text-gray-500 mt-6'>
        Loading data plans...
      </div>
    );
  }

  return (
    <div className='grid md:grid-cols-3 gap-6 mt-6'>
      {plans.length > 0 ? (
        plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            // onBuy={() => onSelectPlan(plan)}
          />
        ))
      ) : (
        <p className='col-span-full text-center text-gray-500'>
          No plans found.
        </p>
      )}
    </div>
  );
};

export default PlanList;
