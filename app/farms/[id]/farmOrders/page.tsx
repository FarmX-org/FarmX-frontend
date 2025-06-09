'use client';
import { useEffect, useState } from 'react';
import {
  VStack,
  Heading,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { apiRequest } from '@/lib/api';
import { useParams } from 'next/navigation';
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

export default function FarmerOrdersPage() {
  const params = useParams();
  const farmId = parseInt(params?.id as string); 

  const [orders, setOrders] = useState<FarmOrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNaN(farmId)) {
      setError("Invalid farm ID");
      setLoading(false);
      return;
    }

    console.log("Fetching orders for farmId:", farmId); 

    apiRequest(`/orders/farm/${farmId}`)
      .then((res) => {
        console.log("API Response:", res);
        setOrders(res);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError('Failed to load farm orders');
      })
      .finally(() => setLoading(false));
  }, [farmId]);

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
      <Heading size="lg">Orders For My Farm</Heading>
      {orders.map(order => (
        <OrderCard key={order.id} type="FARMER" order={order} />
      ))}
    </VStack>
  );
}
