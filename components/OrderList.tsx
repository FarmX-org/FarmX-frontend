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
  useToast,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  
} from '@chakra-ui/react';
import Countdown from 'react-countdown';
import { useState } from 'react';
import { apiRequest } from '@/lib/api';
import { useDisclosure } from '@chakra-ui/react';
import { PinInput, PinInputField } from '@chakra-ui/react';



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
  deliveryCode?: string; 
}

interface HandlerOrderDTO {
  id: number;
  orderStatus: string;
  deliveryTime: string;
  totalAmount: number;
  items: OrderItemDTO[];
}

interface OrderCardProps {
  type: 'CONSUMER' | 'FARMER' | 'HANDLER';
  order: OrderDTO | FarmOrderDTO | HandlerOrderDTO;
  onUpdate?: (orderId: number, status: string, deliveryTime?: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ type, order, onUpdate }) => {
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const sectionBg = useColorModeValue('white', 'gray.800');
  const toast = useToast();
const [statusFilter, setStatusFilter] = useState('');
const [orderIdFilter, setOrderIdFilter] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([] as (OrderDTO | FarmOrderDTO | HandlerOrderDTO)[]);
   const { isOpen, onOpen, onClose } = useDisclosure();
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState('');

const confirmDelivery = async () => {
    setSubmitting(true);
    try {
      await apiRequest(`/orders/handler/${order.id}/deliver?code=${otp}`, 'PUT');
      toast({
        title: 'Delivery confirmed!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      onUpdate?.(order.id, 'DELIVERED'); 

    } catch (err: any) {
      toast({
        title: 'Error confirming delivery',
        description: err?.response?.data?.message || 'pin code is incorrect',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };


  const handleRegenerateCode = async () => {
  try {
    await apiRequest(`/orders/consumer/${order.id}/regenerate-code`, 'PUT');
    toast({
      title: 'New code generated successfully!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  } catch (err: any) {
    toast({
      title: 'Failed to regenerate code',
      description: err?.response?.data?.message || 'An error occurred.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};

const showGenerateCode =async () => {
  try {
    const response = await apiRequest(`/orders/consumer/${order.id}/delivery-code`);
    setCode(response);
    console.log(response);
    toast({
      title: 'code Shown!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  } catch (err: any) {
    toast({
      title: 'Failed to show code',
      description: err?.response?.data?.message || 'An error occurred.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
}



  const getBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'orange';
      case 'ready': return 'green';
      case 'delivered': return 'blue';
      default: return 'gray';
    }
  };

  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <Box
      p={6}
      borderRadius="2xl"
      bg={cardBg}
      boxShadow="xl"
      transition="all 0.3s"
      _hover={{ transform: 'scale(1.01)', boxShadow: '2xl' }}
    >
      {children}
    </Box>
  );
  
  if (type === 'CONSUMER' && 'farmOrders' in order) {
    return (
      <>
      
      <CardWrapper> 
        <Heading size="lg" mb={2}>Order #{order.id}</Heading>
        <HStack justify="space-between" flexWrap="wrap">
          <Text>Status: <Badge colorScheme={getBadgeColor(order.orderStatus)}>{order.orderStatus}</Badge></Text>
          <Text>Total: <strong>{order.totalAmount}₪</strong></Text>
        </HStack>
        <Text mt={1}>
          Estimated Delivery: {order.orderStatus === 'READY' ? (
            <Countdown date={new Date(order.estimatedDeliveryTime)} />
          ) : 'Not ready yet'}
        </Text>
       {order.orderStatus === 'READY' && (
  <>
    <Button size="sm" backgroundColor="green.100" color={'green.800'} variant={'solid'} mt={2} marginRight={8} onClick={handleRegenerateCode}>
      Regenerate Delivery Code
    </Button>
    <Button size="sm" backgroundColor="green.100" color={'green.800'} variant={'solid'} mt={2} onClick={showGenerateCode}>
      Show Delivery Code
    </Button>

    {code && (
      <Box mt={3} p={3} bg="green.50" border="1px" borderColor="green.200" borderRadius="md">
        <Text fontWeight="bold" color="green.700" fontSize="xl">
          Delivery Code: {code}
        </Text>
      </Box>
    )}
  </>
)}



        <Divider my={4} />
        
        <VStack align="stretch" spacing={4}>
          {order.farmOrders.map((farm) => (
            <Box key={farm.id} p={4} bg={sectionBg} borderRadius="xl" boxShadow="md">
              <Heading size="sm" mb={2}>Farm: {farm.farmName}</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {farm.items.map((item, idx) => (
                  <Box key={idx} p={3} bg="gray.100" borderRadius="lg">
                    <Text><strong>Product:</strong> {item.productName}</Text>
                    <Text><strong>Quantity:</strong> {item.quantity}</Text>
                    <Text><strong>Price:</strong> {item.price}₪</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </VStack>
      </CardWrapper>
      </>
    );
  }

  if (type === 'HANDLER' && 'farmOrders' in order) {
    const [status, setStatus] = useState(order.orderStatus);
    const [estimatedTime, setEstimatedTime] = useState(
      order.estimatedDeliveryTime ? order.estimatedDeliveryTime.slice(0, 16).replace(' ', 'T') : ''
    );

    const formatToIsoLocalDateTime = (value: string) => {
      const date = new Date(value);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const formattedTime = estimatedTime ? formatToIsoLocalDateTime(estimatedTime) : '';

    const handleUpdate = async () => {
      try {
        const url = `/orders/handler/${order.id}/status?status=${encodeURIComponent(status)}&estimatedDeliveryTime=${encodeURIComponent(formattedTime)}`;
        await apiRequest(url, 'PUT');
        onUpdate?.(order.id, status, estimatedTime);
        toast({ title: 'Order updated!', status: 'success', duration: 3000, isClosable: true });
      } catch (error) {
        console.error('Error updating order:', error);
        toast({ title: 'Failed to update order.', status: 'error', duration: 3000, isClosable: true });
      }
    };

    return (
      <CardWrapper>
        <Heading size="lg" mb={2}>Order #{order.id}</Heading>
        <Text><strong>Total:</strong> {order.totalAmount}₪</Text>

        <Text mt={2}>Status:</Text>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="PENDING">PENDING</option>
          <option value="READY">READY</option>
          <option value="DELIVERED">DELIVERED</option>
        </Select>

        <Text mt={2}>Estimated Delivery Time:</Text>
        <Input type="datetime-local" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />

        <Button mt={3} colorScheme="green" onClick={handleUpdate}>Save</Button>

        {status === 'READY' && (
  <>
    <Button mt={3} colorScheme="green" variant={'outline'} onClick={onOpen}>
       Confirm Delivery
    </Button>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Delivery for Order #{order.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <HStack spacing={4} justify="center" mt={4}>
  <PinInput
    otp
    onComplete={(value) => setOtp(value)}
  >
    {[...Array(6)].map((_, idx) => (
      <PinInputField
        key={idx}
        borderRadius="md"
        borderWidth="2px"
        borderColor="green.500"
        _focus={{ borderColor: "green.700", boxShadow: "0 0 0 2px #38A169" }}
        _invalid={{ borderColor: "red.500" }}
        w="40px"
        h="50px"
        fontSize="lg"
        textAlign="center"
      />
    ))}
  </PinInput>
</HStack>


        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={confirmDelivery}
            isLoading={submitting}
          >
            Confirm
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
)}


        <Divider my={4} />
        <VStack align="stretch" spacing={4}>
          {order.farmOrders.map((farm) => (
            <Box key={farm.id} p={4} bg={sectionBg} borderRadius="xl" boxShadow="md">
              <Heading size="sm" mb={2}>Farm: {farm.farmName}</Heading>
              <Text>Status: <Badge colorScheme={getBadgeColor(farm.orderStatus)}>{farm.orderStatus}</Badge></Text>
              {farm.orderStatus === 'READY' && farm.deliveryTime ? (
                <Text>Delivery In: <Countdown date={new Date(farm.deliveryTime)} /></Text>
              ) : <Text>Delivery Time: Not ready yet</Text>}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {farm.items.map((item, idx) => (
                  <Box key={idx} p={3} bg="gray.100" borderRadius="lg">
                    <Text><strong>Product:</strong> {item.productName}</Text>
                    <Text><strong>Quantity:</strong> {item.quantity}</Text>
                    <Text><strong>Price:</strong> {item.price}₪</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </VStack>
      </CardWrapper>
    );
  }

  if (type === 'FARMER' && 'farmName' in order) {
    const [status, setStatus] = useState(order.orderStatus);
    const [deliveryTime, setDeliveryTime] = useState(
      order.deliveryTime ? order.deliveryTime.slice(0, 16) : ''
    );

    const handleUpdate = async () => {
      try {
        let url = `/orders/farm-order/${order.id}/status?status=${encodeURIComponent(status)}`;
        if (deliveryTime) url += `&deliveryTime=${encodeURIComponent(deliveryTime + ':00')}`;
        await apiRequest(url, 'PUT');
        onUpdate?.(order.id, status, deliveryTime);
        toast({ title: 'Order updated!', status: 'success', duration: 3000, isClosable: true });
      } catch (error) {
        console.error('Error updating order:', error);
        toast({ title: 'Failed to update order.', status: 'error', duration: 3000, isClosable: true });
      }
    };

    return (
      <CardWrapper>
        <Heading size="lg" mb={2}>Order #{order.id}</Heading>
        <Text><strong>Farm:</strong> {order.farmName}</Text>
        <Text>Status:</Text>
        <Select value={status} onChange={(e ) => setStatus(e.target.value)}>
          <option value="PENDING">PENDING</option>
          <option value="READY">READY</option>
          <option value="DELIVERED">DELIVERED</option>
        </Select>

        <Text mt={2}>Delivery Time:</Text>
        <Input type="datetime-local" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />

        <Button mt={3} colorScheme="green" onClick={handleUpdate}>Save</Button>

        <Divider my={4} />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          {order.items.map((item, idx) => (
            <Box key={idx} p={3} bg="gray.100" borderRadius="lg">
              <Text><strong>Product:</strong> {item.productName}</Text>
              <Text><strong>Quantity:</strong> {item.quantity}</Text>
              <Text><strong>Price:</strong> {item.price}₪</Text>
            </Box>
          ))}
        </SimpleGrid>
      </CardWrapper>
    );
  }

  return null;
};

export default OrderCard;
