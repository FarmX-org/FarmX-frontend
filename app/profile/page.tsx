'use client';

import {
  Box,
  Heading,
  Text,
  Avatar,
  VStack,
  HStack,
  Divider,
  SimpleGrid,
  Spinner,
  useColorModeValue,
  Badge,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { MdVerified } from 'react-icons/md';
import UserModal from '@/components/UserModal';

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest('/users/me');
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box mt={20} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box mt={20} textAlign="center">
        <Text color="red.500">Failed to load user profile</Text>
      </Box>
    );
  }

  return (
    <Box
      maxW="6xl"
      mx="auto"
      mt={20}
      px={{ base: 4, md: 8 }}
      py={10}
      bgGradient="linear(to-br, gray.50, white)"
      borderRadius="3xl"
      boxShadow="dark-lg"
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor="gray.200"
    >
      <VStack spacing={10} align="stretch">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'center', md: 'flex-start' }}
          gap={6}
        >
          <HStack spacing={6} align="center">
            <Avatar
              size="2xl"
              name={user.name}
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${user.name}&background=ffffff&color=000000`
              }
              border="3px solid"
              borderColor="green.400"
              _hover={{ transform: 'scale(1.05)', transition: '0.3s' }}
            />
            <Box>
              <HStack>
                <Heading size="xl">{user.name}</Heading>
                <Icon as={MdVerified} color="green.400" boxSize={6} />
              </HStack>
              <Text fontSize="md" color="gray.600">
                {user.role}
              </Text>
              <Badge mt={1} px={2} py={1} colorScheme="green" borderRadius="full">
                {user.roles}
              </Badge>
            </Box>
          </HStack>
          <UserModal user={user} onUserUpdate={setUser} />
        </Flex>

        <Divider />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {[
            { label: 'Email', value: user.email },
            { label: 'Phone', value: user.phone || 'Not provided' },
            { label: 'Location', value: `${user.city || 'Unknown'} - ${user.street || 'Unknown'}` },
            { label: 'Role', value: user.roles },
          ].map((item, index) => (
            <Box
              key={index}
              p={5}
              borderRadius="xl"
              bg={useColorModeValue('gray.50', 'gray.700')}
              boxShadow="md"
              _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}
            >
              <Text fontWeight="bold" fontSize="sm" color="gray.500" mb={1}>
                {item.label}
              </Text>
              <Text fontSize="lg" color="gray.800">
                {item.value}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <Divider />

        <Box p={5} borderRadius="xl" bg="gray.100">
          <Heading size="md" mb={3}>
            Recent Activity
          </Heading>
          <Text fontSize="sm" color="gray.600">
            No recent activity.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
