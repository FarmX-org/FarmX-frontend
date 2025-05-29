'use client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { apiRequest } from '@/lib/api';

interface EditProfileModalProps {
  user: any;
  onUserUpdate: (updatedUser: any) => void;
}

export default function EditProfileModal({ user, onUserUpdate }: EditProfileModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    street: user?.street || '',
    email: user?.email || '',
  });

  const handleOpen = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      city: user?.city || '',
      street: user?.street || '',
      email: user?.email || '',
    });
    onOpen();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await apiRequest('/users/me', 'PUT', formData); 
      onUserUpdate(updatedUser);
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: 'Failed to update profile',
        description: error.message || 'An error occurred',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button colorScheme="green" variant="outline" onClick={handleOpen}>
        Edit Profile
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Phone</FormLabel>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>City</FormLabel>
              <Input
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Street</FormLabel>
              <Input
                value={formData.street}
                onChange={(e) => handleChange('street', e.target.value)}
              />
            </FormControl>


             <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSave} isLoading={isSaving}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
