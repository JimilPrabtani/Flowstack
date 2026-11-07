import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Paper,
  Fade,
  Slide,
  Chip,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ShoppingBag as ShoppingBagIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/common/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home', 'Accessories', 'Shoes'];

const Home: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetched = await productService.getAll();
        setAllProducts(fetched);
        setDisplayedProducts(fetched.slice(0, 8));
      } catch (error) {
        setAllProducts([]);
        setDisplayedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      setDisplayedProducts(allProducts.slice(0, 8));
    } else {
      const filtered = allProducts.filter(
        p => p.category.toLowerCase() === cat.toLowerCase()
      );
      setDisplayedProducts(filtered.slice(0, 8));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          <LoadingSkeleton count={8} />
        </Box>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          color: '#111827',
          py: { xs: 5, md: 7 },
          borderRadius: '16px',
          mb: 4,
          border: '1px solid #E5E7EB',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Fade in timeout={500}>
                <Box>
                  <Box
                    sx={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#2563EB',
                      backgroundColor: '#EFF6FF',
                      display: 'inline-block',
                      px: 2,
                      py: 0.5,
                      borderRadius: '999px',
                      border: '1px solid #BFDBFE',
                      mb: 2,
                    }}
                  >
                    FLOWSTACK DEMO STORE
                  </Box>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '2rem', md: '2.75rem' } }}
                  >
                    Everyday essentials,
                    <Box component="span" sx={{ display: 'block', color: '#4B5563' }}>
                      one simple store.
                    </Box>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, color: '#6B7280', maxWidth: '44ch' }}>
                    Browse products, add to cart, register, login and place orders.
                    Built as a working microservices demo on Docker + Kubernetes + AWS.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ShoppingBagIcon sx={{ fontSize: '1.1rem' }} />}
                      href="#products-showcase"
                      sx={{
                        px: 3.5,
                        py: 1.25,
                        borderRadius: '12px',
                      }}
                    >
                      Browse Products
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: '1.1rem' }} />}
                      href="/products"
                      sx={{
                        px: 3.5,
                        py: 1.25,
                        borderRadius: '12px',
                      }}
                    >
                      All Collections
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Slide in timeout={500} direction="left">
                <Box
                  sx={{
                    backgroundColor: '#F3F4F6',
                    borderRadius: '16px',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    minHeight: 220,
                  }}
                >
                  <Typography variant="h2" sx={{ fontWeight: 700, textAlign: 'center', fontSize: { xs: '1.4rem', md: '1.8rem' } }}>
                    8 demo products
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: '#6B7280', textAlign: 'center' }}>
                    Cart, auth, orders and search all work end to end.
                  </Typography>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Prominent Featured Products Showcase Section (Right below Hero) */}
      <Box sx={{ py: 3, mb: 6 }} id="products-showcase">
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', mb: 3.5, gap: 2 }}>
            <Box>
              <Typography
                variant="h2"
                component="h2"
                sx={{ fontWeight: 700, color: '#FAF4E8', fontSize: '1.75rem', mb: 0.5 }}
              >
                Featured <Box component="span" sx={{ color: '#FF5B24' }}>Products</Box>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.88rem', color: 'rgba(250, 244, 232, 0.6)' }}>
                Handpicked boutique items available right now
              </Typography>
            </Box>

            {/* Interactive Category Filter Pills */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <Chip
                    key={cat}
                    label={cat}
                    clickable
                    onClick={() => handleCategorySelect(cat)}
                    sx={{
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 600 : 400,
                      px: 1,
                      backgroundColor: isSelected ? 'rgba(255, 91, 36, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#FF5B24' : 'rgba(250, 244, 232, 0.7)',
                      border: isSelected ? '1px solid rgba(255, 91, 36, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 200ms ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 91, 36, 0.18)',
                        color: '#FAF4E8',
                      },
                    }}
                  />
                );
              })}
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            {displayedProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                <ProductCard
                  product={product}
                  onAddToCart={addItem}
                />
              </Grid>
            ))}
          </Grid>

          {displayedProducts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body2" sx={{ color: 'rgba(250, 244, 232, 0.6)' }}>
                No products found in this category.
              </Typography>
            </Box>
          )}

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="medium"
              href="/products"
              endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem' }} />}
              sx={{
                px: 3.5,
                py: 1,
                borderRadius: '12px',
              }}
            >
              View Full Catalog ({allProducts.length} items)
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'rgba(28, 21, 40, 0.6)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  transition: 'transform 200ms ease, border-color 200ms ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: 'rgba(255, 91, 36, 0.3)',
                  },
                }}
              >
                <ShippingIcon sx={{ fontSize: 36, color: '#FFC24B', mb: 1.5 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '0.98rem' }}>
                  Free Shipping
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  On orders over $50
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'rgba(28, 21, 40, 0.6)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  transition: 'transform 200ms ease, border-color 200ms ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: 'rgba(255, 91, 36, 0.3)',
                  },
                }}
              >
                <SecurityIcon sx={{ fontSize: 36, color: '#2F9C95', mb: 1.5 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '0.98rem' }}>
                  Secure Payment
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  100% encrypted checkout
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'rgba(28, 21, 40, 0.6)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  transition: 'transform 200ms ease, border-color 200ms ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: 'rgba(255, 91, 36, 0.3)',
                  },
                }}
              >
                <StarIcon sx={{ fontSize: 36, color: '#E65F8E', mb: 1.5 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '0.98rem' }}>
                  Premium Quality
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  Biotech active formulas
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'rgba(28, 21, 40, 0.6)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  transition: 'transform 200ms ease, border-color 200ms ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: 'rgba(255, 91, 36, 0.3)',
                  },
                }}
              >
                <RefreshIcon sx={{ fontSize: 36, color: '#5EEAD4', mb: 1.5 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '0.98rem' }}>
                  Easy Returns
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  30-day return policy
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Home;