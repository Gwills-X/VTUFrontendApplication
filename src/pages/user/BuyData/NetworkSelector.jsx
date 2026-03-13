const networks = [
  { id: 1, name: "MTN", color: "bg-yellow-400" },
  { id: 2, name: "Airtel", color: "bg-red-500" },
  { id: 3, name: "Glo", color: "bg-green-600" },
  { id: 4, name: "9mobile", color: "bg-green-400" },
];

const NetworkSelector = ({ onSelect }) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
      {networks.map((net) => (
        <div
          key={net.id}
          onClick={() => onSelect(net.id)}
          className={`${net.color} rounded-2xl p-6 text-white shadow-xl cursor-pointer hover:scale-105 transition flex items-center justify-center`}>
          <span className='text-lg font-semibold'>{net.name}</span>
        </div>
      ))}
    </div>
  );
};

export default NetworkSelector;
