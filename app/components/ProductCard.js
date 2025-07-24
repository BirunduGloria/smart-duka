'use client';
import React, { useEffect, useState } from 'react';
import styles from './ProductCard.module.css';
export default function ProductCard({
  product,
  isAdmin,
  onAddToCart,
  onEdit,
  onDelete,
}) {

  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition relative">
      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
      <p className="text-sm mb-1">Category: {product.category}</p>
      <p className="mb-1">Price: ${product.price.toFixed(2)}</p>
      <p className="mb-1">Stock: {product.stock}</p>

      <div className="absolute top-2 right-2 flex flex-col gap-1">
  {product.stock <= 2 && (
    <span className="bg-yellow-300 text-xs px-2 py-1 rounded">
      Only 2 Left!
    </span>
  )}
  {product.stock < 15 && product.stock > 2 && (
    <span className="bg-orange-300 text-xs px-2 py-1 rounded">
      Expiring Soon
    </span>
  )}
  {product.discount > 0 && (
    <span className="bg-pink-300 text-xs px-2 py-1 rounded">
      On Offer
    </span>
  )}
  {product.unitsSold > 50 && (
    <span className="bg-red-300 text-xs px-2 py-1 rounded">
      Selling Fast
    </span>
  )}
</div>


      <button
        onClick={() => onAddToCart(product)}
        className="bg-blue-600 text-white px-3 py-1 rounded mt-2 w-full"
      >
        Add to Cart
      </button>

      {isAdmin && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onEdit(product)}
            className="bg-green-500 text-white px-3 py-1 rounded flex-grow"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="bg-red-600 text-white px-3 py-1 rounded flex-grow"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
