import express from 'express';
import { query } from '../database/connection';
import { Product, ServiceResponse, PaginationParams } from '../types';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      page = '1',
      limit = '12',
      sortBy = 'created_at',
      category,
      search,
      minPrice,
      maxPrice
    } = req.query;

    const ALLOWED_SORT = new Set(['price', 'created_at', 'name']);
    const sortColumn = ALLOWED_SORT.has(String(sortBy)) ? String(sortBy) : 'created_at';

    const pageNum = Math.max(parseInt(page as string) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit as string) || 12, 1), 100);
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE 1=1';
    const filterParams: any[] = [];
    let paramIndex = 1;

    if (category) {
      whereClause += ' AND c.name = $' + paramIndex;
      filterParams.push(category);
      paramIndex++;
    }

    if (search) {
      whereClause += ' AND (p.name ILIKE $' + paramIndex + ' OR p.description ILIKE $' + (paramIndex + 1) + ')';
      filterParams.push(`%${search}%`, `%${search}%`);
      paramIndex += 2;
    }

    if (minPrice) {
      whereClause += ' AND p.price >= $' + paramIndex;
      filterParams.push(minPrice);
      paramIndex++;
    }

    if (maxPrice) {
      whereClause += ' AND p.price <= $' + paramIndex;
      filterParams.push(maxPrice);
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${whereClause}`;
    const productsQuery = `
      SELECT p.id, p.name, p.description, p.price, p.compare_price, 
             p.brand, p.inventory_quantity, p.is_featured, p.created_at, p.updated_at,
             COALESCE(c.name, 'Uncategorized') as category,
             '' as image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.${sortColumn}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const allParams = [...filterParams, limitNum, offset];

    const [countResult, productsResult] = await Promise.all([
      query(countQuery, filterParams),
      query(productsQuery, allParams)
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        products: productsResult.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          total,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, error: 'Failed to get products' });
  }
});

// NOTE: /categories must be defined BEFORE /:id, otherwise Express
// matches "categories" as an id and the category list is unreachable.
router.get('/categories', async (req, res) => {
  try {
    const result = await query(`
      SELECT c.*, COUNT(p.id) as product_count 
      FROM categories c 
      LEFT JOIN products p ON p.category_id = c.id 
      GROUP BY c.id, c.name, c.description, c.image_url
      ORDER BY c.name
    `);

    const response: ServiceResponse<any[]> = {
      success: true,
      data: result.rows
    };

    res.json(response);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, error: 'Failed to get categories' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT p.id, p.name, p.description, p.price, p.compare_price, 
             p.brand, p.inventory_quantity, p.is_featured, p.created_at, p.updated_at,
             COALESCE(c.name, 'Uncategorized') as category,
             '' as image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, error: 'Failed to get product' });
  }
});

export { router as productRoutes };
