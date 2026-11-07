import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Alert, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [street, setStreet] = useState('123 Main St');
  const [city, setCity] = useState('New York');
  const [zipCode, setZipCode] = useState('10001');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const shipping = total > 50 ? 0 : 5;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      await orderService.createOrder({
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
        shippingAddress: { street, city, zipCode, country: 'USA' },
      });
      clearCart();
      navigate('/orders');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>Checkout</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {items.length} items · Total ${finalTotal.toFixed(2)} (incl. shipping + tax)
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handlePlaceOrder}>
            <TextField fullWidth required label="Street" value={street} onChange={e => setStreet(e.target.value)} margin="normal" />
            <TextField fullWidth required label="City" value={city} onChange={e => setCity(e.target.value)} margin="normal" />
            <TextField fullWidth required label="ZIP code" value={zipCode} onChange={e => setZipCode(e.target.value)} margin="normal" />
            <Button type="submit" variant="contained" fullWidth disabled={placing} sx={{ mt: 2 }}>
              {placing ? 'Placing order…' : `Place order · $${finalTotal.toFixed(2)}`}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Checkout;
