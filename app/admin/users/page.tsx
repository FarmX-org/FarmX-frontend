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
  Spacer,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};




const initialUsers: User[] = [
  { id: 1, name: 'Ahmad Ali', email: 'ahmad@example.com', role: 'Admin' },
  { id: 2, name: 'Laila Saleh', email: 'laila@example.com', role: 'Farmer' },
  { id: 3, name: 'Khaled Omar', email: 'khaled@example.com', role: 'User' },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);

  const handleDelete = (id: number) => {
    const filtered = users.filter((user) => user.id !== id);
    setUsers(filtered);
  };
  

  return (
    <Box>
      <Flex mb={6} alignItems="center">
        <Heading size="lg">Users Management</Heading>
        <Spacer />
        <Button colorScheme="teal">Add New User</Button>
      </Flex>

      <Table variant="simple" colorScheme="teal">
        <Thead bg="gray.200">
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th textAlign="center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map(({ id, name, email, role }) => (
            <Tr key={id}>
              <Td>{id}</Td>
              <Td>{name}</Td>
              <Td>{email}</Td>
              <Td>{role}</Td>
              <Td textAlign="center">
                <IconButton
                  aria-label="Edit user"
                  icon={<FiEdit />}
                  colorScheme="blue"
                  size="sm"
                  mr={2}
                  onClick={() => alert(`Edit user ${name} (To be implemented)`)}
                />
                <IconButton
                  aria-label="Delete user"
                  icon={<FiTrash2 />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDelete(id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
