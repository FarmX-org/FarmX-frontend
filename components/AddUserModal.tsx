'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Select,
} from '@chakra-ui/react';
import { useState } from 'react';
import { apiRequest } from '@/lib/api';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: any) => void;
}

export default function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    phone: '',
    city: '',
    street: '',
    email: '',
    roles: '',
    password: ''
  });

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/users/add', 'POST', {
        ...formData,
        role: formData.roles,
        rawPassword: formData.password,

      });
      onUserAdded(response);
      toast({ title: 'User added successfully', status: 'success', duration: 3000, isClosable: true });
      onClose();
      setFormData({ username: '', name: '', phone: '', city: '', street: '', email: '', roles: '', password: '' });
    } catch (err: any) {
      toast({ title: 'Error adding user', description: err.message, status: 'error', duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} mt={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input name="username" value={formData.username} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input name="phone" value={formData.phone} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>City</FormLabel>
              <Input name="city" value={formData.city} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Street</FormLabel>
              <Input name="street" value={formData.street} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
             <FormLabel>Password</FormLabel>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} />
             </FormControl>

            <FormControl isRequired>
              <FormLabel>Role</FormLabel>
              <Select name="roles" value={formData.roles} onChange={handleChange}>
                <option value="">Select a role</option>
                <option value="Farmer">Farmer</option>
                <option value="Consumer">Consumer</option>
              </Select>
            </FormControl>
            <Button isLoading={loading} colorScheme="green" width="full" onClick={handleSubmit}>
              Add User
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
