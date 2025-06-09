// components/OrderCard.tsx
'use client';
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  SimpleGrid,
  Badge,
  Input,
  Button,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import Countdown from 'react-countdown';
import { useState } from 'react';
import { apiRequest } from '@/lib/api';

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

interface OrderCardProps {
  type: 'CONSUMER' | 'FARMER';
  order: OrderDTO | FarmOrderDTO;
}

const OrderCard: React.FC<OrderCardProps> = ({ type, order }) => {
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const sectionBg = useColorModeValue('white', 'gray.800');

  const getBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'ready':
        return 'green';
      case 'delivered':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const [status, setStatus] = useState(order.orderStatus);
  const [deliveryTime, setDeliveryTime] = useState(
    'deliveryTime' in order ? order.deliveryTime : ''
  );

  const handleUpdate = async () => {
  try {
    let url = `/orders/farm-order/${order.id}/status?status=${encodeURIComponent(status)}`;

    if (deliveryTime) {
      url += `&deliveryTime=${encodeURIComponent(deliveryTime)}`;
    }

    await apiRequest(url, 'PUT');

    alert('Order updated!');
  } catch (error) {
    console.error('Error updating order:', error);
    alert('Failed to update order.');
  }
};


  if (type === 'CONSUMER') {
    const orderDTO = order as OrderDTO;
    return (
      <Box p={6} borderRadius="xl" bg={cardBg} boxShadow="md">
        <Heading size="md" mb={2}>Order #{orderDTO.id}</Heading>
        <Text>Status: <Badge colorScheme={getBadgeColor(orderDTO.orderStatus)}>{orderDTO.orderStatus}</Badge></Text>
        <Text>Total: <strong>{orderDTO.totalAmount}₪</strong></Text>
        <Text>
          Estimated Delivery:{' '}
          {orderDTO.orderStatus === 'READY' ? (
            <Countdown date={new Date(orderDTO.estimatedDeliveryTime)} />
          ) : (
            'Not ready yet'
          )}
        </Text>

        <Divider my={4} />

        <VStack align="stretch" spacing={4}>
          {orderDTO.farmOrders.map((farm) => (
            <Box key={farm.id} p={4} bg={sectionBg} borderRadius="lg">
              <Heading size="sm" mb={2}>Farm: {farm.farmName}</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {farm.items.map((item, idx) => (
                  <Box key={idx} p={3} bg="gray.100" borderRadius="md">
                    <Text><strong>Product:</strong> {item.productName}</Text>
                    <Text><strong>Quantity:</strong> {item.quantity}</Text>
                    <Text><strong>Price:</strong> {item.price}₪</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </VStack>
      </Box>
    );
  }

  const farmOrder = order as FarmOrderDTO;
  return (
    <Box p={6} borderRadius="xl" bg={cardBg} boxShadow="md">
      <Heading size="md" mb={2}>Order #{farmOrder.id}</Heading>
      <Text>Farm: <strong>{farmOrder.farmName}</strong></Text>

      <Text>Status:</Text>
<Select value={status} onChange={(e) => setStatus(e.target.value)}>
  <option value="PENDING">PENDING</option>
  <option value="READY">READY</option>
  <option value="DELIVERED">DELIVERED</option>
</Select>
      <Text mt={2}>Delivery Time:</Text>
      <Input
        type="datetime-local"
        value={deliveryTime}
        onChange={(e) => setDeliveryTime(e.target.value)}
      />

      <Button mt={3} colorScheme="green" onClick={handleUpdate}>Save</Button>

      <Divider my={4} />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
        {farmOrder.items.map((item, idx) => (
          <Box key={idx} p={3} bg="gray.100" borderRadius="md">
            <Text><strong>Product:</strong> {item.productName}</Text>
            <Text><strong>Quantity:</strong> {item.quantity}</Text>
            <Text><strong>Price:</strong> {item.price}₪</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default OrderCard;
