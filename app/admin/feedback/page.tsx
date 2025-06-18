// app/admin/feedbacks/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { apiRequest } from '@/lib/api';
 type FeedbackDTO = {
  orderId: number;
  feedbackType: 'FARM' | 'PRODUCT';
  rating: number;
  comment: string;
  productId?: number;
  productName?: string;
  farmId?: number;
  farmName?: string;
};

const AdminFeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await apiRequest('/feedback/admin', 'GET');
        setFeedbacks(res);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const renderTypeBadge = (type: string) => {
    return (
      <Badge colorScheme={type === 'FARM' ? 'green' : 'blue'}>
        {type}
      </Badge>
    );
  };

  return (
    <Box p={8} mt={10}>
      <Heading mb={6}>All Feedbacks</Heading>

      {loading ? (
        <Spinner size="xl" />
      ) : feedbacks.length === 0 ? (
        <Text>No feedbacks available.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Type</Th>
              <Th>Farm</Th>
              <Th>Product</Th>
              <Th>Rating</Th>
              <Th>Comment</Th>
              <Th>Order ID</Th>
            </Tr>
          </Thead>
          <Tbody>
            {feedbacks.map((fb, index) => (
              <Tr key={index}>
                <Td>{renderTypeBadge(fb.feedbackType)}</Td>
                <Td>{fb.farmName || '—'}</Td>
                <Td>{fb.productName || '—'}</Td>
                <Td>{fb.rating}</Td>
                <Td>{fb.comment}</Td>
                <Td>{fb.orderId}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default AdminFeedbacksPage;
