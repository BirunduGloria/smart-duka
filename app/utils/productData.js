// Utility functions to fetch product data from products.json

/**
 * Fetch all products from products.json
 */
export async function fetchProducts() {
  try {
    const response = await fetch('/data/products.json');
    if (!response.ok) {
      throw new Error('Failed to fetch products from products.json');
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch products with filtering options
 */
export async function fetchProductsWithFilter(filters = {}) {
  try {
    const products = await fetchProducts();
    
    let filteredProducts = products;
    
    // Filter by category
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    // Filter by price range
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        product.pricing.price >= filters.minPrice
      );
    }
    
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => 
        product.pricing.price <= filters.maxPrice
      );
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by stock level
    if (filters.lowStock) {
      filteredProducts = filteredProducts.filter(product => 
        product.inventory.unitsInStock < 10
      );
    }
    
    // Filter by expiry date
    if (filters.expiringSoon) {
      const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      filteredProducts = filteredProducts.filter(product => 
        product.expiryDate && new Date(product.expiryDate) < oneWeekFromNow
      );
    }
    
    return filteredProducts;
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    throw error;
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id) {
  try {
    const products = await fetchProducts();
    return products.find(product => product.id === id);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}

/**
 * Fetch products by category
 */
export async function fetchProductsByCategory(category) {
  try {
    const products = await fetchProducts();
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

/**
 * Get all available categories
 */
export async function fetchCategories() {
  try {
    const products = await fetchProducts();
    const categories = [...new Set(products.map(product => product.category))];
    return categories.sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Get product statistics
 */
export async function getProductStats() {
  try {
    const products = await fetchProducts();
    
    const stats = {
      totalProducts: products.length,
      categories: {},
      priceRange: { min: Infinity, max: -Infinity },
      totalStock: 0,
      lowStockItems: 0,
      expiringSoon: 0
    };
    
    products.forEach(product => {
      // Count by category
      if (!stats.categories[product.category]) {
        stats.categories[product.category] = 0;
      }
      stats.categories[product.category]++;
      
      // Price range
      if (product.pricing.price < stats.priceRange.min) {
        stats.priceRange.min = product.pricing.price;
      }
      if (product.pricing.price > stats.priceRange.max) {
        stats.priceRange.max = product.pricing.price;
      }
      
      // Total stock
      stats.totalStock += product.inventory.unitsInStock;
      
      // Low stock items
      if (product.inventory.unitsInStock < 10) {
        stats.lowStockItems++;
      }
      
      // Expiring soon
      if (product.expiryDate) {
        const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        if (new Date(product.expiryDate) < oneWeekFromNow) {
          stats.expiringSoon++;
        }
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting product stats:', error);
    throw error;
  }
}

/**
 * Search products by name or category
 */
export async function searchProducts(query) {
  try {
    const products = await fetchProducts();
    const searchTerm = query.toLowerCase();
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

/**
 * Get low stock products
 */
export async function getLowStockProducts() {
  try {
    const products = await fetchProducts();
    return products.filter(product => product.inventory.unitsInStock < 10);
  } catch (error) {
    console.error('Error getting low stock products:', error);
    throw error;
  }
}

/**
 * Get products expiring soon
 */
export async function getExpiringSoonProducts() {
  try {
    const products = await fetchProducts();
    const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    return products.filter(product => 
      product.expiryDate && new Date(product.expiryDate) < oneWeekFromNow
    );
  } catch (error) {
    console.error('Error getting expiring products:', error);
    throw error;
  }
}

/**
 * Get discounted products
 */
export async function getDiscountedProducts() {
  try {
    const products = await fetchProducts();
    return products.filter(product => product.pricing.discount > 0);
  } catch (error) {
    console.error('Error getting discounted products:', error);
    throw error;
  }
} 