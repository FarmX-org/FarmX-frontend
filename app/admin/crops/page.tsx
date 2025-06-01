'use client';
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spacer,
  Flex,
  useToast,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,

} from "@chakra-ui/react";
import { apiRequest } from "@/lib/api";
import { FiEdit, FiTrash2 } from 'react-icons/fi';


type CropDTO = {
  id?: number;
  name: string;
  category: string;
  season: string;
  description: string;
  averagePrice: number;
};

export default function AdminCropsDashboard() {
  const [crops, setCrops] = useState<CropDTO[]>([]);
  const [formData, setFormData] = useState<CropDTO>({
    name: "",
    category: "",
    season: "",
    description: "",
    averagePrice: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/crops", "GET");
      setCrops(data);
    } catch (error: any) {
      toast({ title: "Failed to fetch crops", description: error.message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({ name: "", category: "", season: "", description: "", averagePrice: 0 });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    try {
      const endpoint = isEditing ? `/crops/${editingId}` : "/crops";
      const method = isEditing ? "PUT" : "POST";
      await apiRequest(endpoint, method, formData);

      toast({
        title: isEditing ? "Crop updated successfully" : "Crop added successfully",
        status: "success",
      });

      resetForm();
      onClose();
      fetchCrops();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
  };

  const handleEdit = (crop: CropDTO) => {
    setFormData(crop);
    setIsEditing(true);
    setEditingId(crop.id ?? null);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    try {
      await apiRequest(`/crops/${id}`, "DELETE");
      toast({ title: "Crop deleted", status: "info" });
      fetchCrops();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, status: "error" });
    }
  };

  return (
    <Box p={6} mt={20}>
       <Box mt={10} bg="gray.50" minH="100vh">
  <Flex mb={6} alignItems="center">
    <Heading size="lg" color="green.600">
      Crop Management
    </Heading>
    <Spacer />
    <Button bg="green.500" color="white" _hover={{ bg: 'green.600' }} onClick={() => { resetForm(); onOpen(); }}>
      Add Crop
    </Button>
  </Flex>

  {loading ? (
    <Flex justify="center" mt={10}>
      <Spinner size="xl" />
    </Flex>
  ) : (
    <Box borderRadius="lg" overflow="hidden" boxShadow="md" bg="white">
      <Table variant="simple">
        <Thead bg="green.500">
          <Tr>
            <Th color="white">ID</Th>
            <Th color="white">Name</Th>
            <Th color="white">Category</Th>
            <Th color="white">Season</Th>
            <Th color="white">Description</Th>
            <Th color="white">Average Price</Th>
            <Th color="white">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {crops.map((crop) => (
            <Tr
              key={crop.id}
              _hover={{ bg: 'green.50' }}
              transition="background 0.2s"
            >
              <Td>{crop.id}</Td>
              <Td>{crop.name}</Td>
              <Td>{crop.category}</Td>
              <Td>{crop.season}</Td>
              <Td>{crop.description}</Td>
              <Td>{crop.averagePrice}</Td>
              <Td>
                <HStack>
                  <Button size="sm" onClick={() => handleEdit(crop)} colorScheme="green" leftIcon={<FiEdit />}
>
                   Edit
                  </Button>
                  <Button size="sm" onClick={() => handleDelete(crop.id!)} colorScheme="green" leftIcon={<FiTrash2 />}
>
                    Delete
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )}
</Box>


      <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Crop" : "Add Crop"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input name="name" value={formData.name} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Input name="category" value={formData.category} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Season</FormLabel>
                <Input name="season" value={formData.season} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input name="description" value={formData.description} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Average Price</FormLabel>
                <Input name="averagePrice" type="number" value={formData.averagePrice} onChange={handleChange} />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={() => { resetForm(); onClose(); }}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleSubmit}>
              {isEditing ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
