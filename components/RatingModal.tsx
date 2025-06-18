'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  Box,
  HStack,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

interface Feedback {
  id: number;
  rating: number;
  comment: string;
  productName?: string | null;
}

interface FarmRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmId: number;
  farmName: string;
}

const FarmRatingModal = ({ isOpen, onClose, farmId, farmName }: FarmRatingModalProps) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (isOpen && farmId) {
    setLoading(true);
    apiRequest(`/feedback/farmer`)
      .then((allFeedbacks) => {
        const farmFeedbacks = allFeedbacks.filter((f: any) => f.farmId === farmId);
        setFeedbacks(farmFeedbacks);
      })
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false));
  }
}, [isOpen, farmId]);



  const farmFeedbacks = feedbacks.filter((fb) => !fb.productName);
  const productFeedbacks = feedbacks.filter((fb) => fb.productName);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>🌟 Feedback for {farmName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Text>Loading feedback...</Text>
          ) : feedbacks.length === 0 ? (
            <Text>No feedback available yet.</Text>
          ) : (
            <VStack spacing={6} align="stretch">
              {/* Farm Feedback Section */}
              {farmFeedbacks.length > 0 && (
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>🏡 Farm Feedback</Text>
                  <VStack spacing={4} align="stretch">
                    {farmFeedbacks.map((fb) => (
                      <Box key={fb.id} p={3} borderWidth={1} borderRadius="lg">
                        <HStack spacing={1}>
                          {Array(5)
                            .fill(null)
                            .map((_, i) => (
                              <Icon
                                key={i}
                                as={FaStar}
                                color={i < fb.rating ? 'yellow.400' : 'gray.300'}
                              />
                            ))}
                        </HStack>
                        <Text mt={2}>{fb.comment}</Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}

              {/* Divider */}
              {farmFeedbacks.length > 0 && productFeedbacks.length > 0 && <Divider />}

              {/* Product Feedback Section */}
              {productFeedbacks.length > 0 && (
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>🛒 Product Feedback</Text>
                  <VStack spacing={4} align="stretch">
                    {productFeedbacks.map((fb) => (
                      <Box key={fb.id} p={3} borderWidth={1} borderRadius="lg">
                        <Text fontWeight="semibold" fontSize="sm" color="gray.600">
                          Product: {fb.productName}
                        </Text>
                        <HStack spacing={1}>
                          {Array(5)
                            .fill(null)
                            .map((_, i) => (
                              <Icon
                                key={i}
                                as={FaStar}
                                color={i < fb.rating ? 'yellow.400' : 'gray.300'}
                              />
                            ))}
                        </HStack>
                        <Text mt={2}>{fb.comment}</Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FarmRatingModal;
