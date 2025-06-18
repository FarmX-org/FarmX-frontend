'use client';

import { useEffect, useState } from 'react';
import {
  VStack,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  Box,
  Button,
} from '@chakra-ui/react';
import { apiRequest } from '@/lib/api';
import OrderCard from '@/components/OrderList';
import FarmFeedbackSection from '@/components/FarmFeedbackSection';
import { MdRateReview } from 'react-icons/md';

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
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);


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
      <Heading size="lg" textAlign="center">
        My Orders
      </Heading>

      {orders.map((order) => (
        <Box key={order.id} borderWidth={1} borderRadius="lg" p={4}>
          <OrderCard type="CONSUMER" order={order} />

         {order.orderStatus === 'DELIVERED' && (
  <Box mt={4}>
    <Button
      size="sm"
      colorScheme="green"
      leftIcon={<MdRateReview />}
      onClick={() =>
        setExpandedOrderId((prev) => (prev === order.id ? null : order.id))
      }
    >
      {expandedOrderId === order.id ? 'Hide Feedback Form' : 'Rate This Order'}
    </Button>

    {expandedOrderId === order.id && (
      <Box mt={4}>
        <FarmFeedbackSection
          farmOrders={order.farmOrders}
          orderId={order.id}
        />
      </Box>
    )}
  </Box>
)}

        </Box>
      ))}
    </VStack>
  );
}
