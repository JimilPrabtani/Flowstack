import apiClient from './api';
import { Product } from '../types';

const now = new Date().toISOString();

// Minimal demo catalog for Flowstack — generic, working products.
// Images intentionally omitted (no local assets) so UI uses CSS fallback.
export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    name: 'Wireless Headphones',
    description: 'Over-ear wireless headphones with noise cancellation and 30-hour battery.',
    price: 89.0,
    originalPrice: 119.0,
    discountPercentage: 25,
    imageUrl: '',
    category: 'Electronics',
    brand: 'Flowstack Basics',
    inventory: 24,
    rating: 4.6,
    reviewCount: 38,
    isNew: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-2',
    name: 'Cotton T-Shirt',
    description: 'Plain cotton t-shirt, comfortable regular fit. Multiple sizes.',
    price: 19.0,
    imageUrl: '',
    category: 'Clothing',
    brand: 'Flowstack Basics',
    inventory: 50,
    rating: 4.5,
    reviewCount: 120,
    isNew: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-3',
    name: 'Insulated Water Bottle',
    description: '750ml stainless steel insulated bottle, keeps drinks cold 24h.',
    price: 25.0,
    imageUrl: '',
    category: 'Home',
    brand: 'Flowstack Basics',
    inventory: 40,
    rating: 4.7,
    reviewCount: 64,
    isNew: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-4',
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and USB charging port.',
    price: 39.0,
    imageUrl: '',
    category: 'Home',
    brand: 'Flowstack Basics',
    inventory: 18,
    rating: 4.4,
    reviewCount: 22,
    isNew: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-5',
    name: 'Canvas Backpack',
    description: 'Durable canvas backpack with laptop sleeve and water bottle pocket.',
    price: 59.0,
    originalPrice: 75.0,
    discountPercentage: 21,
    imageUrl: '',
    category: 'Accessories',
    brand: 'Flowstack Basics',
    inventory: 30,
    rating: 4.6,
    reviewCount: 45,
    isNew: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-6',
    name: 'Running Sneakers',
    description: 'Lightweight running sneakers with cushioned sole for daily wear.',
    price: 79.0,
    imageUrl: '',
    category: 'Shoes',
    brand: 'Flowstack Basics',
    inventory: 28,
    rating: 4.5,
    reviewCount: 51,
    isNew: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-7',
    name: 'Ceramic Coffee Mug',
    description: '350ml ceramic mug, dishwasher and microwave safe.',
    price: 15.0,
    imageUrl: '',
    category: 'Home',
    brand: 'Flowstack Basics',
    inventory: 60,
    rating: 4.8,
    reviewCount: 89,
    isNew: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-8',
    name: 'Hardcover Notebook',
    description: 'A5 hardcover dotted notebook, 192 pages, lay-flat binding.',
    price: 18.0,
    imageUrl: '',
    category: 'Accessories',
    brand: 'Flowstack Basics',
    inventory: 35,
    rating: 4.7,
    reviewCount: 33,
    isNew: false,
    createdAt: now,
    updatedAt: now,
  },
];

const transformProduct = (product: any): Product => ({
  id: String(product.id),
  name: product.name,
  description: product.description,
  price: typeof product.price === 'number' ? product.price : parseFloat(product.price || '0'),
  originalPrice: product.compare_price || product.originalPrice ? parseFloat(product.compare_price || product.originalPrice) : undefined,
  imageUrl: product.image_url || product.imageUrl || '',
  category: product.category || product.category_id || 'General',
  brand: product.brand || 'Flowstack Basics',
  inventory: product.inventory_quantity ?? product.inventory ?? 10,
  rating: product.rating || 4.5,
  reviewCount: product.reviewCount || 10,
  isNew: Boolean(product.is_featured || product.new_arrival || product.isNew),
  discountPercentage: product.discountPercentage,
  createdAt: product.created_at || product.createdAt || now,
  updatedAt: product.updated_at || product.updatedAt || now,
});

export const productService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get('/products');
      const apiResponse = response.data;

      let fetched: Product[] = [];
      if (apiResponse.success && apiResponse.data?.products) {
        fetched = apiResponse.data.products.map(transformProduct);
      } else if (Array.isArray(apiResponse)) {
        fetched = apiResponse.map(transformProduct);
      } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
        fetched = apiResponse.data.map(transformProduct);
      }

      if (fetched.length > 0) {
        return fetched;
      }
      return DEMO_PRODUCTS;
    } catch {
      return DEMO_PRODUCTS;
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      const product = response.data.data || response.data;
      if (product && product.id) {
        return transformProduct(product);
      }
      throw new Error('Product not found in API');
    } catch (error: any) {
      const found = DEMO_PRODUCTS.find(p => String(p.id) === String(id));
      if (found) {
        return found;
      }
      throw error;
    }
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const all = await productService.getAll();
    return all.filter(p => p.category.toLowerCase() === category.toLowerCase());
  },

  search: async (query: string): Promise<Product[]> => {
    const all = await productService.getAll();
    const q = query.toLowerCase();
    return all.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  },
};
