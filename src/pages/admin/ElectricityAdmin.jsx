import React, { useEffect, useState } from "react";
import api from "../../api/api";

const ElectricityAdmin = () => {
  const [providers, setProviders] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const fetchProviders = async () => {
    const res = await api.get("admin/electricity");
    setTimeout(() => {
      setProviders(res.data.data);
    }, 1);
    console.log(res.data.data);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const createProvider = async (e) => {
    e.preventDefault();

    await api.post("admin/electricity", {
      name,
      code,
    });

    setName("");
    setCode("");
    fetchProviders();
  };

  const toggleProvider = async (id) => {
    await api.patch(`admin/electricity/${id}/toggle`);
    fetchProviders();
  };

  const deleteProvider = async (id) => {
    await api.delete(`admin/electricity/${id}`);
    fetchProviders();
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Electricity Providers</h1>

      {/* CREATE PROVIDER */}

      <form onSubmit={createProvider} className='flex gap-3 mb-8'>
        <input
          placeholder='Provider Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='border p-2'
        />

        <input
          placeholder='Provider Code'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className='border p-2'
        />

        <button className='bg-blue-500 text-white px-4'>Add</button>
      </form>

      {/* PROVIDERS TABLE */}

      <table className='w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='p-2'>ID</th>
            <th className='p-2'>Provider</th>
            <th className='p-2'>Code</th>
            <th className='p-2'>Status</th>
            <th className='p-2'>Actions</th>
          </tr>
        </thead>

        <tbody>
          {providers.map((p) => (
            <tr key={p.id}>
              <td className='border p-2'>{p.id}</td>

              <td className='border p-2'>{p.name}</td>

              <td className='border p-2'>{p.code}</td>

              <td className='border p-2'>{p.status ? "Active" : "Disabled"}</td>

              <td className='border p-2 flex gap-2'>
                <button
                  onClick={() => toggleProvider(p.id)}
                  className='bg-yellow-500 text-white px-2'>
                  Toggle
                </button>

                <button
                  onClick={() => deleteProvider(p.id)}
                  className='bg-red-500 text-white px-2'>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ElectricityAdmin;
