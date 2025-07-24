'use client';
import { useState } from 'react';
import NavBar from '../app/components/NavBar';

export default function Home() {
  const isAdmin = true;

  const [currency, setCurrency] = useState('KES');

  const conversionRate = 150; // 1 USD = 150 KES

  const products = [
    { id: 1, name: 'Product A', price: 200, discount: true, unitsSold: 120, stock: 3, expiresSoon: false, image: 'https://placehold.co/600x400' },
    { id: 2, name: 'Product B', price: 500, discount: false, unitsSold: 60, stock: 10, expiresSoon: true, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product C', price: 150, discount: true, unitsSold: 20, stock: 2, expiresSoon: false, image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Product D', price: 300, discount: false, unitsSold: 55, stock: 8, expiresSoon: false, image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Product E', price: 100, discount: true, unitsSold: 70, stock: 1, expiresSoon: true, image: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Product F', price: 250, discount: false, unitsSold: 30, stock: 6, expiresSoon: false, image: 'https://via.placeholder.com/150' },
    { id: 7, name: 'Product G', price: 180, discount: true, unitsSold: 85, stock: 4, expiresSoon: false, image: 'https://via.placeholder.com/150' },
    { id: 8, name: 'Product H', price: 400, discount: false, unitsSold: 95, stock: 9, expiresSoon: true, image: 'https://via.placeholder.com/150' },
    { id: 9, name: 'Product I', price: 220, discount: true, unitsSold: 40, stock: 3, expiresSoon: false, image: 'https://via.placeholder.com/150' },
    { id: 10, name: 'Product J', price: 350, discount: false, unitsSold: 110, stock: 2, expiresSoon: true, image: 'https://via.placeholder.com/150' },
  ];

  const formatPrice = (price) => {
    if (currency === 'USD') {
      return `$ ${(price / conversionRate).toFixed(2)}`;
    }
    return `KSh ${price}`;
  };

  return (
    <>
      <NavBar />
      <main className="pt-24 px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold"></h1>
          <div>
            <label className="mr-2 text-gray-600">currency:</label>
            <select
              className="border px-2 py-1 rounded"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="KES">KES</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Featured Products</h2>
          <ul className="grid grid-cols-2 gap-4">
            {products.filter(p => p.discount).map(product => (
              <li key={product.id} className="bg-white p-4 rounded shadow">
                <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Fast Selling Products</h2>
          <ul className="grid grid-cols-2 gap-4">
            {products.filter(p => p.unitsSold > 50).map(product => (
              <li key={product.id} className="bg-white p-4 rounded shadow">
                <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                <p className="text-xs text-gray-500">{product.unitsSold} units sold</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Smart Stock Alerts</h2>
          <ul className="list-disc ml-6 text-sm text-red-600">
            {products.filter(p => p.stock < 5).map(product => (
              <li key={product.id}>
                {product.name} - only {product.stock} left
              </li>
            ))}
          </ul>
        </section>

        {isAdmin && (
          <section>
            <h2 className="text-xl font-semibold mb-3">Expiring Soon</h2>
            <ul className="list-disc ml-6 text-sm text-orange-500">
              {products.filter(p => p.expiresSoon).map(product => (
                <li key={product.id}>
                  {product.name} - expiring soon
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
