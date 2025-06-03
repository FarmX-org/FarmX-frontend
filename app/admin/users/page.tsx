'use client';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button,
  Flex, Spinner, useToast, Text, Spacer, useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import AddUserModal from '@/components/AddUserModal'; 

type User = {
  username: string;
  name: string;
  phone: string;
  city: string;
  street: string;
  email: string;
  profilePhotoUrl?: string;
  roles: string[];
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiRequest('/users');
        setUsers(response);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUserAdded = (user: User) => {
    setUsers((prev) => [...(prev || []), user]);
  };

  if (loading) {
    return (
      <Flex justify="center" mt={20}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Flex mb={6} alignItems="center" mt={20}>
        <Heading size="lg" color="green.600">
          Users Management
        </Heading>
        <Spacer />
        <Button bg="green.500" color="white" _hover={{ bg: 'green.600' }} onClick={onOpen}>
          Add New User
        </Button>
      </Flex>
<AddUserModal isOpen={isOpen} onClose={onClose} onUserAdded={handleUserAdded} />


      <Box borderRadius="lg" overflow="auto" boxShadow="md" bg="white">
        <Table variant="simple">
          <Thead bg="green.500">
            <Tr>
              <Th color="white">Username</Th>
              <Th color="white">Name</Th>
              <Th color="white">Phone</Th>
              <Th color="white">City</Th>
              <Th color="white">Street</Th>
              <Th color="white">Email</Th>
              <Th color="white">Roles</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users?.map((user) => (
              <Tr key={user.username} _hover={{ bg: 'green.50' }} transition="background 0.2s">
                <Td>{user.username}</Td>
                <Td>{user.name}</Td>
                <Td>{user.phone}</Td>
                <Td>{user.city}</Td>
                <Td>{user.street}</Td>
                <Td>{user.email}</Td>
                <Td>{user.roles.join(', ')}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
