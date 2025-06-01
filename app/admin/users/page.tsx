'use client';

import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Flex,
  Spinner,
  useToast,
  Text,
  Spacer,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

type User = {
  username: string;
  name: string;
  email: string;
  roles: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiRequest('/users');
        console.log(response);
        setUsers(response);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);


  if (loading) {
    return (
      <Flex justify="center" mt={20}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Box p={8}>
        <Heading size="lg" mb={4}>
          Users Management
        </Heading>
        <Text>No users found.</Text>
      </Box>
    );
  }

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Flex mb={6} alignItems="center" mt={20}>
        <Heading size="lg" color="green.600">
          Users Management
        </Heading>
        <Spacer />
        <Button bg="green.500" color="white" _hover={{ bg: 'green.600' }}>
          Add New User
        </Button>
      </Flex>

      <Box borderRadius="lg" overflow="hidden" boxShadow="md" bg="white">
        <Table variant="simple">
          <Thead bg="green.500">
            <Tr>
              <Th color="white">UserName</Th>
              <Th color="white">Name</Th>
              <Th color="white">Email</Th>
              <Th color="white">Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map(({ username, name, email, roles }) => (
              <Tr
                key={username}
                _hover={{
                  bg: 'green.50',
                }}
                transition="background 0.2s"
              >
                <Td>{username}</Td>
                <Td>{name}</Td>
                <Td>{email}</Td>
                <Td>{roles}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
