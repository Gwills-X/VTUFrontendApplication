const categories = [
  { id: 1, name: "Data share" },
  { id: 2, name: "GIFTING" },
  { id: 3, name: "MTN AWOOF" },
];

const DataCategoryTabs = ({ selected, onChange }) => {
  return (
    <div className='flex gap-4 border-b pb-3'>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-4 py-2 rounded-lg ${
            selected === cat.id ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}>
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default DataCategoryTabs;
