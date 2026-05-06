import { useState } from "react";
import PurchaseModal from "./PurchaseModal";

const PlanCard = ({ plan }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className='bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition'>
        <h3 className='text-lg font-bold'>{plan.data}</h3>

        <p className='text-gray-600'>{plan.validity}</p>

        <p className='text-blue-600 font-semibold mt-2'>₦{plan.price}</p>
      </div>

      {open && <PurchaseModal plan={plan} onClose={() => setOpen(false)} />}
    </>
  );
};

export default PlanCard;
