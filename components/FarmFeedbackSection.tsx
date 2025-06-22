'use client';

import {
  Box,
  Text,
  VStack,
  Textarea,
  Button,
  Heading,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { useState } from 'react';
import { apiRequest } from '@/lib/api';

interface FarmOrderDTO {
  farmId: number;
  farmName: string;
  items: {
    productName: string;
    productId: number;
  }[];
}

interface Props {
  farmOrders: FarmOrderDTO[];
  orderId: number;
}

const FarmFeedbackSection = ({ farmOrders, orderId }: Props) => {
  const [farmRatings, setFarmRatings] = useState<Record<number, number>>({});
  const [farmFeedbacks, setFarmFeedbacks] = useState<Record<number, string>>({});
  const [productRatings, setProductRatings] = useState<Record<string, number>>({});
  const [productFeedbacks, setProductFeedbacks] = useState<Record<string, string>>({});
  const toast = useToast();

  const handleFarmSubmit = async (farmId: number) => {
    const farm = farmOrders.find((f) => f.farmId === farmId);
    const payload = {
      orderId,
      feedbackType: 'FARM',
      rating: farmRatings[farmId],
      comment: farmFeedbacks[farmId] || '',
      farmId,
      farmName: farm?.farmName || '',
    };

    try {
      await apiRequest('/feedback', 'POST', payload);
      toast({
        title: 'Feedback submitted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Failed to submit feedback.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleProductSubmit = async (
    farmId: number,
    productId: number,
    productName: string
  ) => {
    const key = `${farmId}-${productName}`;
    const payload = {
      orderId,
      feedbackType: 'PRODUCT',
      rating: productRatings[key],
      comment: productFeedbacks[key] || '',
      farmId,
      productId,
      productName,
    };

    try {
      await apiRequest('/feedback', 'POST', payload);
      toast({
        title: 'Product feedback submitted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Failed to submit product feedback.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {farmOrders.map((farmOrder) => (
        <Box key={farmOrder.farmId} p={4} borderWidth={1} borderRadius="lg">
          <Heading size="md" mb={2}>{farmOrder.farmName}</Heading>

          {/* Farm Rating */}
          <Text fontWeight="semibold" mb={1}>Rate the Farm:</Text>
          <Flex mb={2}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={24}
                style={{ cursor: 'pointer' }}
                color={star <= (farmRatings[farmOrder.farmId] || 0) ? '#FFD700' : '#E0E0E0'}
                onClick={() =>
                  setFarmRatings({ ...farmRatings, [farmOrder.farmId]: star })
                }
              />
            ))}
          </Flex>
          <Textarea
            placeholder="Optional feedback about the farm..."
            value={farmFeedbacks[farmOrder.farmId] || ''}
            onChange={(e) =>
              setFarmFeedbacks({ ...farmFeedbacks, [farmOrder.farmId]: e.target.value })
            }
          />
          <Button
            colorScheme="yellow"
            size="sm"
            mt={2}
            onClick={() => handleFarmSubmit(farmOrder.farmId)}
            isDisabled={!farmRatings[farmOrder.farmId]}
          >
            Submit Farm Feedback
          </Button>

          {/* Product Ratings */}
          <Box mt={5}>
            <Text fontWeight="semibold" mb={2}>Rate Purchased Products:</Text>
            {farmOrder.items.map((item, index) => {
              const key = `${farmOrder.farmId}-${item.productName}`;
              return (
                <Box key={index} mb={4}>
                  <Text mb={1}>{item.productName}</Text>
                  <Flex mb={1}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={20}
                        style={{ cursor: 'pointer' }}
                        color={star <= (productRatings[key] || 0) ? '#FFD700' : '#E0E0E0'}
                        onClick={() =>
                          setProductRatings({ ...productRatings, [key]: star })
                        }
                      />
                    ))}
                  </Flex>
                  <Textarea
                    size="sm"
                    placeholder="Optional feedback..."
                    value={productFeedbacks[key] || ''}
                    onChange={(e) =>
                      setProductFeedbacks({ ...productFeedbacks, [key]: e.target.value })
                    }
                  />
                  <Button
                    size="xs"
                    mt={1}
                    colorScheme="green"
                    onClick={() =>
                      handleProductSubmit(farmOrder.farmId, item.productId, item.productName)
                    }
                    isDisabled={!productRatings[key]}
                  >
                    Submit Product Feedback
                  </Button>
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
    </VStack>
  );
};

export default FarmFeedbackSection;
