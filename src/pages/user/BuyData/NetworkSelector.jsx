import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const networks = [
  { id: 1, name: "MTN", color: "bg-[#FFCC00]", text: "text-black" },
  { id: 2, name: "Airtel", color: "bg-[#E30613]", text: "text-white" },
  { id: 3, name: "Glo", color: "bg-[#28A745]", text: "text-white" },
  { id: 4, name: "9mobile", color: "bg-[#003831]", text: "text-white" },
];

const NetworkSelector = ({ onSelect, selectedId }) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      {networks.map((net) => (
        <motion.div
          key={net.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(net.id)}
          className={`${net.color} relative h-24 rounded-[2rem] cursor-pointer shadow-sm flex items-center justify-center overflow-hidden transition-all ${
            selectedId === net.id
              ? "ring-4 ring-offset-2 ring-slate-900"
              : "opacity-80 hover:opacity-100"
          }`}>
          <span className={`text-lg font-black tracking-tighter ${net.text}`}>
            {net.name}
          </span>
          {selectedId === net.id && (
            <CheckCircle2
              className={`absolute top-3 right-3 ${net.text}`}
              size={18}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default NetworkSelector;
