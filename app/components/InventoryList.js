'use client';

import inventoryData from '../data/products.json';

export default function InventoryTable() {
  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📦 Inventory Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ➕ List New Product
        </button>
      </div>

      <table className="w-full table-auto border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Product Name</th>
            <th className="border px-2 py-1">Category</th>
            <th className="border px-2 py-1">In Stock</th>
            <th className="border px-2 py-1">Sold</th>
            <th className="border px-2 py-1">Expiry</th>
            <th className="border px-2 py-1">Procure</th>
            <th className="border px-2 py-1">Edit Price</th>
            <th className="border px-2 py-1">Edit Category</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map(product => {
            const { id, name, category, pricing, inventory, expiryDate } = product;
            return (
              <tr key={id}>
                <td className="border px-2 py-1">{id}</td>
                <td className="border px-2 py-1">{name}</td>
                <td className="border px-2 py-1">{category}</td>
                <td className={`border px-2 py-1 ${inventory.unitsInStock <= 5 ? 'text-red-600' : ''}`}>
                  {inventory.unitsInStock}
                </td>
                <td className="border px-2 py-1">{inventory.unitsSold}</td>
                <td className="border px-2 py-1">{expiryDate || 'N/A'}</td>
                <td className="border px-2 py-1">
                  <button className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Add</button>
                </td>
                <td className="border px-2 py-1">
                  <button className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Add</button>
                </td>
                <td className="border px-2 py-1">
                  <button className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Add</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
