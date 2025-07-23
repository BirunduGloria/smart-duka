import NavBar from '../app/components/NavBar';

export default function Home() {
  const isAdmin = true;

  const products = [
    { id: 1, name: 'Product A', price: 200, discount: true, unitsSold: 120, stock: 3, expiresSoon: false },
    { id: 2, name: 'Product B', price: 500, discount: false, unitsSold: 60, stock: 10, expiresSoon: true },
    { id: 3, name: 'Product C', price: 150, discount: true, unitsSold: 20, stock: 2, expiresSoon: false },
    { id: 4, name: 'Product D', price: 300, discount: false, unitsSold: 55, stock: 8, expiresSoon: false },
  ];

  return (
    <>
      <NavBar />
      <main className="pt-24 px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">smart pos</h1>
          <div>
            <label className="mr-2 text-gray-600">currency:</label>
            <select className="border px-2 py-1 rounded" disabled>
              <option>kes</option>
            </select>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">featured products</h2>
          <ul className="grid grid-cols-2 gap-4">
            {products.filter(p => p.discount).map(product => (
              <li key={product.id} className="bg-white p-4 rounded shadow">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">KSh {product.price}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">fast selling products</h2>
          <ul className="grid grid-cols-2 gap-4">
            {products.filter(p => p.unitsSold > 50).map(product => (
              <li key={product.id} className="bg-white p-4 rounded shadow">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">KSh {product.price}</p>
                <p className="text-xs text-gray-500">{product.unitsSold} units sold</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">smart stock alerts</h2>
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
            <h2 className="text-xl font-semibold mb-3">expiring soon</h2>
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
