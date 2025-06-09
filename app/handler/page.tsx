'use client';

import { useEffect, useState } from 'react';
import { Box, Heading, VStack, Spinner } from '@chakra-ui/react';
import OrderCard from '@/components/OrderList';
import { apiRequest } from '@/lib/api';

interface OrderItemDTO {
  productName: string;
  quantity: number;
  price: number;
}

interface HandlerOrderDTO {
  id: number;
  orderStatus: string;
  deliveryTime: string;
  totalAmount: number;
  items: OrderItemDTO[];
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

const HandlerOrdersPage = () => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data: OrderDTO[] = await apiRequest('/orders/handler', 'GET');
      console.log(data);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>Handler Orders</Heading>
      {loading ? (
        <Box textAlign="center" py={10}>
          <Spinner size="xl" />
        </Box>
      ) : (
        <VStack spacing={6} align="stretch">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              type="HANDLER"
              order={order}
              onUpdate={fetchOrders}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default HandlerOrdersPage;
