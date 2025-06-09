'use client';
import { useEffect, useState } from 'react';
import { VStack, Heading, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { apiRequest } from '@/lib/api';
import OrderCard from '@/components/OrderList';

interface OrderItemDTO {
  productName: string;
  quantity: number;
  price: number;
}

interface FarmOrderDTO {
  id: number;
  farmId: number;
  farmName: string;
  orderStatus: string;
  deliveryTime: string;
  items: OrderItemDTO[];
}

interface OrderDTO {
  id: number;
  totalAmount: number;
  orderStatus: string;
  estimatedDeliveryTime: string;
  farmOrders: FarmOrderDTO[];
}

export default function ConsumerOrdersPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/orders/consumer')
      .then(setOrders)
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner mt={10} size="xl" />;
  if (error)
    return (
      <Alert status="error" mt={5}>
        <AlertIcon />
        {error}
      </Alert>
    );

  return (
    <VStack spacing={6} align="stretch" p={5}>
      <Heading size="lg">My Orders</Heading>
      {orders.map((order) => (
        <OrderCard key={order.id} type="CONSUMER" order={order} />
      ))}
    </VStack>
  );
}
